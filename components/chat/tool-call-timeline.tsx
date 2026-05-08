import type { WorkspaceToolCallState } from "@/lib/ai/message-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ToolCallTimeline({
  calls,
  onOpenArtifact,
}: {
  calls: WorkspaceToolCallState[];
  onOpenArtifact?: (artifactId: string) => void;
}) {
  if (calls.length === 0) return null;

  return (
    <div className="space-y-2 rounded-md border p-2" data-testid="tool-call-timeline">
      {calls.map((call) => (
        <div key={call.id} className="rounded border p-2 text-xs">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span>{call.toolName}</span>
            <Badge>{call.status}</Badge>
            {typeof call.latencyMs === "number" ? <Badge>{call.latencyMs}ms</Badge> : null}
            {call.fallbackUsed ? <Badge>fallback</Badge> : null}
          </div>
          {call.resultSummary ? <div className="mb-1 text-muted-foreground">{call.resultSummary}</div> : null}
          {call.evidenceIds.length > 0 ? <div className="mb-1">evidence: {call.evidenceIds.join(", ")}</div> : null}
          {call.error ? <div className="mb-1 text-red-400">{call.error}</div> : null}
          {call.artifactId ? (
            <Button type="button" size="sm" variant="outline" onClick={() => onOpenArtifact?.(call.artifactId!)}>
              Open artifact
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
