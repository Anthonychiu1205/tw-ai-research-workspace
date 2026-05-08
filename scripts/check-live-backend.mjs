import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const runResearch = args.has("--run-research");
const baseUrl = process.env.TW_AI_RESEARCH_API_BASE_URL || "http://localhost:8000";
const outPath = path.resolve(process.cwd(), "artifacts/live-backend-smoke.json");

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }
  try {
    return { ok: true, status: res.status, data: await res.json() };
  } catch {
    return { ok: false, status: res.status, data: null };
  }
}

async function run() {
  const checks = [];
  const warnings = [];
  let reachable = false;

  try {
    const health = await fetchJson(`${baseUrl}/health`);
    reachable = health.ok;
    checks.push({ name: "health", passed: health.ok, status: health.status });

    if (reachable) {
      const provider = await fetchJson(`${baseUrl}/v1/system/provider`);
      checks.push({ name: "system_provider", passed: provider.ok, status: provider.status });

      const storage = await fetchJson(`${baseUrl}/v1/system/storage`);
      checks.push({ name: "system_storage", passed: storage.ok, status: storage.status });

      if (runResearch) {
        const research = await fetchJson(`${baseUrl}/v1/research-runs`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ symbol: "2330", includePhase2Agents: true }),
        });
        checks.push({ name: "research_run", passed: research.ok, status: research.status });
      }
    } else {
      warnings.push("Backend unreachable; live smoke ran in dry-run unavailable mode.");
    }
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "unknown network error");
  }

  const passed = reachable ? checks.every((item) => item.passed) : !strict;

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    strict,
    runResearch,
    reachable,
    passed,
    checks,
    warnings,
    note: "Live backend smoke is optional and never executes trading.",
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (!reachable && !strict) {
    console.log("check-live-backend: backend unavailable (non-strict mode) -> pass");
    process.exit(0);
  }

  if (!passed) {
    console.error("check-live-backend: failed");
    process.exit(1);
  }

  console.log("check-live-backend: OK");
}

void run();
