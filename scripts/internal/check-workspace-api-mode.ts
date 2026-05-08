import fs from "node:fs";
import path from "node:path";
import {
  checkBackendHealth,
  getHealth,
  runResearch,
  generateReport,
  runPipeline,
  runBacktest,
  compareStrategies,
  evaluateSignals,
  getProviderConformance,
  runPortfolioReview,
  runBacktestV2,
} from "@/lib/api/client";
import {
  adaptResearchRunToResearchCard,
  adaptReportToSections,
  adaptPipelineToPlannerTrace,
  adaptStrategyComparisonToTable,
  adaptSignalEvaluationToExplorer,
  adaptPortfolioReview,
  adaptBacktestV2Summary,
} from "@/lib/api/adapters";

type BridgeMode = "mock" | "proxy" | "direct";

type CheckResult = {
  name: string;
  ok: boolean;
  source?: string;
  latencyMs: number;
  responseShape: string[];
  error?: string;
};

function parseArgs(argv: string[]) {
  const parsed = {
    strict: false,
    json: false,
    baseUrl: process.env.TW_AI_RESEARCH_API_BASE_URL || "http://127.0.0.1:8000",
    bridgeMode: "direct" as BridgeMode,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--strict") parsed.strict = true;
    else if (arg === "--json") parsed.json = true;
    else if (arg === "--base-url" && argv[i + 1]) {
      parsed.baseUrl = argv[i + 1];
      i += 1;
    } else if (arg === "--bridge-mode" && argv[i + 1]) {
      const mode = argv[i + 1] as BridgeMode;
      if (["mock", "proxy", "direct"].includes(mode)) parsed.bridgeMode = mode;
      i += 1;
    }
  }

  return parsed;
}

function shapeKeys(input: unknown): string[] {
  if (!input || typeof input !== "object") return [typeof input];
  return Object.keys(input as Record<string, unknown>).slice(0, 10);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
  process.env.NEXT_PUBLIC_API_BRIDGE_MODE = args.bridgeMode;
  process.env.TW_AI_RESEARCH_API_BASE_URL = args.baseUrl;

  const runtimeOverrides = {
    mode: "api" as const,
    apiBaseUrl: args.baseUrl,
    apiBridgeMode: args.bridgeMode,
    fallbackToMock: false,
  };

  const checks: CheckResult[] = [];
  const warnings: string[] = [];

  const health = await checkBackendHealth({ runtimeOverrides });
  const reachable = health.reachable;

  if (!reachable) {
    warnings.push(`Backend unreachable: ${health.error ?? "unknown error"}`);
  }

  async function runCheck(name: string, fn: () => Promise<void>) {
    const started = Date.now();
    try {
      await fn();
      checks.push({ name, ok: true, latencyMs: Date.now() - started, responseShape: ["ok"] });
    } catch (error) {
      checks.push({
        name,
        ok: false,
        latencyMs: Date.now() - started,
        responseShape: ["error"],
        error: error instanceof Error ? error.message : "unknown_error",
      });
    }
  }

  if (reachable) {
    await runCheck("health", async () => {
      const result = await getHealth({ runtimeOverrides });
      if (!result.ok) throw new Error(result.error.message);
    });

    await runCheck("runResearch", async () => {
      const result = await runResearch(
        { tickers: ["2330"], as_of_date: "2026-05-06", provider: "mock", include_phase2_agents: true },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const adapted = adaptResearchRunToResearchCard(result.data, result.meta);
      checks.push({
        name: "runResearch.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(adapted),
      });
    });

    await runCheck("generateReport", async () => {
      const result = await generateReport(
        {
          ticker: "2330",
          as_of_date: "2026-05-06",
          provider: "mock",
          llm_mode: "mock",
          strict_quality: true,
        },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const sections = adaptReportToSections(result.data);
      checks.push({
        name: "generateReport.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: [`sections:${sections.length}`],
      });
    });

    await runCheck("runPipeline", async () => {
      const result = await runPipeline(
        {
          ticker: "2330",
          as_of_date: "2026-05-06",
          provider: "mock",
          llm_mode: "mock",
          include_reflection: true,
        },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const adapted = adaptPipelineToPlannerTrace(result.data, result.meta);
      checks.push({
        name: "runPipeline.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(adapted),
      });
    });

    await runCheck("runBacktest", async () => {
      const result = await runBacktest(
        {
          tickers: ["2330", "2317", "2454", "2308"],
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          rebalance: "monthly",
          provider: "mock",
          mode: "portfolio_manager",
          include_phase2_agents: true,
        },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      checks.push({
        name: "runBacktest.shape",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(result.data),
      });
    });

    await runCheck("runPortfolioReview", async () => {
      const result = await runPortfolioReview(
        {
          tickers: ["2330", "2317", "2454", "2308", "0050"],
          as_of_date: "2026-05-06",
          provider: "mock",
          include_phase2_agents: true,
        },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const adapted = adaptPortfolioReview(result.data, result.meta);
      checks.push({
        name: "runPortfolioReview.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(adapted),
      });
    });

    await runCheck("runBacktestV2", async () => {
      const result = await runBacktestV2(
        {
          tickers: ["2330", "2317", "2454", "2308"],
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          rebalance: "monthly",
          provider: "mock",
          mode: "portfolio_manager",
          include_phase2_agents: true,
        },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const adapted = adaptBacktestV2Summary(result.data, result.meta);
      checks.push({
        name: "runBacktestV2.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(adapted),
      });
    });

    await runCheck("compareStrategies", async () => {
      const result = await compareStrategies(
        {
          tickers: ["2330", "2317", "2454", "2308"],
          start_date: "2024-01-01",
          end_date: "2024-12-31",
          rebalance: "monthly",
          provider: "mock",
        },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const adapted = adaptStrategyComparisonToTable(result.data, result.meta);
      checks.push({
        name: "compareStrategies.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(adapted),
      });
    });

    await runCheck("evaluateSignals", async () => {
      const result = await evaluateSignals(
        { tickers: ["2330", "2317", "2454", "2308", "0050"], as_of_date: "2026-05-06", provider: "mock" },
        { runtimeOverrides },
      );
      if (!result.ok) throw new Error(result.error.message);
      const adapted = adaptSignalEvaluationToExplorer(result.data, result.meta);
      checks.push({
        name: "evaluateSignals.adapter",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(adapted),
      });
    });

    await runCheck("providerConformance", async () => {
      const result = await getProviderConformance({ runtimeOverrides });
      if (!result.ok) throw new Error(result.error.message);
      checks.push({
        name: "providerConformance.shape",
        ok: true,
        source: result.meta.source,
        latencyMs: 0,
        responseShape: shapeKeys(result.data),
      });
    });
  }

  const passed = reachable ? checks.every((check) => check.ok) : !args.strict;

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl: args.baseUrl,
    strict: args.strict,
    bridgeMode: args.bridgeMode,
    reachable,
    passed,
    checks,
    warnings,
    note: "Workspace API-mode integration validation only. No trading or broker execution.",
  };

  const outPath = path.resolve(process.cwd(), "artifacts/workspace-api-mode-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else if (!reachable) {
    console.log(`check-workspace-api-mode: backend unreachable at ${args.baseUrl}`);
  } else {
    console.log(`check-workspace-api-mode: ${passed ? "OK" : "FAILED"} (${checks.length} checks)`);
  }

  if (!passed) {
    process.exit(1);
  }
}

void run();
