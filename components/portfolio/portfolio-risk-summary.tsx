export function PortfolioRiskSummary({ summary }: { summary?: Record<string, unknown> }) {
  const entries = Object.entries(summary ?? {});
  return (
    <div className="rounded border p-3" data-testid="portfolio-risk-summary">
      <div className="mb-2 text-xs font-medium">Risk Summary</div>
      <div className="space-y-1 text-xs text-muted-foreground">
        {entries.length === 0 ? <div>No synthetic risk summary available.</div> : null}
        {entries.map(([key, value]) => (
          <div key={key}>
            {key}: {typeof value === "object" ? JSON.stringify(value) : String(value)}
          </div>
        ))}
      </div>
    </div>
  );
}
