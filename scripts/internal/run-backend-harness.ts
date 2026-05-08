import fs from "node:fs";
import path from "node:path";
import { startMockBackendServer } from "@/lib/testing/mock-backend-server";
import type { BackendHarnessReport } from "@/lib/testing/backend-harness-types";

async function run() {
  const handle = await startMockBackendServer();
  const checks: BackendHarnessReport["checks"] = [];

  try {
    const health = await fetch(`${handle.baseUrl}/health`);
    checks.push({
      name: "health_endpoint",
      passed: health.ok,
      details: `status=${health.status}`,
    });

    const research = await fetch(`${handle.baseUrl}/v1/research-runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ symbol: "2330" }),
    });
    checks.push({
      name: "research_endpoint",
      passed: research.ok,
      details: `status=${research.status}`,
    });

    const report: BackendHarnessReport = {
      checkedAt: new Date().toISOString(),
      passed: checks.every((check) => check.passed),
      baseUrl: handle.baseUrl,
      checks,
      routeHits: handle.getHits(),
      warnings: [],
    };

    const outPath = path.resolve(process.cwd(), "artifacts/backend-harness-run.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`run-backend-harness: wrote ${outPath}`);

    if (!report.passed) {
      process.exitCode = 1;
    }
  } finally {
    await handle.close();
  }
}

void run();
