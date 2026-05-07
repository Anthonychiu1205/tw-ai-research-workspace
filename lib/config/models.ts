import { getEnvConfig } from "@/lib/config/env";

export type ModelProvider = "mock" | "openai" | "anthropic" | "local";

export type ModelOption = {
  id: string;
  label: string;
  provider: ModelProvider;
  available: boolean;
  reasonUnavailable?: string;
  supportsTools: boolean;
  supportsStreaming: boolean;
};

export function getModelOptions(): ModelOption[] {
  const env = getEnvConfig();

  const openaiAvailable = env.enableRealModels && Boolean(env.openaiApiKey);
  const anthropicAvailable = env.enableRealModels && Boolean(env.anthropicApiKey);
  const localAvailable = env.enableRealModels && Boolean(env.localModelBaseUrl);

  return [
    {
      id: "mock-research",
      label: "Mock Research Model",
      provider: "mock",
      available: true,
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "gpt-4.1-mini",
      label: "OpenAI Placeholder",
      provider: "openai",
      available: openaiAvailable,
      reasonUnavailable: openaiAvailable ? undefined : "OpenAI key or real models disabled",
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "claude-3-5-sonnet",
      label: "Anthropic Placeholder",
      provider: "anthropic",
      available: anthropicAvailable,
      reasonUnavailable: anthropicAvailable ? undefined : "Anthropic key or real models disabled",
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "local-placeholder",
      label: "Local Model Placeholder",
      provider: "local",
      available: localAvailable,
      reasonUnavailable: localAvailable ? undefined : "Local model base URL missing",
      supportsTools: false,
      supportsStreaming: false,
    },
  ];
}
