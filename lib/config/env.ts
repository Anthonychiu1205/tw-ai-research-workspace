export type WorkspaceMode = "mock" | "api";
export type ApiBridgeMode = "proxy" | "direct" | "mock";
export type ProviderName = "mock" | "openai" | "anthropic" | "local" | "groq" | "deepseek" | "ollama";

export type EnvConfig = {
  workspaceMode: WorkspaceMode;
  apiBaseUrl: string;
  apiBridgeMode: ApiBridgeMode;
  aiProvider: ProviderName;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  groqApiKey?: string;
  deepseekApiKey?: string;
  ollamaBaseUrl?: string;
  localModelBaseUrl?: string;
  defaultModel: string;
  enableRealModels: boolean;
  enableGroq: boolean;
  enableDeepseek: boolean;
  enableOllama: boolean;
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
  const aiProvider = (readEnv("AI_PROVIDER") ?? "mock") as ProviderName;
  const resolvedWorkspaceMode = workspaceMode === "api" ? "api" : "mock";

  return {
    workspaceMode: resolvedWorkspaceMode,
    apiBaseUrl: readEnv("TW_AI_RESEARCH_API_BASE_URL") ?? "http://localhost:8000",
    apiBridgeMode: resolveApiBridgeMode(resolvedWorkspaceMode),
    aiProvider: ["mock", "openai", "anthropic", "local", "groq", "deepseek", "ollama"].includes(aiProvider)
      ? aiProvider
      : "mock",
    openaiApiKey: readEnv("OPENAI_API_KEY"),
    anthropicApiKey: readEnv("ANTHROPIC_API_KEY"),
    groqApiKey: readEnv("GROQ_API_KEY"),
    deepseekApiKey: readEnv("DEEPSEEK_API_KEY"),
    ollamaBaseUrl: readEnv("OLLAMA_BASE_URL"),
    localModelBaseUrl: readEnv("LOCAL_MODEL_BASE_URL"),
    defaultModel: readEnv("NEXT_PUBLIC_DEFAULT_MODEL") ?? "mock-research",
    enableRealModels: (readEnv("NEXT_PUBLIC_ENABLE_REAL_MODELS") ?? "false") === "true",
    enableGroq: (readEnv("NEXT_PUBLIC_ENABLE_GROQ") ?? "false") === "true",
    enableDeepseek: (readEnv("NEXT_PUBLIC_ENABLE_DEEPSEEK") ?? "false") === "true",
    enableOllama: (readEnv("NEXT_PUBLIC_ENABLE_OLLAMA") ?? "false") === "true",
  };
}
