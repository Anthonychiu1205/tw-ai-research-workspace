import { z } from "zod";

export const mockMetaSchema = z.object({
  provider: z.literal("mock"),
  dataType: z.literal("synthetic_mock"),
  notFinancialAdvice: z.literal(true),
  noTradingExecution: z.literal(true),
});
