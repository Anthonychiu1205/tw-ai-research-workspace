export function StrategyComparison({
  strategies,
  portfolioMetrics,
}: {
  strategies: Array<{ id: string; name: string; syntheticReturn: number; syntheticDrawdown: number }>;
  portfolioMetrics?: {
    finalEquity?: number;
    totalReturn?: number;
    maxDrawdown?: number;
    benchmarkReturn?: number;
  };
}) {
  return (
    <div className="rounded-md border p-3">
      {portfolioMetrics ? (
        <div className="mb-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Total return: {portfolioMetrics.totalReturn !== undefined ? `${(portfolioMetrics.totalReturn * 100).toFixed(2)}%` : "-"}</div>
          <div>Benchmark: {portfolioMetrics.benchmarkReturn !== undefined ? `${(portfolioMetrics.benchmarkReturn * 100).toFixed(2)}%` : "-"}</div>
          <div>Max drawdown: {portfolioMetrics.maxDrawdown !== undefined ? `${(portfolioMetrics.maxDrawdown * 100).toFixed(2)}%` : "-"}</div>
          <div>Final equity: {portfolioMetrics.finalEquity !== undefined ? portfolioMetrics.finalEquity.toLocaleString() : "-"}</div>
        </div>
      ) : null}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground">
            <th>Name</th>
            <th>Return (synthetic)</th>
            <th>Drawdown (synthetic)</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{(s.syntheticReturn * 100).toFixed(1)}%</td>
              <td>{(s.syntheticDrawdown * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
