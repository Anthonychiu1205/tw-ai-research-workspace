import type { PositionTarget } from "@/lib/schemas/strategies";

export function PositionTargetsTable({ targets }: { targets: PositionTarget[] }) {
  return (
    <div className="rounded border p-3" data-testid="position-targets-table">
      <div className="mb-2 text-xs font-medium">Target Weights</div>
      <div className="space-y-1 text-xs">
        {targets.map((target) => (
          <div key={target.ticker} className="grid grid-cols-5 gap-2 rounded border border-border/60 px-2 py-1">
            <span>{target.ticker}</span>
            <span>{(target.currentWeight * 100).toFixed(1)}%</span>
            <span>{(target.targetWeight * 100).toFixed(1)}%</span>
            <span>{(target.changeWeight * 100).toFixed(1)}%</span>
            <span>{target.riskFlags.join(", ") || "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
