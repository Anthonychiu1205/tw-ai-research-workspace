import type { ResearchOperationResult } from "@/lib/operations/operation-types";
import { Badge } from "@/components/ui/badge";

export function OperationResultSummary({
  result,
  onOpenArtifact,
}: {
  result: ResearchOperationResult;
  onOpenArtifact?: (artifactId: string) => void;
}) {
  return (
    <div className="rounded-md border p-3 text-xs" data-testid="operation-result-summary">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-medium">{result.kind}</span>
        <Badge>{result.status}</Badge>
        <Badge>{result.source}</Badge>
      </div>
      <div className="mb-2 text-muted-foreground">{result.summary}</div>
      {result.error ? <div className="mb-2 text-red-400">{result.error}</div> : null}
      {result.warnings.length > 0 ? <div className="mb-2 text-yellow-400">{result.warnings.join("; ")}</div> : null}
      <div className="flex flex-wrap gap-2">
        {result.artifactIds.map((artifactId) => (
          <button
            key={artifactId}
            type="button"
            className="rounded border px-2 py-1"
            onClick={() => onOpenArtifact?.(artifactId)}
          >
            Open {artifactId}
          </button>
        ))}
      </div>
    </div>
  );
}
