import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { SignalCard } from "@/components/research/signal-card";
import { ReportViewer } from "@/components/workspace/report-viewer";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";
import { StrategyComparison } from "@/components/workspace/strategy-comparison";
import { SignalExplorer } from "@/components/workspace/signal-explorer";
import { EvidenceTimeline } from "@/components/research/evidence-timeline";
import { ArtifactJsonViewer } from "@/components/workspace/artifact-json-viewer";

export function WorkspaceContextPanel({ artifact }: { artifact?: WorkspaceArtifactRecord }) {
  if (!artifact) {
    return (
      <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground" data-testid="workspace-context-empty">
        Select an artifact to open context views.
      </div>
    );
  }

  const data = (artifact.data ?? {}) as Record<string, any>;

  return (
    <div className="space-y-3" data-testid="workspace-context-panel">
      <div className="rounded border p-2 text-xs text-yellow-300">synthetic/mock/non-advice metadata is displayed for every context artifact.</div>

      {(artifact.type === "research_card" || artifact.kind === "research_card") && (
        <SignalCard label="Research Card" value={data.summary ?? artifact.summary ?? "Synthetic research card"} />
      )}

      {(artifact.type === "report" || artifact.kind === "report") && (
        <ReportViewer sections={data.sections ?? []} />
      )}

      {(artifact.type === "pipeline_trace" || artifact.kind === "pipeline_trace") && (
        <PlannerTraceViewer plan={data.plan ?? { steps: [] }} execution={data.execution ?? { toolCalls: [] }} reflection={data.reflection ?? {}} />
      )}

      {(artifact.type === "strategy_comparison" || artifact.kind === "strategy_comparison") && (
        <StrategyComparison strategies={data.strategies ?? []} />
      )}

      {(artifact.type === "signal_evaluation" || artifact.kind === "signal_evaluation") && (
        <SignalExplorer distribution={data.distribution ?? { positive: 0, neutral: 0, negative: 0 }} />
      )}

      {(artifact.type === "evidence_timeline" || artifact.kind === "evidence_timeline") && (
        <EvidenceTimeline points={data.points ?? []} />
      )}

      {(artifact.type === "backtest_summary" || artifact.kind === "backtest_summary") && (
        <div className="rounded border p-3 text-xs text-muted-foreground">Backtest summary is mock-only preview with no execution path.</div>
      )}

      {![
        "research_card",
        "report",
        "pipeline_trace",
        "strategy_comparison",
        "signal_evaluation",
        "evidence_timeline",
        "backtest_summary",
      ].includes(artifact.type) ? <ArtifactJsonViewer data={data} /> : null}
    </div>
  );
}
