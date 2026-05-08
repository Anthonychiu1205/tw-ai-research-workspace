import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/use-i18n";

const demoSteps = [
  "Open workspace",
  "Confirm runtime mode",
  "Check backend status",
  "Run Analyze 2330 scenario",
  "Generate report",
  "Open evidence timeline",
  "Open planner trace",
  "Run portfolio review",
  "Run backtest v2",
  "Compare strategies",
  "Export share bundle",
  "Explain limitations",
];

export function DemoWalkthroughPanel() {
  const { t } = useI18n();
  return (
    <div className="space-y-3 rounded-md border p-3" data-testid="demo-walkthrough-panel">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Local Demo Walkthrough</div>
        <Badge>checklist</Badge>
      </div>
      <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
        {demoSteps.map((step) => (
          <li key={step} className="flex items-center justify-between gap-2">
            <span>{step}</span>
            <Badge>ready</Badge>
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
