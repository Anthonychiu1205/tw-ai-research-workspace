import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { ArtifactMetadataCard } from "@/components/workspace/artifact-metadata-card";
import { ArtifactLineage } from "@/components/workspace/artifact-lineage";
import { ArtifactJsonViewer } from "@/components/workspace/artifact-json-viewer";
import { ArtifactExportActions } from "@/components/workspace/artifact-export-actions";

export function ArtifactDetailPanel({
  artifact,
  onPinToggle,
}: {
  artifact?: WorkspaceArtifactRecord;
  onPinToggle?: (artifactId: string, pinned: boolean) => void;
}) {
  if (!artifact) {
    return <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">Select an artifact to inspect metadata and lineage.</div>;
  }

  return (
    <div className="space-y-3" data-testid="artifact-detail-panel">
      <div className="text-sm font-medium">{artifact.title}</div>
      {artifact.summary ? <div className="text-xs text-muted-foreground">{artifact.summary}</div> : null}
      <ArtifactMetadataCard artifact={artifact} />
      <ArtifactLineage artifact={artifact} />
      {artifact.evidenceIds.length > 0 ? (
        <div className="rounded-md border p-3 text-xs">evidence ids: {artifact.evidenceIds.join(", ")}</div>
      ) : null}
      {artifact.relatedArtifactIds.length > 0 ? (
        <div className="rounded-md border p-3 text-xs">related artifacts: {artifact.relatedArtifactIds.join(", ")}</div>
      ) : null}
      <ArtifactExportActions artifact={artifact} onPinToggle={onPinToggle} />
      <ArtifactJsonViewer data={artifact.data ?? artifact} />
    </div>
  );
}
