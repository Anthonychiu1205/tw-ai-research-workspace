import type { WorkspaceScenario } from "@/lib/scenarios/scenario-types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ScenarioCard({
  scenario,
  onRun,
  running,
}: {
  scenario: WorkspaceScenario;
  onRun: (id: WorkspaceScenario["id"]) => void;
  running?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border border-border/70 bg-background/20 p-3 text-xs" data-testid={`scenario-card-${scenario.id}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="line-clamp-2 text-sm font-medium leading-5">{scenario.title}</div>
        <StatusBadge tone={scenario.mockSafe ? "mock" : "backend"}>{scenario.mockSafe ? "mock" : "api"}</StatusBadge>
      </div>
      <p className="mb-2 line-clamp-2 text-muted-foreground">{scenario.description}</p>
      <div className="flex items-center justify-between gap-2">
        <StatusBadge tone="neutral">{scenario.category}</StatusBadge>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onRun(scenario.id)}
          disabled={running}
          aria-label={`Run scenario ${scenario.title}`}
        >
          {t("common.run")}
        </Button>
      </div>
    </div>
  );
}
