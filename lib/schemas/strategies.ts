import { z } from "zod";
import { mockMetaSchema } from "@/lib/schemas/common";

export const strategyResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  syntheticReturn: z.number(),
  syntheticDrawdown: z.number(),
  riskLabel: z.string(),
});

export const strategyComparisonSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  strategies: z.array(strategyResultSchema),
  portfolioMetrics: z
    .object({
      finalEquity: z.number().optional(),
      totalReturn: z.number().optional(),
      maxDrawdown: z.number().optional(),
      turnover: z.number().optional(),
      benchmarkReturn: z.number().optional(),
    })
    .optional(),
  metadata: mockMetaSchema,
});

export const positionTargetSchema = z.object({
  ticker: z.string(),
  targetWeight: z.number(),
  currentWeight: z.number().default(0),
  changeWeight: z.number(),
  reason: z.string().optional(),
  riskFlags: z.array(z.string()).default([]),
  sourceScore: z.number().optional(),
  confidence: z.number().optional(),
});

export const rebalanceDecisionSchema = z.object({
  ticker: z.string(),
  action: z.enum(["increase", "decrease", "hold", "exit", "enter"]),
  fromWeight: z.number(),
  toWeight: z.number(),
  reason: z.string().optional(),
  constraintsApplied: z.array(z.string()).default([]),
});

export const rebalancePlanSchema = z.object({
  planId: z.string(),
  asOfDate: z.string(),
  targetWeights: z.record(z.string(), z.number()),
  cashWeight: z.number(),
  turnoverEstimate: z.number().optional(),
  riskSummary: z.record(z.string(), z.unknown()).optional(),
  decisions: z.array(rebalanceDecisionSchema).default([]),
});

export const exposureBreakdownSchema = z.object({
  byTicker: z.record(z.string(), z.number()).default({}),
  bySector: z.record(z.string(), z.number()).default({}),
});

export const portfolioMetricsSchema = z.object({
  finalEquity: z.number(),
  totalReturn: z.number(),
  maxDrawdown: z.number(),
  turnover: z.number(),
  benchmarkReturn: z.number(),
  costs: z.number().optional(),
});

export const portfolioReviewSchema = z.object({
  analysisId: z.string(),
  asOfDate: z.string(),
  tickers: z.array(z.string()).default([]),
  targetWeights: z.record(z.string(), z.number()),
  cashWeight: z.number(),
  rebalancePlan: rebalancePlanSchema,
  warnings: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  metadata: mockMetaSchema,
});

export const backtestV2SummarySchema = z.object({
  id: z.string(),
  mode: z.literal("portfolio_manager"),
  startDate: z.string(),
  endDate: z.string(),
  portfolioMetrics: portfolioMetricsSchema,
  benchmarkMetrics: z.record(z.string(), z.number()).default({}),
  monthlyReturns: z.array(z.record(z.string(), z.unknown())).default([]),
  exposure: exposureBreakdownSchema,
  assumptions: z.array(z.string()).default([]),
  noLookaheadAudit: z.enum(["pass", "warn"]).default("pass"),
  metadata: mockMetaSchema,
});

export type StrategyResult = z.infer<typeof strategyResultSchema>;
export type StrategyComparison = z.infer<typeof strategyComparisonSchema>;
export type PositionTarget = z.infer<typeof positionTargetSchema>;
export type RebalancePlan = z.infer<typeof rebalancePlanSchema>;
export type ExposureBreakdown = z.infer<typeof exposureBreakdownSchema>;
export type PortfolioMetrics = z.infer<typeof portfolioMetricsSchema>;
export type PortfolioReview = z.infer<typeof portfolioReviewSchema>;
export type BacktestV2Summary = z.infer<typeof backtestV2SummarySchema>;
