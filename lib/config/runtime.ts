import { getEnvConfig } from "@/lib/config/env";
import { checkBackendHealth } from "@/lib/api/client";
import {
  workspaceRuntimeConfigSchema,
  runtimeSettingsSchema,
  workspaceRuntimeStatusSchema,
  backendConnectionStateSchema,
  type WorkspaceRuntimeConfig,
  type WorkspaceRuntimeStatus,
  type RuntimeSettings,
  type BackendConnectionState,
} from "@/lib/schemas/workspace";
import {
  readRuntimeSettingsFromLocalStorage,
  writeRuntimeSettingsToLocalStorage,
  clearRuntimeSettingsFromLocalStorage,
} from "@/lib/sessions/local-storage";

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

export function getDefaultRuntimeSettings(): RuntimeSettings {
  const config = getDefaultRuntimeConfig();
  return runtimeSettingsSchema.parse({
    mode: config.mode,
    apiBaseUrl: config.apiBaseUrl,
    selectedProvider: config.selectedProvider,
    selectedModel: config.selectedModel,
    fallbackToMock: config.fallbackToMock,
    showToolCalls: config.streamToolCalls,
    showTokenUsage: config.showTokenUsage,
    maxToolSteps: config.maxToolSteps,
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

export function normalizeRuntimeSettings(input?: Partial<RuntimeSettings>): RuntimeSettings {
  const merged = {
    ...getDefaultRuntimeSettings(),
    ...(input ?? {}),
  };

  return runtimeSettingsSchema.parse({
    ...merged,
    maxToolSteps: Math.min(8, Math.max(1, merged.maxToolSteps ?? 3)),
  });
}

export function restoreRuntimeSettings(): RuntimeSettings {
  const raw = readRuntimeSettingsFromLocalStorage();
  return normalizeRuntimeSettings(raw ?? undefined);
}

export function persistRuntimeSettings(next: Partial<RuntimeSettings>): RuntimeSettings {
  const normalized = normalizeRuntimeSettings({
    ...restoreRuntimeSettings(),
    ...next,
  });
  writeRuntimeSettingsToLocalStorage(normalized);
  return normalized;
}

export function resetRuntimeSettings(): RuntimeSettings {
  clearRuntimeSettingsFromLocalStorage();
  const defaults = getDefaultRuntimeSettings();
  writeRuntimeSettingsToLocalStorage(defaults);
  return defaults;
}

export async function buildBackendConnectionState(
  settings: RuntimeSettings,
  fallbackReason?: string,
): Promise<BackendConnectionState> {
  const health = await checkBackendHealth({
    runtimeOverrides: {
      mode: settings.mode,
      apiBaseUrl: settings.apiBaseUrl,
      fallbackToMock: settings.fallbackToMock,
    },
  });

  return backendConnectionStateSchema.parse({
    mode: settings.mode,
    apiBaseUrl: settings.apiBaseUrl,
    reachable: health.reachable,
    checkedAt: health.checkedAt,
    appTitle: health.appTitle,
    error: health.error,
    fallbackActive: settings.mode === "api" ? !health.reachable && settings.fallbackToMock : false,
    fallbackReason: fallbackReason ?? health.error,
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
