import { z } from "zod";

export const workspaceMetaSchema = z.object({
  provider: z.enum(["mock", "openai", "anthropic", "local", "api"]),
  dataType: z.enum(["synthetic_mock", "api_result", "hybrid_result"]).default("synthetic_mock"),
  source: z.enum(["mock", "api", "mock_fallback"]).default("mock"),
  fallbackUsed: z.boolean().default(false),
  fallbackReason: z.string().optional(),
  synthetic: z.boolean().default(true),
  notFinancialAdvice: z.literal(true).default(true),
  noTradingExecution: z.literal(true).default(true),
});

// Backward-compatible alias for existing imports.
export const mockMetaSchema = workspaceMetaSchema;
