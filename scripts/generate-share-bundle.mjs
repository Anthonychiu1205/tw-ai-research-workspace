import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/workspace-share-bundle.json");
const FIXED_CREATED_AT = "2026-05-08T00:00:00.000Z";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, filePath), "utf-8"));
}

function stableSerialize(input) {
  if (Array.isArray(input)) {
    return `[${input.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (!input || typeof input !== "object") {
    return JSON.stringify(input);
  }

  const entries = Object.entries(input).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableSerialize(v)}`).join(",")}}`;
}

function computeBundleChecksum(input) {
  const value = stableSerialize(input);
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return `bundle_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

const sessionDemo = readJson("fixtures/demo/session-demo.json");
const portfolioReview = readJson("fixtures/demo/portfolio-review-2330-watchlist.json");
const backtestV2Summary = readJson("fixtures/demo/backtest-v2-summary.json");
const scenariosCompleted = [
  "analyze_2330",
  "generate_2330_report",
  "compare_ai_server_watchlist",
  "inspect_planner_trace",
  "evaluate_phase2_signals",
  "explore_strategy_presets",
];

const sessions = (sessionDemo.sessions ?? []).map((session) => ({
  schemaVersion: "workspace-session.v0.2",
  runtimeMode: "mock",
  modelId: "mock-research",
  provider: "mock",
  messages: [],
  artifacts: [],
  ...session,
}));

const runtimeSettings = {
  mode: "mock",
  apiBaseUrl: "http://localhost:8000",
  apiBridgeMode: "mock",
  selectedProvider: "mock",
  selectedModel: "mock-research",
  fallbackToMock: true,
  showToolCalls: true,
  showTokenUsage: true,
  maxToolSteps: 3,
};

const base = {
  schemaVersion: "workspace-share-bundle.v0.5",
  bundleId: "wsb_public_demo_v1",
  createdAt: FIXED_CREATED_AT,
  source: "mock",
  synthetic: true,
  notFinancialAdvice: true,
  noTradingExecution: true,
  appName: "tw-ai-research-workspace",
  locale: "zh-TW",
  sessions,
  artifacts: [
    ...(sessionDemo.artifacts ?? []),
    {
      id: "artifact-portfolio-review-demo",
      kind: "portfolio_review",
      type: "portfolio_review",
      title: "Portfolio review watchlist",
      summary: "Synthetic portfolio review artifact",
      createdAt: "2026-05-08T10:05:00+08:00",
      source: "mock",
      synthetic: true,
      notFinancialAdvice: true,
      noTradingExecution: true,
      evidenceIds: [],
      relatedArtifactIds: ["artifact-rebalance-plan-demo"],
      data: portfolioReview,
      pinned: false,
    },
    {
      id: "artifact-rebalance-plan-demo",
      kind: "rebalance_plan",
      type: "rebalance_plan",
      title: "Rebalance plan watchlist",
      summary: "Synthetic rebalance target plan",
      createdAt: "2026-05-08T10:06:00+08:00",
      source: "mock",
      synthetic: true,
      notFinancialAdvice: true,
      noTradingExecution: true,
      evidenceIds: [],
      relatedArtifactIds: ["artifact-portfolio-review-demo"],
      data: portfolioReview.rebalancePlan,
      pinned: false,
    },
    {
      id: "artifact-backtest-v2-demo",
      kind: "backtest_v2_summary",
      type: "backtest_v2_summary",
      title: "Backtest v2 summary",
      summary: "Synthetic portfolio-managed backtest summary",
      createdAt: "2026-05-08T10:07:00+08:00",
      source: "mock",
      synthetic: true,
      notFinancialAdvice: true,
      noTradingExecution: true,
      evidenceIds: [],
      relatedArtifactIds: [],
      data: backtestV2Summary,
      pinned: false,
    },
  ],
  runtimeSettings,
  scenariosCompleted,
  recommendedDemoFlow: [
    "analyze_2330",
    "generate_2330_report",
    "inspect_planner_trace",
    "compare_ai_server_watchlist",
    "evaluate_phase2_signals",
    "explore_strategy_presets",
  ],
  generatedArtifacts: [
    "research_card",
    "report",
    "pipeline_trace",
    "strategy_comparison",
    "signal_evaluation",
    "portfolio_review",
    "rebalance_plan",
    "backtest_v2_summary",
  ],
};

const share = {
  ...base,
  checksum: computeBundleChecksum(base),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const tempPath = `${outPath}.tmp`;
fs.writeFileSync(tempPath, JSON.stringify(share, null, 2));
fs.renameSync(tempPath, outPath);
console.log(`generate-share-bundle: wrote ${outPath}`);
