import fs from "node:fs";
import path from "node:path";
import type { WorkspaceEvaluationCheck } from "@/lib/evaluation/workspace-evaluation-types";

const riskyPhrases = [
  "guaranteed returns",
  "risk-free",
  "place order",
  "execute trade",
  "broker integration",
  "buy recommendation",
  "sell recommendation",
];

const allowNegativePatterns = [
  /no\s+broker\s+integration/i,
  /not\s+financial\s+advice/i,
  /no\s+trading/i,
  /never provide market action calls/i,
];

export function evaluateSafetyInText(text: string, label: string): WorkspaceEvaluationCheck[] {
  const checks: WorkspaceEvaluationCheck[] = [];

  for (const phrase of riskyPhrases) {
    const lower = text.toLowerCase();
    const hasPhrase = lower.includes(phrase);
    let allowed = false;

    if (hasPhrase) {
      const idx = lower.indexOf(phrase);
      const context = lower.slice(Math.max(0, idx - 60), idx + phrase.length + 60);
      allowed = allowNegativePatterns.some((pattern) => pattern.test(context));
    }

    checks.push({
      name: `safety_${label}_${phrase.replace(/\s+/g, "_")}`,
      category: "safety",
      passed: !hasPhrase || allowed,
      severity: hasPhrase && !allowed ? "error" : "info",
      details: hasPhrase ? (allowed ? `allowed negative context: ${phrase}` : `unsafe phrase: ${phrase}`) : `no hit: ${phrase}`,
    });
  }

  return checks;
}

export function evaluateSafetySources(rootDir: string): WorkspaceEvaluationCheck[] {
  const targets = ["README.md", "docs", "app", "components", "fixtures", "lib"];
  const checks: WorkspaceEvaluationCheck[] = [];

  for (const target of targets) {
    const full = path.resolve(rootDir, target);
    if (!fs.existsSync(full)) continue;

    if (fs.statSync(full).isFile()) {
      const text = fs.readFileSync(full, "utf-8");
      checks.push(...evaluateSafetyInText(text, target.replace(/[^a-z0-9]/gi, "_")));
      continue;
    }

    const files = walkFiles(full);
    for (const file of files) {
      const text = fs.readFileSync(file, "utf-8");
      const label = path.relative(rootDir, file).replace(/[^a-z0-9]/gi, "_");
      checks.push(...evaluateSafetyInText(text, label));
    }
  }

  return checks;
}

function walkFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (full.includes(`${path.sep}lib${path.sep}evaluation`)) continue;
    if (entry.isDirectory()) {
      files.push(...walkFiles(full));
    } else if (/\.(ts|tsx|js|mjs|json|md|txt)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}
