import { z } from "zod";

export const toolStatusSchema = z.enum(["pending", "running", "succeeded", "failed"]);

export const workspaceToolCallSchema = z.object({
  toolName: z.string(),
  input: z.record(z.any()),
});

export const workspaceToolResultSchema = z.object({
  toolName: z.string(),
  status: toolStatusSchema,
  startedAt: z.string(),
  completedAt: z.string(),
  latencyMs: z.number(),
  summary: z.string(),
  data: z.any(),
  evidenceIds: z.array(z.string()),
  warnings: z.array(z.string()),
  source: z.enum(["mock", "api", "mock_fallback"]),
  fallbackUsed: z.boolean(),
});

export type ToolStatus = z.infer<typeof toolStatusSchema>;
export type WorkspaceToolCall = z.infer<typeof workspaceToolCallSchema>;
export type WorkspaceToolResult = z.infer<typeof workspaceToolResultSchema>;
