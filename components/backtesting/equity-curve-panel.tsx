export function EquityCurvePanel({ finalEquity }: { finalEquity: number }) {
  return (
    <div className="rounded border p-3" data-testid="equity-curve-panel">
      <div className="text-xs font-medium">Equity Curve</div>
      <div className="mt-1 text-xs text-muted-foreground">Final equity: {finalEquity.toLocaleString()}</div>
    </div>
  );
}
