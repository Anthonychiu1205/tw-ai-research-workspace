import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const fixtureFiles = [
  "fixtures/demo/research-card-2330.json",
  "fixtures/demo/signal-matrix-watchlist.json",
  "fixtures/demo/evidence-timeline-2330.json",
  "fixtures/demo/report-sections-2330.json",
  "fixtures/demo/strategy-comparison.json",
  "fixtures/demo/planner-trace-2330.json",
  "fixtures/demo/session-demo.json",
  "fixtures/mock-api/research-run.json",
  "fixtures/mock-api/report.json",
  "fixtures/mock-api/pipeline-result.json",
  "fixtures/mock-api/signal-evaluation.json",
];

for (const f of fixtureFiles) {
  if (!fs.existsSync(path.join(root, f))) {
    throw new Error(`Missing fixture: ${f}`);
  }
}

execSync("npm run typecheck", { stdio: "inherit" });
execSync("npm run test:run", { stdio: "inherit" });
execSync(
  "npx tsx -e \"import('./lib/api/client.ts').then((m) => { const api = m.default ?? m; return Promise.all([api.getHealth(), api.getSystemStatus()]); }).then(()=>console.log('api-client-import-ok'))\"",
  { stdio: "inherit" },
);
execSync("node scripts/generate-workspace-demo-bundle.mjs", { stdio: "inherit" });
execSync("node scripts/check-pages.mjs", { stdio: "inherit" });

console.log("smoke-test: OK");
