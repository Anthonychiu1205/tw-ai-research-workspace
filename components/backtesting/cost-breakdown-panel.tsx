export function CostBreakdownPanel({ turnover, costs }: { turnover: number; costs?: number }) {
  return (
    <div className="rounded border p-3" data-testid="cost-breakdown-panel">
      <div className="text-xs font-medium">Cost & Turnover</div>
      <div className="mt-1 text-xs text-muted-foreground">Turnover: {(turnover * 100).toFixed(2)}%</div>
      <div className="text-xs text-muted-foreground">Costs: {((costs ?? 0) * 100).toFixed(2)}%</div>
    </div>
  );
}
