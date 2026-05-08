import type { ExposureBreakdown } from "@/lib/schemas/strategies";

export function ExposureBreakdown({ exposure }: { exposure: ExposureBreakdown }) {
  return (
    <div className="rounded border p-3" data-testid="exposure-breakdown">
      <div className="mb-2 text-xs font-medium">Exposure</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="mb-1 text-muted-foreground">By ticker</div>
          {Object.entries(exposure.byTicker).map(([ticker, value]) => (
            <div key={ticker}>{ticker}: {(value * 100).toFixed(1)}%</div>
          ))}
        </div>
        <div>
          <div className="mb-1 text-muted-foreground">By sector</div>
          {Object.entries(exposure.bySector).map(([sector, value]) => (
            <div key={sector}>{sector}: {(value * 100).toFixed(1)}%</div>
          ))}
        </div>
      </div>
    </div>
  );
}
