import type { RuntimeSettings, BackendConnectionState } from "@/lib/schemas/workspace";

export type WorkspaceCapabilityId =
  | "run_research"
  | "generate_report"
  | "run_pipeline"
  | "run_backtest"
  | "compare_strategies"
  | "evaluate_signals"
  | "portfolio_review"
  | "backtest_v2"
  | "open_artifact"
  | "export_workspace"
  | "import_workspace"
  | "switch_model"
  | "api_mode";

export type CapabilityMode = "mock" | "api" | "both";

export type CapabilityStatus = {
  id: WorkspaceCapabilityId;
  label: string;
  description: string;
  mode: CapabilityMode;
  available: boolean;
  reason?: string;
  fallbackAvailable: boolean;
};

export type CapabilityContext = {
  runtime: RuntimeSettings;
  backend: BackendConnectionState;
  artifactCount?: number;
};
