export function BenchmarkMetricsPanel({ benchmark }: { benchmark: Record<string, number> }) {
  return (
    <div className="rounded border p-3" data-testid="benchmark-metrics-panel">
      <div className="text-xs font-medium">Benchmark Metrics</div>
      <div className="mt-1 space-y-1 text-xs text-muted-foreground">
        {Object.entries(benchmark).map(([key, value]) => (
          <div key={key}>{key}: {typeof value === "number" ? value.toFixed(4) : String(value)}</div>
        ))}
      </div>
    </div>
  );
}
