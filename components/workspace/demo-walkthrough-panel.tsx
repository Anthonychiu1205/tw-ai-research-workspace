import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function DemoWalkthroughPanel() {
  const { t } = useI18n();
  const demoSteps = [
    t("onboarding.demoStep1"),
    t("onboarding.demoStep2"),
    t("onboarding.demoStep3"),
    t("onboarding.demoStep4"),
    t("onboarding.demoStep5"),
    t("onboarding.demoStep6"),
    t("onboarding.demoStep7"),
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4" data-testid="demo-walkthrough-panel">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{t("common.viewChecklist")}</div>
        <Badge>{t("app.publicDemoFlow")}</Badge>
      </div>
      <ol className="space-y-1.5 text-xs text-muted-foreground">
        {demoSteps.map((step, index) => (
          <li key={step} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-2">
            <span>{index + 1}. {step}</span>
            <Badge>{t("common.run")}</Badge>
          </li>
        ))}
      </ol>
      <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">
        {t("disclaimers.nonAdvice")}
      </div>
      <div className="text-xs text-muted-foreground">{t("disclaimers.noTrading")}</div>
    </div>
  );
}
