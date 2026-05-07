export function StrategyComparison({
  strategies,
}: {
  strategies: Array<{ id: string; name: string; syntheticReturn: number; syntheticDrawdown: number }>;
}) {
  return (
    <div className="rounded-md border p-3">
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
