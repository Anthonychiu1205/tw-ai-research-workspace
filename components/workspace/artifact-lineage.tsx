import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

export function ArtifactLineage({ artifact }: { artifact: WorkspaceArtifactRecord }) {
  return (
    <div className="space-y-1 rounded-md border p-3 text-xs" data-testid="artifact-lineage">
      <div className="font-medium">Lineage</div>
      <div>operationId: {artifact.lineage?.operationId ?? "n/a"}</div>
      <div>toolCallId: {artifact.lineage?.toolCallId ?? "n/a"}</div>
      <div>source artifacts: {(artifact.lineage?.sourceArtifactIds ?? []).join(", ") || "n/a"}</div>
    </div>
  );
}
