import type { ResearchOperationResult } from "@/lib/operations/operation-types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";
import { InlineFeedback } from "@/components/ui/inline-feedback";

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
    <div className="rounded-md border border-border bg-white p-3 text-xs" data-testid="operation-result-summary">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-medium">{result.kind}</span>
        <StatusBadge tone={result.status === "succeeded" ? "success" : "danger"}>{result.status}</StatusBadge>
        <StatusBadge tone={result.source === "api" ? "backend" : result.source === "mock_fallback" ? "warning" : "mock"}>{result.source}</StatusBadge>
      </div>
      <div className="mb-2 text-muted-foreground">{result.summary}</div>
      {result.error ? <InlineFeedback tone="danger" message={t("errors.generic")} detail={result.error} /> : null}
      {result.warnings.length > 0 ? <InlineFeedback tone="warning" message={t("runtime.fallback")} detail={result.warnings.join("; ")} /> : null}
      <div className="flex flex-wrap gap-2">
        {result.artifactIds.map((artifactId) => (
          <div key={artifactId} className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => onOpenArtifact?.(artifactId)}>
              {t("common.openArtifact")}
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
