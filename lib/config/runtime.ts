import { getEnvConfig } from "@/lib/config/env";
import {
  workspaceRuntimeConfigSchema,
  workspaceRuntimeStatusSchema,
  type WorkspaceRuntimeConfig,
  type WorkspaceRuntimeStatus,
} from "@/lib/schemas/workspace";

export function getDefaultRuntimeConfig(): WorkspaceRuntimeConfig {
  const env = getEnvConfig();
  return workspaceRuntimeConfigSchema.parse({
    mode: env.workspaceMode,
    apiBaseUrl: env.apiBaseUrl,
    selectedProvider: env.aiProvider,
    selectedModel: env.defaultModel,
    fallbackToMock: true,
    streamToolCalls: true,
    showTokenUsage: true,
    maxToolSteps: 3,
  });
}

export function normalizeRuntimeConfig(input?: Partial<WorkspaceRuntimeConfig>): WorkspaceRuntimeConfig {
  const merged = {
    ...getDefaultRuntimeConfig(),
    ...(input ?? {}),
  };
  return workspaceRuntimeConfigSchema.parse({
    ...merged,
    maxToolSteps: Math.min(8, Math.max(1, merged.maxToolSteps ?? 3)),
  });
}

export function buildRuntimeStatus(input: {
  mode: WorkspaceRuntimeConfig["mode"];
  backendReachable: boolean;
  providerAvailable: boolean;
  providerUnavailableReason?: string;
  fallbackActive: boolean;
}): WorkspaceRuntimeStatus {
  return workspaceRuntimeStatusSchema.parse({
    ...input,
    lastCheckedAt: new Date().toISOString(),
  });
}

export function isMockMode() {
  return getEnvConfig().workspaceMode === "mock";
}

export function runtimeSummary() {
  const env = getEnvConfig();
  return {
    mode: env.workspaceMode,
    provider: env.aiProvider,
    fallback: true,
    noApiKeyRequired: true,
  };
}
