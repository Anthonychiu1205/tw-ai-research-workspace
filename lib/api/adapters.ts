import { researchCardSchema, signalMatrixSchema } from "@/lib/schemas/research";
import { reportSectionSchema } from "@/lib/schemas/reports";
import { researchPipelineResultSchema } from "@/lib/schemas/traces";
import { signalEvaluationResultSchema } from "@/lib/schemas/signals";
import {
  strategyComparisonSchema,
  portfolioReviewSchema,
  rebalancePlanSchema,
  backtestV2SummarySchema,
  type PortfolioReview,
  type BacktestV2Summary,
} from "@/lib/schemas/strategies";
import type { FrontendSafeMeta } from "@/lib/api/client";

function mergeMeta(inputMeta: any, frontendMeta?: FrontendSafeMeta) {
  return {
    provider: frontendMeta?.provider ?? inputMeta?.provider ?? "mock",
    dataType: frontendMeta?.synthetic ? "synthetic_mock" : "api_result",
    source: frontendMeta?.source ?? inputMeta?.source ?? "mock",
    fallbackUsed: frontendMeta?.fallbackUsed ?? false,
    fallbackReason: frontendMeta?.fallbackReason,
    synthetic: frontendMeta?.synthetic ?? true,
    notFinancialAdvice: true,
    noTradingExecution: true,
  };
}

export function adaptResearchRunToResearchCard(input: any, frontendMeta?: FrontendSafeMeta) {
  return researchCardSchema.parse({
    id: input.runId ?? "run-mock",
    symbol: input.symbol,
    name: input.name ?? `${input.symbol} Synthetic`,
    summary: input.findings?.[0] ?? "Synthetic research summary",
    score: input.score ?? 0,
    updatedAt: input.generatedAt,
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptResearchRunToSignalMatrix(input: any, frontendMeta?: FrontendSafeMeta) {
  return signalMatrixSchema.parse({
    id: input.runId ?? "matrix-mock",
    watchlist: ["2330", "2317", "2454", "2308", "0050"],
    signals: [
      {
        agent: "valuation",
        direction: "positive",
        confidence: 0.68,
        rationale: "Synthetic valuation spread",
      },
      {
        agent: "risk",
        direction: "neutral",
        confidence: 0.55,
        rationale: "Synthetic risk control",
      },
    ],
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptReportToSections(input: any) {
  return (input.sections ?? []).map((section: any) =>
    reportSectionSchema.parse({
      id: section.id,
      title: section.title,
      content: section.content,
      evidenceIds: section.evidenceIds ?? [],
    }),
  );
}

export function adaptPipelineToPlannerTrace(input: any, frontendMeta?: FrontendSafeMeta) {
  return researchPipelineResultSchema.parse({
    ...input,
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptSignalEvaluationToExplorer(input: any, frontendMeta?: FrontendSafeMeta) {
  return signalEvaluationResultSchema.parse({
    ...input,
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptStrategyComparisonToTable(input: any, frontendMeta?: FrontendSafeMeta) {
  return strategyComparisonSchema.parse({
    ...input,
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptPortfolioReview(input: any, frontendMeta?: FrontendSafeMeta): PortfolioReview {
  return portfolioReviewSchema.parse({
    ...input,
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptRebalancePlan(input: any, frontendMeta?: FrontendSafeMeta) {
  const plan = input?.rebalancePlan ?? input;
  return rebalancePlanSchema.parse({
    ...plan,
    _meta: mergeMeta(input?.metadata, frontendMeta),
  });
}

export function adaptBacktestV2Summary(input: any, frontendMeta?: FrontendSafeMeta): BacktestV2Summary {
  return backtestV2SummarySchema.parse({
    ...input,
    metadata: mergeMeta(input.metadata, frontendMeta),
  });
}

export function adaptEvidenceTimeline(input: any, frontendMeta?: FrontendSafeMeta) {
  return {
    id: input.id,
    symbol: input.symbol,
    points: input.points ?? [],
    metadata: mergeMeta(input.metadata, frontendMeta),
  };
}
