import { Badge } from "@/components/ui/badge";

type EvidencePoint = {
  id?: string;
  at: string;
  label: string;
  note: string;
  dataset?: string;
};

export function EvidenceTimeline({
  points,
  selectedEvidenceId,
  dataset,
  compact,
}: {
  points: EvidencePoint[];
  selectedEvidenceId?: string;
  dataset?: string;
  compact?: boolean;
}) {
  const filtered = dataset ? points.filter((point) => point.dataset === dataset) : points;

  if (filtered.length === 0) {
    return <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">No evidence timeline points.</div>;
  }

  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="evidence-timeline">
      {filtered.map((point, index) => {
        const id = point.id ?? `ev-${index + 1}`;
        const selected = id === selectedEvidenceId;

        return (
          <div key={`${point.at}-${point.label}-${id}`} className={`rounded p-2 text-sm ${selected ? "border border-blue-400/60 bg-blue-500/10" : ""}`}>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{point.at}</span>
              <Badge>{id}</Badge>
              {point.dataset ? <Badge>{point.dataset}</Badge> : null}
              {selected ? <Badge>selected</Badge> : null}
            </div>
            <div>{point.label}</div>
            {!compact ? <div className="text-xs text-muted-foreground">{point.note}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
