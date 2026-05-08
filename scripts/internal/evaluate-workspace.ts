import fs from "node:fs";
import path from "node:path";
import { evaluateWorkspace } from "@/lib/evaluation/workspace-evaluator";

async function run() {
  const report = await evaluateWorkspace(process.cwd());
  const outPath = path.resolve(process.cwd(), "artifacts/workspace-evaluation.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (!report.passed) {
    console.error(`evaluate-workspace: failed (${report.summary})`);
    process.exit(1);
  }

  console.log(`evaluate-workspace: OK (${report.summary})`);
}

void run();
