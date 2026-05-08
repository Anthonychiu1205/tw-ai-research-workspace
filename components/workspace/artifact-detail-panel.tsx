import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { ArtifactMetadataCard } from "@/components/workspace/artifact-metadata-card";
import { ArtifactLineage } from "@/components/workspace/artifact-lineage";
import { ArtifactJsonViewer } from "@/components/workspace/artifact-json-viewer";
import { ArtifactExportActions } from "@/components/workspace/artifact-export-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { useI18n } from "@/lib/i18n/use-i18n";

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
        {t("emptyStates.noSelection")}
      </Panel>
    );
  }

  return (
    <Panel className="space-y-3" data-testid="artifact-detail-panel">
      <SectionHeading title={artifact.title} subtitle={artifact.summary ?? undefined} />
      <ArtifactMetadataCard artifact={artifact} />
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
        <summary className="cursor-pointer text-xs font-medium">{t("artifacts.exportJson")}</summary>
        <div className="mt-2">
          <ArtifactJsonViewer data={artifact.data ?? artifact} />
        </div>
      </details>
    </Panel>
  );
}
