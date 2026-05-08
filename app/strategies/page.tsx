"use client";

import comparison from "@/fixtures/demo/strategy-comparison.json";
import backtestV2Summary from "@/fixtures/demo/backtest-v2-summary.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { StrategyComparison } from "@/components/workspace/strategy-comparison";
import { BacktestV2SummaryView } from "@/components/backtesting/backtest-v2-summary";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function StrategiesPage() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">{t("app.strategies")}</h1>
        <p className="text-sm text-muted-foreground">{t("disclaimers.noTrading")}</p>
        <StrategyComparison strategies={comparison.strategies} portfolioMetrics={comparison.portfolioMetrics as any} />
        <BacktestV2SummaryView summary={backtestV2Summary as any} />
      </div>
    </AppShell>
  );
}
