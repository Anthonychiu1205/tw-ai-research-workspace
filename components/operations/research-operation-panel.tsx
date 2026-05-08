"use client";

import { useState } from "react";
import type { ResearchOperationRequest, ResearchOperationResult } from "@/lib/operations/operation-types";
import { createDefaultOperationRequest, runResearchOperation } from "@/lib/operations/operation-runner";
import type { ArtifactStoreApi } from "@/lib/artifacts/artifact-store";
import { RunResearchForm } from "@/components/operations/run-research-form";
import { GenerateReportForm } from "@/components/operations/generate-report-form";
import { RunPipelineForm } from "@/components/operations/run-pipeline-form";
import { RunBacktestForm } from "@/components/operations/run-backtest-form";
import { RunPortfolioReviewForm } from "@/components/operations/run-portfolio-review-form";
import { RunBacktestV2Form } from "@/components/operations/run-backtest-v2-form";
import { CompareStrategiesForm } from "@/components/operations/compare-strategies-form";
import { EvaluateSignalsForm } from "@/components/operations/evaluate-signals-form";
import { OperationResultSummary } from "@/components/operations/operation-result-summary";
import { useI18n } from "@/lib/i18n/use-i18n";
import { SectionHeading } from "@/components/ui/section-heading";
import { InlineFeedback } from "@/components/ui/inline-feedback";
import { ActionStatusPill, type ActionStatus } from "@/components/ui/action-status";
import type { CapabilityStatus, WorkspaceCapabilityId } from "@/lib/availability/availability-types";

const operationCapability: Record<ResearchOperationRequest["kind"], WorkspaceCapabilityId> = {
  run_research: "run_research",
  generate_report: "generate_report",
  run_pipeline: "run_pipeline",
  run_backtest: "run_backtest",
  run_portfolio_review: "portfolio_review",
  run_backtest_v2: "backtest_v2",
  compare_strategies: "compare_strategies",
  evaluate_signals: "evaluate_signals",
};

export function ResearchOperationPanel({
  artifactStore,
  onArtifactCreated,
  onOperationCompleted,
  capabilityMap,
}: {
  artifactStore: ArtifactStoreApi;
  onArtifactCreated?: (artifactId: string) => void;
  onOperationCompleted?: (result: ResearchOperationResult) => void;
  capabilityMap?: Partial<Record<WorkspaceCapabilityId, CapabilityStatus>>;
}) {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [activeOperation, setActiveOperation] = useState<ResearchOperationRequest["kind"] | null>(null);
  const [actionStatus, setActionStatus] = useState<ActionStatus>("idle");
  const [feedback, setFeedback] = useState<{ tone: "success" | "warning" | "danger" | "neutral"; message: string; detail?: string } | null>(null);
  const [lastResult, setLastResult] = useState<ResearchOperationResult | null>(null);

  async function execute(request: ResearchOperationRequest) {
    setRunning(true);
    setActiveOperation(request.kind);
    setActionStatus("running");
    setFeedback({ tone: "neutral", message: t("common.loading"), detail: `${request.kind}` });
    const result = await runResearchOperation(request, artifactStore);
    setLastResult(result);
    onOperationCompleted?.(result);
    if (result.artifactIds[0]) {
      onArtifactCreated?.(result.artifactIds[0]);
    }
    if (result.status === "failed") {
      setActionStatus("failed");
      setFeedback({ tone: "danger", message: t("errors.generic"), detail: result.error });
    } else if (result.source === "mock_fallback") {
      setActionStatus("fallback");
      setFeedback({ tone: "warning", message: t("backend.apiFallback"), detail: result.warnings.join("; ") || t("backend.fallback") });
    } else {
      setActionStatus("succeeded");
      setFeedback({
        tone: "success",
        message: t("common.completed"),
        detail: result.artifactIds[0] ? `${t("common.open")} ${result.artifactIds[0].slice(0, 8)}` : undefined,
      });
    }
    setRunning(false);
    setActiveOperation(null);
    return result;
  }

  function capabilityFor(kind: ResearchOperationRequest["kind"]): CapabilityStatus | undefined {
    return capabilityMap?.[operationCapability[kind]];
  }

  function disabledFor(kind: ResearchOperationRequest["kind"]) {
    const cap = capabilityFor(kind);
    if (!cap) return false;
    return !cap.available && !cap.fallbackAvailable;
  }

  function reasonFor(kind: ResearchOperationRequest["kind"]) {
    const cap = capabilityFor(kind);
    if (!cap) return undefined;
    if (!cap.available && cap.reason) return cap.reason;
    if (!cap.available && cap.fallbackAvailable) return t("backend.fallback");
    return undefined;
  }

  return (
    <div className="space-y-3" data-testid="research-operation-panel">
      <SectionHeading title={t("nav.operations")} subtitle={t("disclaimers.mockData")} />
      <div className="flex items-center gap-2">
        <ActionStatusPill
          status={actionStatus}
          label={
            actionStatus === "idle"
              ? "idle"
              : actionStatus === "running"
                ? t("common.loading")
                : actionStatus === "succeeded"
                  ? "succeeded"
                  : actionStatus === "fallback"
                    ? "fallback"
                    : "failed"
          }
        />
        {activeOperation ? <span className="text-xs text-muted-foreground">{activeOperation}</span> : null}
      </div>
      {feedback ? <InlineFeedback tone={feedback.tone} message={feedback.message} detail={feedback.detail} /> : null}

      <details className="rounded-lg border border-border bg-muted/40 p-3" open>
        <summary className="cursor-pointer text-sm font-medium">{t("operations.runResearch")}</summary>
        <div className="mt-3 space-y-2 text-xs">
          <RunResearchForm
            disabled={running || disabledFor("run_research")}
            loading={running && activeOperation === "run_research"}
            onSubmit={async (ticker, includePhase2Agents) => {
              const request = createDefaultOperationRequest("run_research");
              request.ticker = ticker;
              request.includePhase2Agents = includePhase2Agents;
              await execute(request);
            }}
          />
          {reasonFor("run_research") ? <div className="text-xs text-amber-700">{reasonFor("run_research")}</div> : null}
          <GenerateReportForm
            disabled={running || disabledFor("generate_report")}
            loading={running && activeOperation === "generate_report"}
            onSubmit={async (ticker) => {
              const request = createDefaultOperationRequest("generate_report");
              request.ticker = ticker;
              await execute(request);
            }}
          />
          {reasonFor("generate_report") ? <div className="text-xs text-amber-700">{reasonFor("generate_report")}</div> : null}
          <RunPipelineForm
            disabled={running || disabledFor("run_pipeline")}
            loading={running && activeOperation === "run_pipeline"}
            onSubmit={async (ticker) => {
              const request = createDefaultOperationRequest("run_pipeline");
              request.ticker = ticker;
              await execute(request);
            }}
          />
          {reasonFor("run_pipeline") ? <div className="text-xs text-amber-700">{reasonFor("run_pipeline")}</div> : null}
        </div>
      </details>

      <details className="rounded-lg border border-border bg-muted/40 p-3" open={false}>
        <summary className="cursor-pointer text-sm font-medium">{t("operations.compareStrategies")}</summary>
        <div className="mt-3 space-y-2 text-xs">
          <CompareStrategiesForm
            disabled={running || disabledFor("compare_strategies")}
            loading={running && activeOperation === "compare_strategies"}
            onSubmit={async (tickers) => {
              const request = createDefaultOperationRequest("compare_strategies");
              request.tickers = tickers;
              request.ticker = tickers[0] ?? "2330";
              await execute(request);
            }}
          />
          {reasonFor("compare_strategies") ? <div className="text-xs text-amber-700">{reasonFor("compare_strategies")}</div> : null}
          <EvaluateSignalsForm
            disabled={running || disabledFor("evaluate_signals")}
            loading={running && activeOperation === "evaluate_signals"}
            onSubmit={async (tickers) => {
              const request = createDefaultOperationRequest("evaluate_signals");
              request.tickers = tickers;
              request.ticker = tickers[0] ?? "2330";
              await execute(request);
            }}
          />
          {reasonFor("evaluate_signals") ? <div className="text-xs text-amber-700">{reasonFor("evaluate_signals")}</div> : null}
        </div>
      </details>

      <details className="rounded-lg border border-border bg-muted/40 p-3" open={false}>
        <summary className="cursor-pointer text-sm font-medium">{t("operations.runBacktest")}</summary>
        <div className="mt-3 space-y-2 text-xs">
          <RunBacktestForm
            disabled={running || disabledFor("run_backtest")}
            loading={running && activeOperation === "run_backtest"}
            onSubmit={async (ticker) => {
              const request = createDefaultOperationRequest("run_backtest");
              request.ticker = ticker;
              await execute(request);
            }}
          />
          {reasonFor("run_backtest") ? <div className="text-xs text-amber-700">{reasonFor("run_backtest")}</div> : null}
          <RunPortfolioReviewForm
            disabled={running || disabledFor("run_portfolio_review")}
            loading={running && activeOperation === "run_portfolio_review"}
            onSubmit={async (tickers) => {
              const request = createDefaultOperationRequest("run_portfolio_review");
              request.tickers = tickers;
              request.ticker = tickers[0] ?? "2330";
              await execute(request);
            }}
          />
          {reasonFor("run_portfolio_review") ? <div className="text-xs text-amber-700">{reasonFor("run_portfolio_review")}</div> : null}
          <RunBacktestV2Form
            disabled={running || disabledFor("run_backtest_v2")}
            loading={running && activeOperation === "run_backtest_v2"}
            onSubmit={async (tickers) => {
              const request = createDefaultOperationRequest("run_backtest_v2");
              request.tickers = tickers;
              request.ticker = tickers[0] ?? "2330";
              await execute(request);
            }}
          />
          {reasonFor("run_backtest_v2") ? <div className="text-xs text-amber-700">{reasonFor("run_backtest_v2")}</div> : null}
        </div>
      </details>

      {lastResult ? <OperationResultSummary result={lastResult} onOpenArtifact={onArtifactCreated} onPinArtifact={(artifactId) => {
        artifactStore.pin(artifactId);
        onArtifactCreated?.(artifactId);
      }} /> : null}
    </div>
  );
}
