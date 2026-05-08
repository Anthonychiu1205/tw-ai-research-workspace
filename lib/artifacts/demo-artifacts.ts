import sessionDemo from "@/fixtures/demo/session-demo.json";
import type { ArtifactKind, WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

function normalizeKind(value: unknown): ArtifactKind {
  if (
    value === "research_card" ||
    value === "report" ||
    value === "pipeline_trace" ||
    value === "strategy_comparison" ||
    value === "signal_evaluation" ||
    value === "evidence_timeline" ||
    value === "backtest_summary" ||
    value === "portfolio_review" ||
    value === "rebalance_plan" ||
    value === "backtest_v2_summary"
  ) {
    return value;
  }
  return "research_card";
}

export function getDemoArtifacts(): WorkspaceArtifactRecord[] {
  return (sessionDemo.artifacts as any[]).map((artifact) => {
    const type = normalizeKind(artifact.type ?? artifact.kind);
    return {
      id: artifact.id,
      type,
      kind: type,
      title: artifact.title,
      summary: artifact.summary ?? "Synthetic demo artifact",
      createdAt: artifact.createdAt,
      updatedAt: artifact.updatedAt,
      sessionId: artifact.sessionId ?? "session-1",
      ticker: artifact.ticker ?? "2330",
      tickers: artifact.tickers,
      asOfDate: artifact.asOfDate,
      source: artifact.source ?? "mock",
      synthetic: artifact.synthetic ?? true,
      notFinancialAdvice: true,
      noTradingExecution: true,
      evidenceIds: artifact.evidenceIds ?? [],
      relatedArtifactIds: artifact.relatedArtifactIds ?? [],
      lineage: artifact.lineage,
      data: artifact.data,
      pinned: artifact.pinned ?? false,
    };
  });
}
