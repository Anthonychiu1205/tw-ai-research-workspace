export function EvidenceTimeline({
  points,
}: {
  points: Array<{ at: string; label: string; note: string }>;
}) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      {points.map((point) => (
        <div key={`${point.at}-${point.label}`} className="text-sm">
          <span className="text-xs text-muted-foreground">{point.at}</span>
          <div>{point.label}</div>
          <div className="text-xs text-muted-foreground">{point.note}</div>
        </div>
      ))}
    </div>
  );
}
