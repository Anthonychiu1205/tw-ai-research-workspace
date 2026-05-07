import { z } from "zod";
import { mockMetaSchema } from "@/lib/schemas/common";

export const llmTraceSchema = z.object({
  model: z.string(),
  tokensIn: z.number(),
  tokensOut: z.number(),
  latencyMs: z.number(),
});

export const reportSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  evidenceIds: z.array(z.string()),
});

export const reportQualitySchema = z.object({
  completeness: z.number().min(0).max(1),
  consistency: z.number().min(0).max(1),
  caution: z.number().min(0).max(1),
});

export const researchReportSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  generatedAt: z.string(),
  sections: z.array(reportSectionSchema),
  quality: reportQualitySchema,
  trace: llmTraceSchema,
  metadata: mockMetaSchema,
});

export type LLMTrace = z.infer<typeof llmTraceSchema>;
export type ReportSection = z.infer<typeof reportSectionSchema>;
export type ReportQuality = z.infer<typeof reportQualitySchema>;
export type ResearchReport = z.infer<typeof researchReportSchema>;
