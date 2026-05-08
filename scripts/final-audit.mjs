import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/final-audit.json");

const commands = [
  "node scripts/check-env.mjs",
  ...(process.env.FINAL_AUDIT_SKIP_SMOKE === "1" ? [] : ["node scripts/smoke-test.mjs"]),
  "node scripts/check-backend-contract.mjs",
  "node scripts/check-backend-compatibility.mjs",
  "node scripts/evaluate-workspace.mjs",
  "node scripts/secret-scan.mjs",
  "node scripts/mock-boundary-check.mjs",
  "node scripts/export-workspace-schema.mjs",
  "node scripts/generate-workspace-demo-bundle.mjs",
  "node scripts/generate-share-bundle.mjs",
];

const checks = [];
let passed = true;

for (const command of commands) {
  try {
    execSync(command, { cwd: root, stdio: "pipe" });
    checks.push({ command, passed: true });
  } catch (error) {
    passed = false;
    checks.push({
      command,
      passed: false,
      error: error instanceof Error ? error.message : "unknown error",
    });
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  passed,
  checks,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!passed) {
  console.error("final-audit: failed");
  process.exit(1);
}

console.log("final-audit: OK");
