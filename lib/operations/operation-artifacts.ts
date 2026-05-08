import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import type { ResearchOperationKind, ResearchOperationRequest } from "@/lib/operations/operation-types";

export function operationKindToArtifactType(kind: ResearchOperationKind): WorkspaceArtifactRecord["type"] {
  if (kind === "run_research") return "research_card";
  if (kind === "generate_report") return "report";
  if (kind === "run_pipeline") return "pipeline_trace";
  if (kind === "run_backtest") return "backtest_summary";
  if (kind === "compare_strategies") return "strategy_comparison";
  return "signal_evaluation";
}

export function operationSummary(kind: ResearchOperationKind, tickerOrWatchlist: string) {
  if (kind === "run_research") return `Synthetic research completed for ${tickerOrWatchlist}`;
  if (kind === "generate_report") return `Synthetic report generated for ${tickerOrWatchlist}`;
  if (kind === "run_pipeline") return `Synthetic planner pipeline completed for ${tickerOrWatchlist}`;
  if (kind === "run_backtest") return `Synthetic backtest preview prepared for ${tickerOrWatchlist}`;
  if (kind === "compare_strategies") return `Synthetic strategy comparison prepared for ${tickerOrWatchlist}`;
  return `Synthetic signal evaluation prepared for ${tickerOrWatchlist}`;
}

export function createArtifactTitle(request: ResearchOperationRequest): string {
  const tickerLabel = request.ticker ?? request.tickers?.join(",") ?? "watchlist";
  if (request.kind === "run_research") return `${tickerLabel} research card`;
  if (request.kind === "generate_report") return `${tickerLabel} report`;
  if (request.kind === "run_pipeline") return `${tickerLabel} planner trace`;
  if (request.kind === "run_backtest") return `${tickerLabel} backtest summary`;
  if (request.kind === "compare_strategies") return `${tickerLabel} strategy comparison`;
  return `${tickerLabel} signal evaluation`;
}
