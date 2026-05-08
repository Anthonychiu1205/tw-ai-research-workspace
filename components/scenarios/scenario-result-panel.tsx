import type { ScenarioRunResult } from "@/lib/scenarios/scenario-types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ScenarioResultPanel({
  result,
  onOpenArtifact,
}: {
  result: ScenarioRunResult | null;
  onOpenArtifact?: (artifactId: string) => void;
}) {
  const { t } = useI18n();
  if (!result) {
    return <div className="rounded-md border border-dashed border-border/60 p-2 text-xs text-muted-foreground">{t("scenarios.noRunYet")}</div>;
  }

  return (
    <div className="space-y-2 rounded-lg border border-border/70 bg-background/20 p-3 text-xs" data-testid="scenario-result-panel">
      <div className="flex items-center gap-2">
        <span className="font-medium">{t("scenarios.scenarioLabel")}: {result.scenarioId}</span>
        <StatusBadge tone={result.status === "succeeded" ? "success" : "danger"}>{result.status}</StatusBadge>
      </div>
      {result.error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-2">{result.error}</div> : null}
      <div className="text-muted-foreground">{t("scenarios.artifactsCreated")}: {result.createdArtifactIds.length}</div>
      <div className="flex flex-wrap gap-2">
        {result.createdArtifactIds.map((artifactId) => (
          <Button key={artifactId} type="button" size="sm" variant="outline" onClick={() => onOpenArtifact?.(artifactId)}>
            {t("common.open")} {artifactId.slice(0, 8)}
          </Button>
        ))}
      </div>
    </div>
  );
}
