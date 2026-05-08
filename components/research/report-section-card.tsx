import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReportSectionCard({
  title,
  content,
  evidenceIds = [],
  onEvidenceSelect,
}: {
  title: string;
  content: string;
  evidenceIds?: string[];
  onEvidenceSelect?: (evidenceId: string) => void;
}) {
  const isDisclaimerSection = /disclaimer|limitation|risk/i.test(title) || /not financial advice|no trading/i.test(content);

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">{content}</p>

        {evidenceIds.length === 0 ? (
          <div className="mb-2 text-xs text-yellow-300">No evidence ids linked for this section.</div>
        ) : (
          <div className="mb-2 flex flex-wrap gap-1">
            {evidenceIds.map((evidenceId) => (
              <button
                key={evidenceId}
                type="button"
                className="rounded border px-2 py-1 text-[11px]"
                onClick={() => onEvidenceSelect?.(evidenceId)}
              >
                {evidenceId}
              </button>
            ))}
          </div>
        )}

        {isDisclaimerSection ? <Badge>Synthetic output, not financial advice</Badge> : null}
      </CardContent>
    </Card>
  );
}
