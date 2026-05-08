export type ResearchOperationKind =
  | "run_research"
  | "generate_report"
  | "run_pipeline"
  | "run_backtest"
  | "run_portfolio_review"
  | "run_backtest_v2"
  | "compare_strategies"
  | "evaluate_signals";

export type ResearchOperationRequest = {
  id: string;
  kind: ResearchOperationKind;
  ticker?: string;
  tickers?: string[];
  asOfDate?: string;
  startDate?: string;
  endDate?: string;
  includePhase2Agents?: boolean;
  llmMode?: string;
  outputMode: "artifact";
  createdAt: string;
};

export type ResearchOperationResult = {
  operationId: string;
  kind: ResearchOperationKind;
  status: "succeeded" | "failed";
  summary: string;
  artifactIds: string[];
  warnings: string[];
  error?: string;
  source: "mock" | "api" | "mock_fallback";
};
