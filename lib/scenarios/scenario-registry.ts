import type { WorkspaceScenario } from "@/lib/scenarios/scenario-types";

const watchlist = ["2330", "2317", "2454", "2308", "0050"];

export const workspaceScenarios: WorkspaceScenario[] = [
  {
    id: "analyze_2330",
    title: "Analyze 2330",
    description: "Run a synthetic research pass for 2330 台積電 and inspect research artifacts.",
    category: "research",
    defaultTicker: "2330",
    steps: [
      {
        id: "run-research",
        title: "Run research",
        description: "Execute a mock-safe research run with Phase 2 agent synthesis.",
        operationKind: "run_research",
        expectedArtifactType: "research_card",
        status: "pending",
      },
    ],
    expectedArtifacts: ["research_card"],
    mockSafe: true,
    requiresBackend: false,
  },
  {
    id: "generate_2330_report",
    title: "Generate 2330 report",
    description: "Generate a synthetic research report for 2330 with evidence references.",
    category: "report",
    defaultTicker: "2330",
    steps: [
      {
        id: "generate-report",
        title: "Generate report",
        description: "Create a report artifact with non-advice disclaimer metadata.",
        operationKind: "generate_report",
        expectedArtifactType: "report",
        status: "pending",
      },
    ],
    expectedArtifacts: ["report"],
    mockSafe: true,
    requiresBackend: false,
  },
  {
    id: "compare_ai_server_watchlist",
    title: "Compare AI server watchlist",
    description: "Run strategy comparison on 2330/2317/2454/2308/0050 in mock-safe mode.",
    category: "strategy",
    defaultTickers: watchlist,
    steps: [
      {
        id: "compare-strategies",
        title: "Compare strategies",
        description: "Generate strategy comparison artifact for watchlist presets.",
        operationKind: "compare_strategies",
        expectedArtifactType: "strategy_comparison",
        status: "pending",
      },
    ],
    expectedArtifacts: ["strategy_comparison"],
    mockSafe: true,
    requiresBackend: false,
  },
  {
    id: "inspect_planner_trace",
    title: "Inspect planner trace",
    description: "Run planner/executor pipeline trace for 2330 with bounded deterministic flow.",
    category: "trace",
    defaultTicker: "2330",
    steps: [
      {
        id: "run-pipeline",
        title: "Run pipeline",
        description: "Create a planner trace artifact for inspection.",
        operationKind: "run_pipeline",
        expectedArtifactType: "pipeline_trace",
        status: "pending",
      },
    ],
    expectedArtifacts: ["pipeline_trace"],
    mockSafe: true,
    requiresBackend: false,
  },
  {
    id: "evaluate_phase2_signals",
    title: "Evaluate Phase 2 signals",
    description: "Evaluate synthetic signal strength for watchlist with phase-2 context.",
    category: "signals",
    defaultTickers: watchlist,
    steps: [
      {
        id: "evaluate-signals",
        title: "Evaluate signals",
        description: "Generate signal evaluation artifact in synthetic mode.",
        operationKind: "evaluate_signals",
        expectedArtifactType: "signal_evaluation",
        status: "pending",
      },
    ],
    expectedArtifacts: ["signal_evaluation"],
    mockSafe: true,
    requiresBackend: false,
  },
  {
    id: "explore_strategy_presets",
    title: "Explore strategy presets",
    description: "Run a strategy preset exploration flow for the Taiwan AI server watchlist.",
    category: "strategy",
    defaultTickers: watchlist,
    steps: [
      {
        id: "preset-compare",
        title: "Run preset comparison",
        description: "Execute strategy comparison using preset watchlist.",
        operationKind: "compare_strategies",
        expectedArtifactType: "strategy_comparison",
        status: "pending",
      },
      {
        id: "preset-signals",
        title: "Check supporting signals",
        description: "Evaluate supporting signals for preset strategy context.",
        operationKind: "evaluate_signals",
        expectedArtifactType: "signal_evaluation",
        status: "pending",
      },
    ],
    expectedArtifacts: ["strategy_comparison", "signal_evaluation"],
    mockSafe: true,
    requiresBackend: false,
  },
];

export function listScenarios() {
  return workspaceScenarios;
}

export function getScenarioById(id: WorkspaceScenario["id"]) {
  return workspaceScenarios.find((scenario) => scenario.id === id);
}
