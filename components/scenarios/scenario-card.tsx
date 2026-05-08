import type { WorkspaceScenario } from "@/lib/scenarios/scenario-types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

function localizedScenarioTitle(id: WorkspaceScenario["id"], fallback: string, t: (path: string) => string) {
  if (id === "analyze_2330") return t("scenarios.analyze2330Title");
  if (id === "generate_2330_report") return t("scenarios.generateReportTitle");
  if (id === "compare_ai_server_watchlist") return t("scenarios.compareWatchlistTitle");
  if (id === "inspect_planner_trace") return t("scenarios.inspectTraceTitle");
  if (id === "evaluate_phase2_signals") return t("scenarios.evaluateSignalsTitle");
  if (id === "explore_strategy_presets") return t("scenarios.portfolioReviewTitle");
  return fallback;
}

function localizedScenarioDescription(id: WorkspaceScenario["id"], fallback: string, t: (path: string) => string) {
  if (id === "analyze_2330") return t("scenarios.analyze2330Desc");
  if (id === "generate_2330_report") return t("scenarios.generateReportDesc");
  if (id === "compare_ai_server_watchlist") return t("scenarios.compareWatchlistDesc");
  if (id === "inspect_planner_trace") return t("scenarios.inspectTraceDesc");
  if (id === "evaluate_phase2_signals") return t("scenarios.evaluateSignalsDesc");
  if (id === "explore_strategy_presets") return t("scenarios.portfolioReviewDesc");
  return fallback;
}

function localizedScenarioOutput(id: WorkspaceScenario["id"], fallback: string | undefined, t: (path: string) => string) {
  if (id === "analyze_2330") return t("scenarios.analyze2330Output");
  if (id === "generate_2330_report") return t("scenarios.generateReportOutput");
  if (id === "compare_ai_server_watchlist") return t("scenarios.compareWatchlistOutput");
  if (id === "inspect_planner_trace") return t("scenarios.inspectTraceOutput");
  if (id === "evaluate_phase2_signals") return t("scenarios.evaluateSignalsOutput");
  if (id === "explore_strategy_presets") return t("scenarios.portfolioReviewOutput");
  return fallback ?? t("common.noData");
}

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
  const title = localizedScenarioTitle(scenario.id, scenario.title, t);
  const description = localizedScenarioDescription(scenario.id, scenario.description, t);
  const expectedOutput = localizedScenarioOutput(scenario.id, scenario.expectedOutput, t);

  return (
    <div className="rounded-lg border border-border bg-white p-3 text-xs" data-testid={`scenario-card-${scenario.id}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="line-clamp-2 text-sm font-medium leading-5">{title}</div>
        <StatusBadge tone={scenario.mockSafe ? "mock" : "backend"}>{scenario.mockSafe ? t("scenarios.mockSafeLabel") : "api"}</StatusBadge>
      </div>
      <p className="mb-2 line-clamp-2 text-muted-foreground">{description}</p>
      <div className="mb-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
        {t("scenarios.expectedOutput")}: {expectedOutput}
      </div>
      <div className="flex items-center justify-between gap-2">
        <StatusBadge tone="neutral">{scenario.category}</StatusBadge>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onRun(scenario.id)}
          disabled={running}
          aria-label={`Run scenario ${title}`}
        >
          {running ? t("scenarios.running") : t("common.runScenario")}
        </Button>
      </div>
    </div>
  );
}
