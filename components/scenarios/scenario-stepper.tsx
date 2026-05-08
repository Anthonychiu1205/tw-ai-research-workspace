import type { ScenarioStep } from "@/lib/scenarios/scenario-types";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ScenarioStepper({ steps }: { steps: ScenarioStep[] }) {
  const { t } = useI18n();
  if (steps.length === 0) {
    return <div className="rounded border border-dashed border-border/60 p-2 text-xs text-muted-foreground">{t("scenarios.noStepsYet")}</div>;
  }

  return (
    <div className="space-y-2" data-testid="scenario-stepper">
      {steps.map((step, index) => (
        <div key={step.id} className="rounded-md border border-border/60 px-2.5 py-2 text-xs">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-medium leading-5">{index + 1}. {step.title}</span>
            <StatusBadge tone={step.status === "succeeded" ? "success" : step.status === "failed" ? "danger" : "trace"}>{step.status}</StatusBadge>
          </div>
          <div className="text-muted-foreground">{step.description}</div>
        </div>
      ))}
    </div>
  );
}
