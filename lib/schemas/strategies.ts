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
  metadata: mockMetaSchema,
});

export type StrategyResult = z.infer<typeof strategyResultSchema>;
export type StrategyComparison = z.infer<typeof strategyComparisonSchema>;
