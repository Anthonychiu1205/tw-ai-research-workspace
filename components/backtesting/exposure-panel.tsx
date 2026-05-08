import type { ExposureBreakdown } from "@/lib/schemas/strategies";

export function ExposurePanel({ exposure }: { exposure: ExposureBreakdown }) {
  return (
    <div className="rounded border p-3" data-testid="exposure-panel">
      <div className="text-xs font-medium">Exposure Breakdown</div>
      <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          {Object.entries(exposure.byTicker).map(([ticker, value]) => (
            <div key={ticker}>{ticker}: {(value * 100).toFixed(1)}%</div>
          ))}
        </div>
        <div>
          {Object.entries(exposure.bySector).map(([sector, value]) => (
            <div key={sector}>{sector}: {(value * 100).toFixed(1)}%</div>
          ))}
        </div>
      </div>
    </div>
  );
}
