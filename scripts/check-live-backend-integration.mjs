import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const parsed = {
    strict: false,
    json: false,
    baseUrl: process.env.TW_AI_RESEARCH_API_BASE_URL || "http://127.0.0.1:8000",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--strict") parsed.strict = true;
    else if (arg === "--json") parsed.json = true;
    else if (arg === "--base-url" && argv[i + 1]) {
      parsed.baseUrl = argv[i + 1];
      i += 1;
    }
  }

  return parsed;
}

function shapeSummary(data) {
  if (data === null || data === undefined) return { type: "nullish" };
  if (Array.isArray(data)) return { type: "array", length: data.length };
  if (typeof data === "object") return { type: "object", keys: Object.keys(data).slice(0, 12) };
  return { type: typeof data, valuePreview: String(data).slice(0, 80) };
}

async function request(baseUrl, entry) {
  const started = Date.now();
  let status = 0;
  try {
    const res = await fetch(`${baseUrl}${entry.path}`, {
      method: entry.method,
      headers: entry.method === "POST" ? { "content-type": "application/json" } : undefined,
      body: entry.method === "POST" ? JSON.stringify(entry.body ?? {}) : undefined,
    });
    status = res.status;
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return {
      endpoint: entry.path,
      method: entry.method,
      status,
      ok: res.ok,
      latencyMs: Date.now() - started,
      responseShape: shapeSummary(data),
      error: res.ok ? undefined : `HTTP ${status}`,
    };
  } catch (error) {
    return {
      endpoint: entry.path,
      method: entry.method,
      status,
      ok: false,
      latencyMs: Date.now() - started,
      responseShape: { type: "error" },
      error: error instanceof Error ? error.message : "network_error",
    };
  }
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  const checks = [
    { method: "GET", path: "/health" },
    { method: "GET", path: "/v1/system/storage" },
    { method: "GET", path: "/v1/system/provider" },
    {
      method: "POST",
      path: "/v1/research-runs",
      body: {
        tickers: ["2330"],
        as_of_date: "2026-05-06",
        provider: "mock",
        include_phase2_agents: true,
      },
    },
    {
      method: "POST",
      path: "/v1/reports/research",
      body: {
        ticker: "2330",
        as_of_date: "2026-05-06",
        provider: "mock",
        llm_mode: "mock",
        strict_quality: true,
      },
    },
    {
      method: "POST",
      path: "/v1/research-pipelines",
      body: {
        ticker: "2330",
        as_of_date: "2026-05-06",
        provider: "mock",
        llm_mode: "mock",
        include_reflection: true,
      },
    },
    {
      method: "POST",
      path: "/v1/portfolio/review",
      body: {
        tickers: ["2330", "2317", "2454", "2308", "0050"],
        as_of_date: "2026-05-06",
        provider: "mock",
        include_phase2_agents: true,
      },
    },
    {
      method: "POST",
      path: "/v1/backtests",
      body: {
        tickers: ["2330", "2317", "2454", "2308"],
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        rebalance: "monthly",
        provider: "mock",
        mode: "portfolio_manager",
        include_phase2_agents: true,
      },
    },
    {
      method: "POST",
      path: "/v1/strategies/compare",
      body: {
        tickers: ["2330", "2317", "2454", "2308"],
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        rebalance: "monthly",
        provider: "mock",
      },
    },
    {
      method: "POST",
      path: "/v1/evaluations/signals",
      body: {
        tickers: ["2330", "2317", "2454", "2308", "0050"],
        as_of_date: "2026-05-06",
        provider: "mock",
      },
    },
    { method: "GET", path: "/v1/provider/conformance?provider=mock&dry_run=true" },
  ];

  const health = await request(args.baseUrl, checks[0]);
  const reachable = health.ok;

  const results = [health];
  if (reachable) {
    for (const entry of checks.slice(1)) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await request(args.baseUrl, entry));
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl: args.baseUrl,
    strict: args.strict,
    reachable,
    passed: reachable ? results.every((item) => item.ok) : !args.strict,
    checks: results,
    warnings: reachable ? [] : ["Backend unavailable; integration checks skipped in non-strict mode."],
    note: "Research integration only. No trading execution or broker integration.",
  };

  const outPath = path.resolve(process.cwd(), "artifacts/live-backend-integration-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (!reachable) {
    console.log(`check-live-backend-integration: backend unreachable at ${args.baseUrl}`);
  } else {
    console.log(`check-live-backend-integration: ${report.passed ? "OK" : "FAILED"} (${results.length} checks)`);
  }

  if (!report.passed) {
    process.exit(1);
  }
}

void run();
