import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const { t } = useI18n();
  const isDisclaimerSection = /disclaimer|limitation|risk/i.test(title) || /not financial advice|no trading/i.test(content);

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">{content}</p>
        <div className="mb-2 flex flex-wrap gap-1 text-[11px]">
          <StatusBadge tone="evidence">{t("tools.evidenceRefs")} {evidenceIds.length}</StatusBadge>
        </div>

        {evidenceIds.length === 0 ? (
          <div className="mb-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
            {t("evidence.references")} unavailable for this section.
          </div>
        ) : (
          <div className="mb-2 flex flex-wrap gap-1">
            {evidenceIds.map((evidenceId) => (
              <button
                key={evidenceId}
                type="button"
                className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-800"
                onClick={() => onEvidenceSelect?.(evidenceId)}
              >
                {evidenceId}
              </button>
            ))}
          </div>
        )}

        {isDisclaimerSection ? (
          <div className="rounded border border-indigo-200 bg-indigo-50 p-2">
            <StatusBadge tone="mock">{t("disclaimers.mockData")}</StatusBadge>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
