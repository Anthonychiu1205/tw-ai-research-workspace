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
