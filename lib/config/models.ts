import { getEnvConfig } from "@/lib/config/env";
import type { ModelProvider } from "@/lib/schemas/workspace";

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
  const groqAvailable = env.enableRealModels && env.enableGroq && Boolean(env.groqApiKey);
  const deepseekAvailable = env.enableRealModels && env.enableDeepseek && Boolean(env.deepseekApiKey);
  const ollamaAvailable = env.enableRealModels && env.enableOllama && Boolean(env.ollamaBaseUrl);

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
      reasonUnavailable: openaiAvailable ? undefined : "OpenAI key missing or real models disabled",
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "claude-3-5-sonnet",
      label: "Anthropic Placeholder",
      provider: "anthropic",
      available: anthropicAvailable,
      reasonUnavailable: anthropicAvailable ? undefined : "Anthropic key missing or real models disabled",
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "local-placeholder",
      label: "Local Model Placeholder",
      provider: "local",
      available: localAvailable,
      reasonUnavailable: localAvailable ? undefined : "Local model base URL missing or real models disabled",
      supportsTools: false,
      supportsStreaming: false,
    },
    {
      id: "groq-llama-3.1-70b",
      label: "Groq Placeholder",
      provider: "groq",
      available: groqAvailable,
      reasonUnavailable: groqAvailable ? undefined : "Groq disabled or GROQ_API_KEY missing",
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "deepseek-chat",
      label: "DeepSeek Placeholder",
      provider: "deepseek",
      available: deepseekAvailable,
      reasonUnavailable: deepseekAvailable ? undefined : "DeepSeek disabled or DEEPSEEK_API_KEY missing",
      supportsTools: true,
      supportsStreaming: true,
    },
    {
      id: "ollama-placeholder",
      label: "Ollama Placeholder",
      provider: "ollama",
      available: ollamaAvailable,
      reasonUnavailable: ollamaAvailable ? undefined : "Ollama disabled or OLLAMA_BASE_URL missing",
      supportsTools: true,
      supportsStreaming: false,
    },
  ];
}

export function resolveModelProvider(modelId: string): ModelProvider {
  const found = getModelOptions().find((option) => option.id === modelId);
  return found?.provider ?? "mock";
}

export function getModelAvailability(modelId: string): {
  available: boolean;
  reasonUnavailable?: string;
} {
  const found = getModelOptions().find((option) => option.id === modelId);
  if (!found) {
    return { available: false, reasonUnavailable: "Unknown model" };
  }
  return { available: found.available, reasonUnavailable: found.reasonUnavailable };
}

export function getProviderUnavailableReason(provider: ModelProvider): string | undefined {
  if (provider === "mock") {
    return undefined;
  }

  const option = getModelOptions().find((item) => item.provider === provider);
  if (!option) {
    return "Unknown provider";
  }

  return option.available ? undefined : option.reasonUnavailable;
}
