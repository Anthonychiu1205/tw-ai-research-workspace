import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ArtifactMetadataCard({ artifact }: { artifact: WorkspaceArtifactRecord }) {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-md border p-3 text-xs" data-testid="artifact-metadata-card">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{artifact.type}</Badge>
        <Badge>{artifact.source}</Badge>
        {artifact.pinned ? <Badge>{t("artifacts.pin")}</Badge> : null}
      </div>
      <div>created: {artifact.createdAt}</div>
      {artifact.updatedAt ? <div>updated: {artifact.updatedAt}</div> : null}
      {artifact.ticker ? <div>ticker: {artifact.ticker}</div> : null}
      {artifact.tickers?.length ? <div>watchlist: {artifact.tickers.join(", ")}</div> : null}
      <div className="text-yellow-300">
        {t("disclaimers.mockData")} {t("disclaimers.nonAdvice")} {t("disclaimers.noTrading")}
      </div>
    </div>
  );
}
