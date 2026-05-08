import {
  runResearch,
  generateReport,
  runPipeline,
  runBacktest,
  compareStrategies,
  evaluateSignals,
  type FrontendSafeMeta,
} from "@/lib/api/client";
import {
  adaptResearchRunToResearchCard,
  adaptReportToSections,
  adaptPipelineToPlannerTrace,
  adaptStrategyComparisonToTable,
  adaptSignalEvaluationToExplorer,
} from "@/lib/api/adapters";
import { createArtifactStore, type ArtifactStoreApi } from "@/lib/artifacts/artifact-store";
import { createArtifactTitle, operationKindToArtifactType, operationSummary } from "@/lib/operations/operation-artifacts";
import type { ResearchOperationRequest, ResearchOperationResult } from "@/lib/operations/operation-types";
import { createId } from "@/lib/utils/ids";
import { nowIso } from "@/lib/utils/dates";

type SafeResponse<T> = {
  data: T;
  source: "mock" | "api" | "mock_fallback";
  warning?: string;
  fallbackUsed: boolean;
  fallbackReason?: string;
};

function normalizeSafeResponse<T extends Record<string, unknown>>(
  result: Awaited<ReturnType<typeof runResearch>> | Awaited<ReturnType<typeof generateReport>> | Awaited<ReturnType<typeof runPipeline>> | Awaited<ReturnType<typeof runBacktest>> | Awaited<ReturnType<typeof compareStrategies>> | Awaited<ReturnType<typeof evaluateSignals>>,
): SafeResponse<T> {
  if (result.ok) {
    return {
      data: result.data as unknown as T,
      source: result.meta.source,
      warning: result.warning,
      fallbackUsed: result.meta.fallbackUsed,
      fallbackReason: result.meta.fallbackReason,
    };
  }

  if (result.fallbackData) {
    return {
      data: result.fallbackData as unknown as T,
      source: "mock_fallback",
      warning: result.error.message,
      fallbackUsed: true,
      fallbackReason: result.meta.fallbackReason ?? result.error.message,
    };
  }

  throw new Error(result.error.message);
}

function toFrontendMeta(source: "mock" | "api" | "mock_fallback", fallbackUsed: boolean, fallbackReason?: string): FrontendSafeMeta {
  return {
    source,
    provider: source === "api" ? "api" : "mock",
    synthetic: source !== "api",
    fallbackUsed,
    fallbackReason,
    notFinancialAdvice: true,
    noTradingExecution: true,
  };
}

export function createDefaultOperationRequest(kind: ResearchOperationRequest["kind"]): ResearchOperationRequest {
  return {
    id: createId("op"),
    kind,
    ticker: "2330",
    tickers: ["2330", "2317", "2454", "2308", "0050"],
    includePhase2Agents: true,
    outputMode: "artifact",
    createdAt: nowIso(),
  };
}

export async function runResearchOperation(
  request: ResearchOperationRequest,
  artifactStore: ArtifactStoreApi = createArtifactStore(),
): Promise<ResearchOperationResult> {
  const basePayload = {
    symbol: request.ticker ?? "2330",
    tickers: request.tickers,
    asOfDate: request.asOfDate,
    startDate: request.startDate,
    endDate: request.endDate,
    includePhase2Agents: request.includePhase2Agents ?? true,
    llmMode: request.llmMode,
  };

  try {
    let safeData: SafeResponse<any>;
    let artifactData: unknown;

    if (request.kind === "run_research") {
      safeData = normalizeSafeResponse(await runResearch(basePayload));
      artifactData = adaptResearchRunToResearchCard(
        safeData.data,
        toFrontendMeta(safeData.source, safeData.fallbackUsed, safeData.fallbackReason),
      );
    } else if (request.kind === "generate_report") {
      safeData = normalizeSafeResponse(await generateReport(basePayload));
      artifactData = {
        id: safeData.data.id ?? createId("report"),
        symbol: safeData.data.symbol ?? basePayload.symbol,
        sections: adaptReportToSections(safeData.data),
        metadata: safeData.data.metadata,
      };
    } else if (request.kind === "run_pipeline") {
      safeData = normalizeSafeResponse(await runPipeline(basePayload));
      artifactData = adaptPipelineToPlannerTrace(
        safeData.data,
        toFrontendMeta(safeData.source, safeData.fallbackUsed, safeData.fallbackReason),
      );
    } else if (request.kind === "run_backtest") {
      safeData = normalizeSafeResponse(await runBacktest(basePayload));
      artifactData = safeData.data;
    } else if (request.kind === "compare_strategies") {
      safeData = normalizeSafeResponse(await compareStrategies(basePayload));
      artifactData = adaptStrategyComparisonToTable(
        safeData.data,
        toFrontendMeta(safeData.source, safeData.fallbackUsed, safeData.fallbackReason),
      );
    } else {
      safeData = normalizeSafeResponse(await evaluateSignals(basePayload));
      artifactData = adaptSignalEvaluationToExplorer(
        safeData.data,
        toFrontendMeta(safeData.source, safeData.fallbackUsed, safeData.fallbackReason),
      );
    }

    const artifact = artifactStore.create({
      sessionId: "session-1",
      type: operationKindToArtifactType(request.kind),
      title: createArtifactTitle(request),
      summary: operationSummary(request.kind, request.ticker ?? request.tickers?.join(",") ?? "watchlist"),
      ticker: request.ticker,
      tickers: request.tickers,
      asOfDate: request.asOfDate,
      source: safeData.source,
      synthetic: safeData.source !== "api",
      data: artifactData,
      lineage: {
        operationId: request.id,
      },
    });

    return {
      operationId: request.id,
      kind: request.kind,
      status: "succeeded",
      summary: operationSummary(request.kind, request.ticker ?? request.tickers?.join(",") ?? "watchlist"),
      artifactIds: [artifact.id],
      warnings: safeData.warning ? [safeData.warning] : [],
      source: safeData.source,
    };
  } catch (error) {
    return {
      operationId: request.id,
      kind: request.kind,
      status: "failed",
      summary: "Operation failed safely with no trading execution",
      artifactIds: [],
      warnings: [],
      error: error instanceof Error ? error.message : "Unknown operation failure",
      source: "mock_fallback",
    };
  }
}
