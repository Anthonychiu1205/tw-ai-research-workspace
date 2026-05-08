import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
          <Badge>{item.dataset}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-xs text-muted-foreground">
          {item.field}: {item.value}
        </div>
        <p className="mb-1 text-sm text-muted-foreground">{item.interpretation}</p>
        <div className="text-[11px] text-yellow-300">source: {item.source ?? "mock"} / synthetic / non-advice</div>
      </CardContent>
    </Card>
  );
}
