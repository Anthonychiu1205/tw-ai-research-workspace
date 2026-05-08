import type { ScenarioStep } from "@/lib/scenarios/scenario-types";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ScenarioProgress({ steps }: { steps: ScenarioStep[] }) {
  const { t } = useI18n();
  if (steps.length === 0) return null;
  const done = steps.filter((step) => step.status === "succeeded").length;
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-xs" data-testid="scenario-progress">
      <span>{t("scenarios.progress")}</span>
      <StatusBadge tone="trace">{done}/{steps.length}</StatusBadge>
    </div>
  );
}
