import { z } from "zod";

export const workspaceRuntimeModeSchema = z.enum(["mock", "api"]);
export const modelProviderSchema = z.enum(["mock", "openai", "anthropic", "local"]);

export const workspaceMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "tool", "system"]),
  content: z.string(),
  createdAt: z.string(),
});

export const workspaceArtifactSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "research_card",
    "report",
    "pipeline_trace",
    "strategy_comparison",
    "signal_evaluation",
    "evidence_timeline",
  ]),
  title: z.string(),
  createdAt: z.string(),
});

export const workspaceSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  runtimeMode: workspaceRuntimeModeSchema,
  modelId: z.string(),
  provider: modelProviderSchema,
  messages: z.array(workspaceMessageSchema),
  artifacts: z.array(workspaceArtifactSchema),
  updatedAt: z.string(),
});

export type WorkspaceRuntimeMode = z.infer<typeof workspaceRuntimeModeSchema>;
export type ModelProvider = z.infer<typeof modelProviderSchema>;
export type WorkspaceMessage = z.infer<typeof workspaceMessageSchema>;
export type WorkspaceArtifact = z.infer<typeof workspaceArtifactSchema>;
export type WorkspaceSession = z.infer<typeof workspaceSessionSchema>;
