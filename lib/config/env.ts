export type WorkspaceMode = "mock" | "api";
export type ApiBridgeMode = "proxy" | "direct" | "mock";

export type EnvConfig = {
  workspaceMode: WorkspaceMode;
  apiBaseUrl: string;
  apiBridgeMode: ApiBridgeMode;
  aiProvider: "mock" | "openai" | "anthropic" | "local";
  openaiApiKey?: string;
  anthropicApiKey?: string;
  localModelBaseUrl?: string;
  defaultModel: string;
  enableRealModels: boolean;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    return undefined;
  }
  return value;
}

function resolveApiBridgeMode(workspaceMode: WorkspaceMode): ApiBridgeMode {
  const raw = readEnv("NEXT_PUBLIC_API_BRIDGE_MODE");
  if (raw === "proxy" || raw === "direct" || raw === "mock") {
    return raw;
  }
  return workspaceMode === "api" ? "proxy" : "mock";
}

export function getEnvConfig(): EnvConfig {
  const workspaceMode = (readEnv("NEXT_PUBLIC_WORKSPACE_MODE") ?? "mock") as WorkspaceMode;
  const aiProvider = (readEnv("AI_PROVIDER") ?? "mock") as EnvConfig["aiProvider"];
  const resolvedWorkspaceMode = workspaceMode === "api" ? "api" : "mock";

  return {
    workspaceMode: resolvedWorkspaceMode,
    apiBaseUrl: readEnv("TW_AI_RESEARCH_API_BASE_URL") ?? "http://localhost:8000",
    apiBridgeMode: resolveApiBridgeMode(resolvedWorkspaceMode),
    aiProvider: ["mock", "openai", "anthropic", "local"].includes(aiProvider)
      ? aiProvider
      : "mock",
    openaiApiKey: readEnv("OPENAI_API_KEY"),
    anthropicApiKey: readEnv("ANTHROPIC_API_KEY"),
    localModelBaseUrl: readEnv("LOCAL_MODEL_BASE_URL"),
    defaultModel: readEnv("NEXT_PUBLIC_DEFAULT_MODEL") ?? "mock-research",
    enableRealModels: (readEnv("NEXT_PUBLIC_ENABLE_REAL_MODELS") ?? "false") === "true",
  };
}
