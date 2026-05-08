import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { Badge } from "@/components/ui/badge";

export function ArtifactMetadataCard({ artifact }: { artifact: WorkspaceArtifactRecord }) {
  return (
    <div className="space-y-2 rounded-md border p-3 text-xs" data-testid="artifact-metadata-card">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{artifact.type}</Badge>
        <Badge>{artifact.source}</Badge>
        {artifact.pinned ? <Badge>pinned</Badge> : null}
      </div>
      <div>created: {artifact.createdAt}</div>
      {artifact.updatedAt ? <div>updated: {artifact.updatedAt}</div> : null}
      {artifact.ticker ? <div>ticker: {artifact.ticker}</div> : null}
      {artifact.tickers?.length ? <div>watchlist: {artifact.tickers.join(", ")}</div> : null}
      <div className="text-yellow-300">synthetic/mock artifact, not financial advice, no trading execution</div>
    </div>
  );
}
