import { useI18n } from "@/lib/i18n/use-i18n";

type DemoStep = { title: string; result: string };

export function DemoJourney() {
  const { t } = useI18n();
  const steps: DemoStep[] = [
    { title: t("onboarding.demoStep1"), result: t("artifacts.researchCard") },
    { title: t("onboarding.demoStep2"), result: t("artifacts.researchCard") },
    { title: t("onboarding.demoStep3"), result: t("evidence.references") },
    { title: t("onboarding.demoStep4"), result: t("trace.executorTrace") },
    { title: t("onboarding.demoStep5"), result: t("artifacts.report") },
    { title: t("onboarding.demoStep6"), result: t("artifacts.strategyComparison") },
    { title: t("onboarding.demoStep7"), result: "workspace-share-bundle.json" },
  ];

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-4" data-testid="demo-journey">
      <div className="text-sm font-semibold">{t("onboarding.demoJourneyTitle")}</div>
      <ol className="space-y-2 text-xs text-muted-foreground">
        {steps.map((step) => (
          <li key={step.title} className="flex items-start justify-between gap-3 rounded-md bg-slate-50 px-2.5 py-2">
            <span className="leading-5">{step.title}</span>
            <span className="whitespace-nowrap text-[11px] text-slate-500">{step.result}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
