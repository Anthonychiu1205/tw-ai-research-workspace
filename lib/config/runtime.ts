import { getEnvConfig } from "@/lib/config/env";

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
