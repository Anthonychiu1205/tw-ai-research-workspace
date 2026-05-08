import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { ArtifactMetadataCard } from "@/components/workspace/artifact-metadata-card";
import { ArtifactLineage } from "@/components/workspace/artifact-lineage";
import { ArtifactJsonViewer } from "@/components/workspace/artifact-json-viewer";
import { ArtifactExportActions } from "@/components/workspace/artifact-export-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { useI18n } from "@/lib/i18n/use-i18n";

function semanticPreview(artifact: WorkspaceArtifactRecord, t: (path: string) => string) {
  const data = (artifact.data ?? {}) as Record<string, unknown>;

  if (artifact.type === "report") {
    const sections = Array.isArray(data.sections) ? data.sections : [];
    return (
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{t("artifacts.report")}</div>
        <div>{t("scenarios.expectedOutput")}: {sections.length} sections</div>
      </div>
    );
  }

  if (artifact.type === "pipeline_trace") {
    const plan = data.plan as { steps?: unknown[] } | undefined;
    const execution = data.execution as { toolCalls?: unknown[] } | undefined;
    return (
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{t("artifacts.pipelineTrace")}</div>
        <div>planner steps: {plan?.steps?.length ?? 0}</div>
        <div>tool calls: {execution?.toolCalls?.length ?? 0}</div>
      </div>
    );
  }

  if (artifact.type === "strategy_comparison") {
    const strategies = Array.isArray(data.strategies) ? data.strategies : [];
    return (
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{t("artifacts.strategyComparison")}</div>
        <div>strategies: {strategies.length}</div>
      </div>
    );
  }

  if (artifact.type === "portfolio_review") {
    const targetWeights = (data.targetWeights ?? data.target_weights ?? {}) as Record<string, number>;
    return (
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{t("artifacts.portfolioReview")}</div>
        <div>targets: {Object.keys(targetWeights).length}</div>
      </div>
    );
  }

  if (artifact.type === "backtest_v2_summary") {
    const metrics = (data.portfolioMetrics ?? data.portfolio_metrics ?? {}) as Record<string, unknown>;
    return (
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{t("artifacts.backtestV2Summary")}</div>
        <div>metrics: {Object.keys(metrics).length}</div>
      </div>
    );
  }

  return (
    <div className="text-xs text-muted-foreground">
      {artifact.summary ?? t("emptyStates.noSelection")}
    </div>
  );
}

export function ArtifactDetailPanel({
  artifact,
  onPinToggle,
}: {
  artifact?: WorkspaceArtifactRecord;
  onPinToggle?: (artifactId: string, pinned: boolean) => void;
}) {
  const { t } = useI18n();
  if (!artifact) {
    return (
      <Panel className="border-dashed text-xs text-muted-foreground">
        {t("emptyStates.artifactDetailHint")}
      </Panel>
    );
  }

  return (
    <Panel className="space-y-3" data-testid="artifact-detail-panel">
      <SectionHeading title={artifact.title} subtitle={artifact.summary ?? undefined} />
      <ArtifactMetadataCard artifact={artifact} />
      <div className="rounded-md border border-border bg-white px-3 py-2">
        {semanticPreview(artifact, t)}
      </div>
      <ArtifactLineage artifact={artifact} />
      {artifact.evidenceIds.length > 0 ? (
        <div className="rounded-md border border-border bg-slate-50 p-3 text-xs">
          <div className="mb-1 font-medium">{t("tools.evidenceRefs")}</div>
          <div className="flex flex-wrap gap-1">
            {artifact.evidenceIds.map((evidenceId) => (
              <StatusBadge key={evidenceId} tone="evidence">{evidenceId}</StatusBadge>
            ))}
          </div>
        </div>
      ) : null}
      {artifact.relatedArtifactIds.length > 0 ? (
        <div className="rounded-md border border-border bg-slate-50 p-3 text-xs">
          related artifacts: {artifact.relatedArtifactIds.join(", ")}
        </div>
      ) : null}
      <ArtifactExportActions artifact={artifact} onPinToggle={onPinToggle} />
      <details className="rounded-md border border-border bg-slate-50 p-2">
        <summary className="cursor-pointer text-xs font-medium">{t("common.rawJson")}</summary>
        <div className="mt-2">
          <ArtifactJsonViewer data={artifact.data ?? artifact} />
        </div>
      </details>
    </Panel>
  );
}
