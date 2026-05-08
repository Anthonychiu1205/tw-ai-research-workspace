import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export function EvidenceCard({
  item,
}: {
  item: {
    evidenceId: string;
    dataset: string;
    field: string;
    value: string;
    interpretation: string;
    source?: string;
  };
}) {
  return (
    <Card data-testid="evidence-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span>Evidence {item.evidenceId}</span>
          <StatusBadge tone="evidence">{item.dataset}</StatusBadge>
          <StatusBadge tone="mock">{item.evidenceId}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-xs text-muted-foreground">
          {item.field}: {item.value}
        </div>
        <p className="mb-1 text-sm leading-6 text-muted-foreground">{item.interpretation}</p>
        <div className="flex flex-wrap gap-1 text-[11px]">
          <StatusBadge tone="mock">{item.source ?? "mock"}</StatusBadge>
          <StatusBadge tone="mock">synthetic</StatusBadge>
          <StatusBadge tone="warning">non-advice</StatusBadge>
        </div>
      </CardContent>
    </Card>
  );
}
