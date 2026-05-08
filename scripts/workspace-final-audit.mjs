import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/workspace-final-audit.json");

const requiredDocs = [
  "docs/runtime.md",
  "docs/api-integration.md",
  "docs/workspace-ux.md",
  "docs/scenarios.md",
  "docs/share_bundle.md",
  "docs/backend_live_mode.md",
  "docs/workspace_final_audit.md",
  "docs/i18n.md",
  "docs/portfolio_workspace.md",
  "docs/backtesting_v2_workspace.md",
  "docs/multi_model_runtime.md",
  "docs/live_backend_integration.md",
];

const requiredScripts = [
  "scripts/check-env.mjs",
  "scripts/smoke-test.mjs",
  "scripts/check-pages.mjs",
  "scripts/workspace-final-audit.mjs",
  "scripts/generate-share-bundle.mjs",
  "scripts/check-live-backend-integration.mjs",
  "scripts/check-workspace-api-mode.mjs",
];

const requiredPackageScripts = ["dev", "build", "start", "test:run", "typecheck", "smoke", "lint"];
const forbiddenPhrases = [
  "buy recommendation",
  "sell recommendation",
  "guaranteed returns",
  "risk-free",
  "place order",
  "execute trade",
  "broker integration",
];

const allowNegativeContext = ["no broker integration", "not broker integration"];

function existsAll(items) {
  return items.map((file) => ({ file, exists: fs.existsSync(path.resolve(root, file)) }));
}

function readPackageScripts() {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(root, "package.json"), "utf-8"));
  return pkg.scripts ?? {};
}

function scanForbidden() {
  const dirs = ["app", "components", "lib", "docs", "README.md"];
  const issues = [];

  const files = execSync(
    `rg --files ${dirs
      .map((d) => `"${d}"`)
      .join(" ")}`,
    { cwd: root, encoding: "utf-8" },
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const file of files) {
    if (file.startsWith("lib/evaluation/")) {
      continue;
    }
    const text = fs.readFileSync(path.resolve(root, file), "utf-8").toLowerCase();
    for (const phrase of forbiddenPhrases) {
      if (!text.includes(phrase)) continue;
      const index = text.indexOf(phrase);
      const windowStart = Math.max(0, index - 40);
      const context = text.slice(windowStart, index + phrase.length + 40);
      const hasNegativeContext =
        /\b(no|not|without)\b/.test(context) ||
        allowNegativeContext.some((needle) => context.includes(needle));
      if (hasNegativeContext) {
        continue;
      }
      issues.push({ file, phrase });
    }
  }

  return issues;
}

function ensureEnvMockDefault() {
  const envText = fs.readFileSync(path.resolve(root, ".env.example"), "utf-8");
  return envText.includes("NEXT_PUBLIC_WORKSPACE_MODE=mock");
}

function ensureSessionSchemaVersion() {
  const sessionText = fs.readFileSync(path.resolve(root, "lib/schemas/workspace.ts"), "utf-8");
  return sessionText.includes("workspace-session.v0.2");
}

function ensureNoTradingTools() {
  const toolText = fs.readFileSync(path.resolve(root, "lib/ai/tool-registry.ts"), "utf-8").toLowerCase();
  return !toolText.includes("trade") && !toolText.includes("broker") && !toolText.includes("order execution");
}

execSync("node scripts/generate-share-bundle.mjs", { cwd: root, stdio: "pipe" });

const docs = existsAll(requiredDocs);
const scripts = existsAll(requiredScripts);
const packageScripts = readPackageScripts();
const missingPackageScripts = requiredPackageScripts.filter((name) => !packageScripts[name]);
const forbiddenHits = scanForbidden();
const shareBundleExists = fs.existsSync(path.resolve(root, "artifacts/workspace-share-bundle.json"));
const readmeHasLiveIntegration = fs
  .readFileSync(path.resolve(root, "README.md"), "utf-8")
  .toLowerCase()
  .includes("live backend integration");

const passed =
  docs.every((item) => item.exists) &&
  scripts.every((item) => item.exists) &&
  missingPackageScripts.length === 0 &&
  forbiddenHits.length === 0 &&
  ensureEnvMockDefault() &&
  ensureSessionSchemaVersion() &&
  ensureNoTradingTools() &&
  shareBundleExists &&
  readmeHasLiveIntegration;

const report = {
  checkedAt: new Date().toISOString(),
  passed,
  docs,
  scripts,
  missingPackageScripts,
  forbiddenHits,
  envMockDefault: ensureEnvMockDefault(),
  sessionSchemaVersionPresent: ensureSessionSchemaVersion(),
  noTradingTools: ensureNoTradingTools(),
  shareBundleExists,
  readmeHasLiveIntegration,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!passed) {
  console.error("workspace-final-audit: failed");
  process.exit(1);
}

console.log("workspace-final-audit: OK");
