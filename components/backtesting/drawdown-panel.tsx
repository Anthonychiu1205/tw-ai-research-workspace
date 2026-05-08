export function DrawdownPanel({ maxDrawdown }: { maxDrawdown: number }) {
  return (
    <div className="rounded border p-3" data-testid="drawdown-panel">
      <div className="text-xs font-medium">Drawdown</div>
      <div className="mt-1 text-xs text-muted-foreground">Max drawdown: {(maxDrawdown * 100).toFixed(2)}%</div>
    </div>
  );
}
