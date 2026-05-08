import { z } from "zod";

export const workspaceRuntimeModeSchema = z.enum(["mock", "api"]);
export const modelProviderSchema = z.enum(["mock", "openai", "anthropic", "local"]);

export const workspaceRuntimeConfigSchema = z.object({
  mode: workspaceRuntimeModeSchema.default("mock"),
  apiBaseUrl: z.string().default("http://localhost:8000"),
  selectedProvider: modelProviderSchema.default("mock"),
  selectedModel: z.string().default("mock-research"),
  fallbackToMock: z.boolean().default(true),
  streamToolCalls: z.boolean().default(true),
  showTokenUsage: z.boolean().default(true),
  maxToolSteps: z.number().int().min(1).max(8).default(3),
});

export const runtimeSettingsSchema = z.object({
  mode: workspaceRuntimeModeSchema.default("mock"),
  apiBaseUrl: z.string().default("http://localhost:8000"),
  selectedProvider: modelProviderSchema.default("mock"),
  selectedModel: z.string().default("mock-research"),
  fallbackToMock: z.boolean().default(true),
  showToolCalls: z.boolean().default(true),
  showTokenUsage: z.boolean().default(true),
  maxToolSteps: z.number().int().min(1).max(8).default(3),
});

export const workspaceRuntimeStatusSchema = z.object({
  mode: workspaceRuntimeModeSchema,
  backendReachable: z.boolean(),
  providerAvailable: z.boolean(),
  providerUnavailableReason: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  fallbackActive: z.boolean(),
});

export const backendConnectionStateSchema = z.object({
  mode: workspaceRuntimeModeSchema,
  apiBaseUrl: z.string(),
  reachable: z.boolean(),
  checkedAt: z.string().optional(),
  appTitle: z.string().optional(),
  error: z.string().optional(),
  fallbackActive: z.boolean(),
  fallbackReason: z.string().optional(),
});

export const workspaceContextStateSchema = z.object({
  selectedTicker: z.string().default("2330"),
  watchlist: z.array(z.string()).default(["2330", "2317", "2454", "2308", "0050"]),
  activeSessionId: z.string().nullable().default(null),
  activeArtifactId: z.string().nullable().default(null),
  activeReportId: z.string().nullable().default(null),
  activePipelineId: z.string().nullable().default(null),
  activeTraceId: z.string().nullable().default(null),
  activeStrategyComparisonId: z.string().nullable().default(null),
});

export const workspaceMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "tool", "system"]),
  content: z.string(),
  createdAt: z.string(),
});

export const workspaceArtifactSchema = z.object({
  id: z.string(),
  kind: z
    .enum([
      "research_card",
      "report",
      "pipeline_trace",
      "strategy_comparison",
      "signal_evaluation",
      "evidence_timeline",
      "backtest_summary",
    ])
    .optional(),
  type: z
    .enum([
      "research_card",
      "report",
      "pipeline_trace",
      "strategy_comparison",
      "signal_evaluation",
      "evidence_timeline",
      "backtest_summary",
    ])
    .optional(),
  title: z.string(),
  summary: z.string().optional(),
  sessionId: z.string().optional(),
  ticker: z.string().optional(),
  tickers: z.array(z.string()).optional(),
  asOfDate: z.string().optional(),
  source: z.enum(["mock", "api", "mock_fallback"]).default("mock"),
  synthetic: z.boolean().default(true),
  notFinancialAdvice: z.literal(true).default(true),
  noTradingExecution: z.literal(true).default(true),
  evidenceIds: z.array(z.string()).default([]),
  relatedArtifactIds: z.array(z.string()).default([]),
  lineage: z
    .object({
      operationId: z.string().optional(),
      toolCallId: z.string().optional(),
      sourceArtifactIds: z.array(z.string()).optional(),
    })
    .optional(),
  data: z.unknown().optional(),
  pinned: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const workspaceSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  schemaVersion: z.literal("workspace-session.v0.2").default("workspace-session.v0.2"),
  runtimeMode: workspaceRuntimeModeSchema,
  modelId: z.string(),
  provider: modelProviderSchema,
  messages: z.array(workspaceMessageSchema),
  artifacts: z.array(workspaceArtifactSchema),
  updatedAt: z.string(),
});

export type WorkspaceRuntimeMode = z.infer<typeof workspaceRuntimeModeSchema>;
export type ModelProvider = z.infer<typeof modelProviderSchema>;
export type WorkspaceRuntimeConfig = z.infer<typeof workspaceRuntimeConfigSchema>;
export type RuntimeSettings = z.infer<typeof runtimeSettingsSchema>;
export type WorkspaceRuntimeStatus = z.infer<typeof workspaceRuntimeStatusSchema>;
export type BackendConnectionState = z.infer<typeof backendConnectionStateSchema>;
export type WorkspaceContextState = z.infer<typeof workspaceContextStateSchema>;
export type WorkspaceMessage = z.infer<typeof workspaceMessageSchema>;
export type WorkspaceArtifact = z.infer<typeof workspaceArtifactSchema>;
export type WorkspaceSession = z.infer<typeof workspaceSessionSchema>;
