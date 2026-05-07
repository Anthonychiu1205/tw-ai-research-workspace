import comparison from "@/fixtures/demo/strategy-comparison.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { StrategyComparison } from "@/components/workspace/strategy-comparison";

export default function StrategiesPage() {
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Strategy Comparison</h1>
        <p className="text-sm text-muted-foreground">Synthetic comparison only. No trading execution.</p>
        <StrategyComparison strategies={comparison.strategies} />
      </div>
    </AppShell>
  );
}
