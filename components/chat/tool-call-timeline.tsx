import type { WorkspaceToolCallState } from "@/lib/ai/message-types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";

export function ToolCallTimeline({
  calls,
  onOpenArtifact,
}: {
  calls: WorkspaceToolCallState[];
  onOpenArtifact?: (artifactId: string) => void;
}) {
  const { t } = useI18n();
  if (calls.length === 0) return null;

  const statusTone = (status: WorkspaceToolCallState["status"]) => {
    if (status === "succeeded") return "success" as const;
    if (status === "running") return "trace" as const;
    if (status === "failed") return "danger" as const;
    return "neutral" as const;
  };

  return (
    <div className="space-y-2 rounded-md border border-border/70 bg-card/50 p-2.5" data-testid="tool-call-timeline">
      {calls.map((call) => (
        <div key={call.id} className="rounded border border-border/70 bg-background/50 p-2 text-xs">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span>{call.toolName}</span>
            <StatusBadge tone={statusTone(call.status)}>{call.status}</StatusBadge>
            {typeof call.latencyMs === "number" ? <StatusBadge tone="neutral">{call.latencyMs}ms</StatusBadge> : null}
            {call.fallbackUsed ? <StatusBadge tone="warning">{t("runtime.fallback")}</StatusBadge> : null}
          </div>
          {call.resultSummary ? <div className="mb-1 text-muted-foreground">{call.resultSummary}</div> : null}
          {call.evidenceIds.length > 0 ? (
            <div className="mb-1 flex flex-wrap items-center gap-1">
              <span>{t("tools.evidenceRefs")}:</span>
              {call.evidenceIds.map((evidenceId) => (
                <StatusBadge key={evidenceId} tone="evidence">{evidenceId}</StatusBadge>
              ))}
            </div>
          ) : null}
          {call.error ? <div className="mb-1 text-rose-300">{call.error}</div> : null}
          {call.artifactId ? (
            <Button type="button" size="sm" variant="outline" onClick={() => onOpenArtifact?.(call.artifactId!)}>
              {t("common.open")}
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
