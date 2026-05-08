import type { ResearchOperationResult } from "@/lib/operations/operation-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function OperationResultSummary({
  result,
  onOpenArtifact,
  onPinArtifact,
}: {
  result: ResearchOperationResult;
  onOpenArtifact?: (artifactId: string) => void;
  onPinArtifact?: (artifactId: string) => void;
}) {
  const { t } = useI18n();
  const copyJson = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  return (
    <div className="rounded-md border p-3 text-xs" data-testid="operation-result-summary">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-medium">{result.kind}</span>
        <Badge>{result.status}</Badge>
        <Badge>{result.source}</Badge>
      </div>
      <div className="mb-2 text-muted-foreground">{result.summary}</div>
      {result.error ? <div className="mb-2 text-red-400">{result.error}</div> : null}
      {result.warnings.length > 0 ? <div className="mb-2 text-yellow-400">{result.warnings.join("; ")}</div> : null}
      <div className="flex flex-wrap gap-2">
        {result.artifactIds.map((artifactId) => (
          <div key={artifactId} className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => onOpenArtifact?.(artifactId)}>
              {t("common.open")}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onPinArtifact?.(artifactId)}>
              {t("artifacts.pin")}
            </Button>
          </div>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={() => void copyJson()}>
          {t("artifacts.exportJson")}
        </Button>
      </div>
    </div>
  );
}
