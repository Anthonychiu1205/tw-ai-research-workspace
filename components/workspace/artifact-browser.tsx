"use client";

import { useMemo, useState } from "react";
import type { ArtifactKind, WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionHeading } from "@/components/ui/section-heading";

const filterKinds: Array<ArtifactKind | "all"> = [
  "all",
  "research_card",
  "report",
  "pipeline_trace",
  "strategy_comparison",
  "signal_evaluation",
  "evidence_timeline",
  "backtest_summary",
  "portfolio_review",
  "rebalance_plan",
  "backtest_v2_summary",
];

function artifactTypeLabel(kind: ArtifactKind, t: (path: string) => string) {
  if (kind === "research_card") return t("artifacts.researchCard");
  if (kind === "report") return t("artifacts.report");
  if (kind === "pipeline_trace") return t("artifacts.pipelineTrace");
  if (kind === "strategy_comparison") return t("artifacts.strategyComparison");
  if (kind === "signal_evaluation") return t("artifacts.signalEvaluation");
  if (kind === "evidence_timeline") return t("artifacts.evidenceTimeline");
  if (kind === "portfolio_review") return t("artifacts.portfolioReview");
  if (kind === "rebalance_plan") return t("artifacts.rebalancePlan");
  if (kind === "backtest_v2_summary") return t("artifacts.backtestV2Summary");
  return kind;
}

function filterLabel(kind: ArtifactKind | "all", t: (path: string) => string) {
  if (kind === "all") return "all";
  return artifactTypeLabel(kind, t);
}

function artifactTone(kind: ArtifactKind) {
  if (kind === "research_card") return "backend" as const;
  if (kind === "report") return "trace" as const;
  if (kind === "pipeline_trace") return "evidence" as const;
  if (kind === "strategy_comparison") return "success" as const;
  if (kind === "signal_evaluation") return "backend" as const;
  if (kind === "backtest_summary" || kind === "backtest_v2_summary") return "warning" as const;
  if (kind === "portfolio_review" || kind === "rebalance_plan") return "mock" as const;
  return "neutral" as const;
}

export function ArtifactBrowser({
  artifacts,
  selectedArtifactId,
  onSelect,
}: {
  artifacts: WorkspaceArtifactRecord[];
  selectedArtifactId?: string | null;
  onSelect?: (artifactId: string) => void;
}) {
  const { t } = useI18n();
  const [filterKind, setFilterKind] = useState<ArtifactKind | "all">("all");

  const filtered = useMemo(() => {
    if (filterKind === "all") return artifacts;
    return artifacts.filter((artifact) => artifact.type === filterKind || artifact.kind === filterKind);
  }, [artifacts, filterKind]);

  return (
    <div className="space-y-3" data-testid="artifact-browser">
      <div className="flex items-end justify-between gap-2">
        <SectionHeading title={t("artifacts.title")} subtitle={t("artifacts.recentArtifactsHint")} />
        <select
          aria-label="Artifact type filter"
          className="h-9 min-w-[172px] rounded-md border bg-background px-3 text-xs"
          value={filterKind}
          onChange={(event) => setFilterKind(event.target.value as ArtifactKind | "all")}
        >
          {filterKinds.map((kind) => (
            <option key={kind} value={kind}>
              {filterLabel(kind, t)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/60 p-3 text-sm text-muted-foreground">{t("emptyStates.noArtifactSelection")}</div>
      ) : null}

      <div className="space-y-1.5">
        {filtered.map((artifact) => {
          const selected = selectedArtifactId === artifact.id;

          return (
            <div key={artifact.id} className={`rounded-md px-2.5 py-2 ${selected ? "bg-muted/50" : "hover:bg-muted/35"}`}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="line-clamp-2 text-sm leading-5">{artifact.title}</div>
                <StatusBadge tone={artifactTone(artifact.type)}>{artifactTypeLabel(artifact.type, t)}</StatusBadge>
              </div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <StatusBadge tone={artifact.source === "api" ? "backend" : "mock"}>{artifact.source}</StatusBadge>
                {artifact.synthetic ? <StatusBadge tone="mock">synthetic</StatusBadge> : null}
              </div>
              <Button type="button" size="sm" variant={selected ? "default" : "outline"} onClick={() => onSelect?.(artifact.id)}>
                {selected ? t("common.selected") : t("common.open")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
