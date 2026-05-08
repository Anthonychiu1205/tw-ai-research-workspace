export type ArtifactKind =
  | "research_card"
  | "report"
  | "pipeline_trace"
  | "strategy_comparison"
  | "signal_evaluation"
  | "evidence_timeline"
  | "backtest_summary";

export type WorkspaceArtifactRecord = {
  id: string;
  type: ArtifactKind;
  kind?: ArtifactKind;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt?: string;
  sessionId?: string;
  ticker?: string;
  tickers?: string[];
  asOfDate?: string;
  source: "mock" | "api" | "mock_fallback";
  synthetic: boolean;
  notFinancialAdvice: true;
  noTradingExecution: true;
  evidenceIds: string[];
  relatedArtifactIds: string[];
  lineage?: {
    operationId?: string;
    toolCallId?: string;
    sourceArtifactIds?: string[];
  };
  data?: unknown;
  pinned: boolean;
};
