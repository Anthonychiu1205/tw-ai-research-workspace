import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";

function formatIso(iso?: string) {
  if (!iso) return "—";
  return iso.replace("T", " ").slice(0, 16);
}

function artifactTypeLabel(type: WorkspaceArtifactRecord["type"], t: (path: string) => string) {
  if (type === "research_card") return t("artifacts.researchCard");
  if (type === "report") return t("artifacts.report");
  if (type === "pipeline_trace") return t("artifacts.pipelineTrace");
  if (type === "strategy_comparison") return t("artifacts.strategyComparison");
  if (type === "signal_evaluation") return t("artifacts.signalEvaluation");
  if (type === "evidence_timeline") return t("artifacts.evidenceTimeline");
  if (type === "portfolio_review") return t("artifacts.portfolioReview");
  if (type === "rebalance_plan") return t("artifacts.rebalancePlan");
  if (type === "backtest_v2_summary") return t("artifacts.backtestV2Summary");
  return type;
}

export function ArtifactMetadataCard({ artifact }: { artifact: WorkspaceArtifactRecord }) {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-md border border-border bg-slate-50 p-3 text-xs" data-testid="artifact-metadata-card">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{artifactTypeLabel(artifact.type, t)}</Badge>
        <StatusBadge tone={artifact.source === "api" ? "backend" : artifact.source === "mock_fallback" ? "warning" : "mock"}>
          {t("common.source")}: {artifact.source}
        </StatusBadge>
        {artifact.pinned ? <Badge>{t("artifacts.pin")}</Badge> : null}
      </div>
      <div>{t("common.createdAt")}: {formatIso(artifact.createdAt)}</div>
      {artifact.updatedAt ? <div>{t("common.updatedAt")}: {formatIso(artifact.updatedAt)}</div> : null}
      {artifact.ticker ? <div>ticker: {artifact.ticker}</div> : null}
      {artifact.tickers?.length ? <div>watchlist: {artifact.tickers.join(", ")}</div> : null}
      <div className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1.5 text-indigo-900">
        {t("disclaimers.mockData")} {t("disclaimers.nonAdvice")}
      </div>
    </div>
  );
}
