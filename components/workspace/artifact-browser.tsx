"use client";

import { useMemo, useState } from "react";
import type { ArtifactKind, WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

const filterKinds: Array<ArtifactKind | "all"> = [
  "all",
  "research_card",
  "report",
  "pipeline_trace",
  "strategy_comparison",
  "signal_evaluation",
  "evidence_timeline",
  "backtest_summary",
];

function artifactTypeLabel(kind: ArtifactKind, t: (path: string) => string) {
  if (kind === "research_card") return t("artifacts.researchCard");
  if (kind === "report") return t("artifacts.report");
  if (kind === "pipeline_trace") return t("artifacts.pipelineTrace");
  if (kind === "strategy_comparison") return t("artifacts.strategyComparison");
  if (kind === "signal_evaluation") return t("artifacts.signalEvaluation");
  if (kind === "evidence_timeline") return t("artifacts.evidenceTimeline");
  return kind;
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
    <div className="space-y-2" data-testid="artifact-browser">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-muted-foreground">{t("artifacts.title")}</div>
        <select
          aria-label="Artifact type filter"
          className="h-8 rounded border bg-background px-2 text-xs"
          value={filterKind}
          onChange={(event) => setFilterKind(event.target.value as ArtifactKind | "all")}
        >
          {filterKinds.map((kind) => (
            <option key={kind} value={kind}>
              {kind}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">{t("artifacts.noArtifacts")}</div> : null}

      {filtered.map((artifact) => {
        const selected = selectedArtifactId === artifact.id;

        return (
          <div key={artifact.id} className="rounded-md border p-2 text-sm">
            <div className="mb-1 flex items-center justify-between">
              <div>{artifact.title}</div>
              <Badge>{artifactTypeLabel(artifact.type, t)}</Badge>
            </div>
            <div className="mb-2 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
              <Badge>{artifact.source}</Badge>
              <Badge>{artifact.synthetic ? "synthetic" : "api"}</Badge>
              <Badge>{t("disclaimers.nonAdvice")}</Badge>
            </div>
            <Button type="button" size="sm" variant={selected ? "default" : "outline"} onClick={() => onSelect?.(artifact.id)}>
              {selected ? t("common.selected") : t("common.open")}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
