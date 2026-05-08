import fs from "node:fs";
import path from "node:path";
import { startMockBackendServer } from "@/lib/testing/mock-backend-server";
import { runBackendProxy } from "@/lib/api/backend-proxy";
import { checkBackendHealth, runResearch, getProviderConformance, getSystemStatus } from "@/lib/api/client";
import type { BackendHarnessReport } from "@/lib/testing/backend-harness-types";

async function run() {
  const handle = await startMockBackendServer();
  const checks: BackendHarnessReport["checks"] = [];
  const warnings: string[] = [];

  process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
  process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "direct";
  process.env.TW_AI_RESEARCH_API_BASE_URL = handle.baseUrl;

  try {
    const proxyHealth = await runBackendProxy<{ status: string }>({ path: "/health", method: "GET" });
    checks.push({
      name: "proxy_health",
      passed: proxyHealth.ok,
      details: proxyHealth.ok ? proxyHealth.data.status : proxyHealth.error.message,
    });

    const health = await checkBackendHealth({
      runtimeOverrides: {
        mode: "api",
        apiBaseUrl: handle.baseUrl,
        apiBridgeMode: "direct",
      },
    });
    checks.push({
      name: "client_health",
      passed: health.reachable,
      details: `status=${health.status}`,
    });

    const research = await runResearch(
      { symbol: "2330" },
      {
        runtimeOverrides: {
          mode: "api",
          apiBaseUrl: handle.baseUrl,
          apiBridgeMode: "direct",
          fallbackToMock: true,
        },
      },
    );
    checks.push({
      name: "client_research",
      passed: research.ok,
      details: research.ok ? `source=${research.meta.source}` : research.error.message,
    });

    const systemStatus = await getSystemStatus({
      runtimeOverrides: {
        mode: "api",
        apiBaseUrl: handle.baseUrl,
        apiBridgeMode: "direct",
      },
    });
    checks.push({
      name: "client_system_status",
      passed: systemStatus.ok,
      details: systemStatus.ok ? `source=${systemStatus.meta.source}` : systemStatus.error.message,
    });

    const conformance = await getProviderConformance({
      runtimeOverrides: {
        mode: "api",
        apiBaseUrl: handle.baseUrl,
        apiBridgeMode: "direct",
      },
    });
    checks.push({
      name: "client_conformance",
      passed: conformance.ok,
      details: conformance.ok ? `source=${conformance.meta.source}` : conformance.error.message,
    });

    const report: BackendHarnessReport = {
      checkedAt: new Date().toISOString(),
      passed: checks.every((check) => check.passed),
      baseUrl: handle.baseUrl,
      checks,
      routeHits: handle.getHits(),
      warnings,
    };

    const outPath = path.resolve(process.cwd(), "artifacts/backend-harness-report.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`check-api-bridge-with-harness: wrote ${outPath}`);

    if (!report.passed) {
      process.exitCode = 1;
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "unknown bridge error");
    const outPath = path.resolve(process.cwd(), "artifacts/backend-harness-report.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          passed: false,
          baseUrl: handle.baseUrl,
          checks,
          routeHits: handle.getHits(),
          warnings,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } finally {
    await handle.close();
  }
}

void run();
