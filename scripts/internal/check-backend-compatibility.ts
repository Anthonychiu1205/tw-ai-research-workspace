import fs from "node:fs";
import path from "node:path";
import { buildBackendCompatibilityReport } from "@/lib/backend-contracts/compatibility";

const strict = process.argv.includes("--strict");
const report = buildBackendCompatibilityReport(process.cwd());
const outPath = path.resolve(process.cwd(), "artifacts/backend-compatibility-report.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!report.passed && strict) {
  console.error("check-backend-compatibility: failed");
  process.exit(1);
}

if (!report.backendArtifactsPresent) {
  console.log("check-backend-compatibility: OK (backend artifacts missing; warning-only mode)");
} else if (!report.passed) {
  console.log("check-backend-compatibility: WARN (non-strict mode)");
} else {
  console.log("check-backend-compatibility: OK");
}
