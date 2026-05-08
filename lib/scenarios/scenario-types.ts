import type { ArtifactKind } from "@/lib/artifacts/artifact-types";
import type { ResearchOperationKind, ResearchOperationResult } from "@/lib/operations/operation-types";

export type WorkspaceScenarioId =
  | "analyze_2330"
  | "generate_2330_report"
  | "compare_ai_server_watchlist"
  | "inspect_planner_trace"
  | "evaluate_phase2_signals"
  | "explore_strategy_presets";

export type ScenarioStepStatus = "pending" | "running" | "succeeded" | "failed";

export type ScenarioStep = {
  id: string;
  title: string;
  description: string;
  operationKind?: ResearchOperationKind;
  commandId?: string;
  expectedArtifactType?: ArtifactKind;
  status: ScenarioStepStatus;
};

export type WorkspaceScenario = {
  id: WorkspaceScenarioId;
  title: string;
  description: string;
  expectedOutput?: string;
  category: "research" | "report" | "trace" | "signals" | "strategy";
  defaultTicker?: string;
  defaultTickers?: string[];
  steps: ScenarioStep[];
  expectedArtifacts: ArtifactKind[];
  mockSafe: true;
  requiresBackend: boolean;
};

export type ScenarioRunEvent = {
  type: "step_start" | "step_complete" | "step_fail";
  scenarioId: WorkspaceScenarioId;
  stepId: string;
  message: string;
};

export type ScenarioRunResult = {
  scenarioId: WorkspaceScenarioId;
  status: "succeeded" | "failed";
  steps: ScenarioStep[];
  createdArtifactIds: string[];
  operationResults: ResearchOperationResult[];
  warnings: string[];
  error?: string;
};
