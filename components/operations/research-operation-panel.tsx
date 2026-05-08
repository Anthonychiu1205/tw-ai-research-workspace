"use client";

import { useState } from "react";
import type { ResearchOperationRequest, ResearchOperationResult } from "@/lib/operations/operation-types";
import { createDefaultOperationRequest, runResearchOperation } from "@/lib/operations/operation-runner";
import type { ArtifactStoreApi } from "@/lib/artifacts/artifact-store";
import { RunResearchForm } from "@/components/operations/run-research-form";
import { GenerateReportForm } from "@/components/operations/generate-report-form";
import { RunPipelineForm } from "@/components/operations/run-pipeline-form";
import { RunBacktestForm } from "@/components/operations/run-backtest-form";
import { CompareStrategiesForm } from "@/components/operations/compare-strategies-form";
import { EvaluateSignalsForm } from "@/components/operations/evaluate-signals-form";
import { OperationResultSummary } from "@/components/operations/operation-result-summary";

export function ResearchOperationPanel({
  artifactStore,
  onArtifactCreated,
}: {
  artifactStore: ArtifactStoreApi;
  onArtifactCreated?: (artifactId: string) => void;
}) {
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<ResearchOperationResult | null>(null);

  async function execute(request: ResearchOperationRequest) {
    setRunning(true);
    const result = await runResearchOperation(request, artifactStore);
    setLastResult(result);
    if (result.artifactIds[0]) {
      onArtifactCreated?.(result.artifactIds[0]);
    }
    setRunning(false);
    return result;
  }

  return (
    <div className="space-y-3 rounded-md border p-3" data-testid="research-operation-panel">
      <div className="text-sm font-medium">Research Operations</div>
      <div className="space-y-2 text-xs">
        <RunResearchForm
          disabled={running}
          onSubmit={async (ticker, includePhase2Agents) => {
            const request = createDefaultOperationRequest("run_research");
            request.ticker = ticker;
            request.includePhase2Agents = includePhase2Agents;
            await execute(request);
          }}
        />
        <GenerateReportForm
          disabled={running}
          onSubmit={async (ticker) => {
            const request = createDefaultOperationRequest("generate_report");
            request.ticker = ticker;
            await execute(request);
          }}
        />
        <RunPipelineForm
          disabled={running}
          onSubmit={async (ticker) => {
            const request = createDefaultOperationRequest("run_pipeline");
            request.ticker = ticker;
            await execute(request);
          }}
        />
        <RunBacktestForm
          disabled={running}
          onSubmit={async (ticker) => {
            const request = createDefaultOperationRequest("run_backtest");
            request.ticker = ticker;
            await execute(request);
          }}
        />
        <CompareStrategiesForm
          disabled={running}
          onSubmit={async (tickers) => {
            const request = createDefaultOperationRequest("compare_strategies");
            request.tickers = tickers;
            request.ticker = tickers[0] ?? "2330";
            await execute(request);
          }}
        />
        <EvaluateSignalsForm
          disabled={running}
          onSubmit={async (tickers) => {
            const request = createDefaultOperationRequest("evaluate_signals");
            request.tickers = tickers;
            request.ticker = tickers[0] ?? "2330";
            await execute(request);
          }}
        />
      </div>

      {lastResult ? (
        <OperationResultSummary result={lastResult} onOpenArtifact={onArtifactCreated} />
      ) : (
        <div className="text-xs text-muted-foreground">Run an operation to generate synthetic artifacts (non-advice).</div>
      )}
    </div>
  );
}
