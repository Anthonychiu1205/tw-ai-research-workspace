import { z } from "zod";
import { mockMetaSchema } from "@/lib/schemas/common";

export const signalDistributionSchema = z.object({
  positive: z.number(),
  neutral: z.number(),
  negative: z.number(),
});

export const factorCoverageSchema = z.object({
  factor: z.string(),
  coverage: z.number().min(0).max(1),
});

export const agentContributionSchema = z.object({
  agent: z.string(),
  weight: z.number().min(0).max(1),
});

export const signalEvaluationResultSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  distribution: signalDistributionSchema,
  factors: z.array(factorCoverageSchema),
  contributions: z.array(agentContributionSchema),
  metadata: mockMetaSchema,
});

export type SignalDistribution = z.infer<typeof signalDistributionSchema>;
export type FactorCoverage = z.infer<typeof factorCoverageSchema>;
export type AgentContribution = z.infer<typeof agentContributionSchema>;
export type SignalEvaluationResult = z.infer<typeof signalEvaluationResultSchema>;
