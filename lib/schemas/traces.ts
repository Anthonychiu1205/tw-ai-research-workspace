import { z } from "zod";
import { mockMetaSchema } from "@/lib/schemas/common";

export const researchStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  detail: z.string(),
});

export const researchPlanSchema = z.object({
  id: z.string(),
  objective: z.string(),
  steps: z.array(researchStepSchema),
});

export const toolCallTraceSchema = z.object({
  toolName: z.string(),
  startedAt: z.string(),
  completedAt: z.string(),
  latencyMs: z.number(),
  status: z.enum(["success", "error"]),
});

export const executionTraceSchema = z.object({
  planId: z.string(),
  toolCalls: z.array(toolCallTraceSchema),
  notes: z.array(z.string()),
});

export const reflectionResultSchema = z.object({
  summary: z.string(),
  cautionFlags: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export const researchPipelineResultSchema = z.object({
  pipelineId: z.string(),
  plan: researchPlanSchema,
  execution: executionTraceSchema,
  reflection: reflectionResultSchema,
  metadata: mockMetaSchema,
});

export type ResearchStep = z.infer<typeof researchStepSchema>;
export type ResearchPlan = z.infer<typeof researchPlanSchema>;
export type ToolCallTrace = z.infer<typeof toolCallTraceSchema>;
export type ExecutionTrace = z.infer<typeof executionTraceSchema>;
export type ReflectionResult = z.infer<typeof reflectionResultSchema>;
export type ResearchPipelineResult = z.infer<typeof researchPipelineResultSchema>;
