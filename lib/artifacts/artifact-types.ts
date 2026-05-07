export type ArtifactKind =
  | "research_card"
  | "report"
  | "pipeline_trace"
  | "strategy_comparison"
  | "signal_evaluation"
  | "evidence_timeline";

export type WorkspaceArtifactRecord = {
  id: string;
  kind: ArtifactKind;
  title: string;
  createdAt: string;
};
