import type { ScenarioRunResult } from "@/lib/scenarios/scenario-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ScenarioResultPanel({
  result,
  onOpenArtifact,
}: {
  result: ScenarioRunResult | null;
  onOpenArtifact?: (artifactId: string) => void;
}) {
  if (!result) {
    return <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">No scenario run yet.</div>;
  }

  return (
    <div className="space-y-2 rounded-md border p-3 text-xs" data-testid="scenario-result-panel">
      <div className="flex items-center gap-2">
        <span className="font-medium">Scenario: {result.scenarioId}</span>
        <Badge>{result.status}</Badge>
      </div>
      {result.error ? <div className="rounded border border-red-500/30 bg-red-500/10 p-2">{result.error}</div> : null}
      <div>Artifacts created: {result.createdArtifactIds.length}</div>
      {result.warnings.length > 0 ? <div>Warnings: {result.warnings.join("; ")}</div> : null}
      <div className="flex flex-wrap gap-2">
        {result.createdArtifactIds.map((artifactId) => (
          <Button key={artifactId} type="button" size="sm" variant="outline" onClick={() => onOpenArtifact?.(artifactId)}>
            Open {artifactId.slice(0, 8)}
          </Button>
        ))}
      </div>
      <div className="text-muted-foreground">Synthetic/mock workflow output. Not financial advice. No trading execution.</div>
    </div>
  );
}
