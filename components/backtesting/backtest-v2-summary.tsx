import type { BacktestV2Summary } from "@/lib/schemas/strategies";
import { EquityCurvePanel } from "@/components/backtesting/equity-curve-panel";
import { DrawdownPanel } from "@/components/backtesting/drawdown-panel";
import { CostBreakdownPanel } from "@/components/backtesting/cost-breakdown-panel";
import { ExposurePanel } from "@/components/backtesting/exposure-panel";
import { BenchmarkMetricsPanel } from "@/components/backtesting/benchmark-metrics-panel";

export function BacktestV2SummaryView({ summary }: { summary: BacktestV2Summary }) {
  const metrics = summary.portfolioMetrics;

  return (
    <div className="space-y-3" data-testid="backtest-v2-summary">
      <div className="rounded border p-3 text-xs text-muted-foreground">
        Hypothetical backtest summary for research simulation only. No broker integration and no trade execution.
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border p-2">Total return: {(metrics.totalReturn * 100).toFixed(2)}%</div>
        <div className="rounded border p-2">Benchmark return: {(metrics.benchmarkReturn * 100).toFixed(2)}%</div>
      </div>
      <EquityCurvePanel finalEquity={metrics.finalEquity} />
      <DrawdownPanel maxDrawdown={metrics.maxDrawdown} />
      <CostBreakdownPanel turnover={metrics.turnover} costs={metrics.costs} />
      <BenchmarkMetricsPanel benchmark={summary.benchmarkMetrics} />
      <ExposurePanel exposure={summary.exposure} />
      <div className="rounded border p-3 text-xs">
        <div className="font-medium">Assumptions</div>
        <ul className="mt-1 list-disc pl-4 text-muted-foreground">
          {summary.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
        <div className="mt-2 text-muted-foreground">No-lookahead audit: {summary.noLookaheadAudit}</div>
      </div>
    </div>
  );
}
