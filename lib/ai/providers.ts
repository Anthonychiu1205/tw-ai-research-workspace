import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getEnvConfig } from "@/lib/config/env";

export type ProviderReady = {
  name: "mock" | "openai" | "anthropic" | "local" | "groq" | "deepseek" | "ollama";
  available: boolean;
  reason?: string;
};

export function getProviderAvailability(): ProviderReady[] {
  const env = getEnvConfig();
  return [
    { name: "mock", available: true },
    {
      name: "openai",
      available: env.enableRealModels && Boolean(env.openaiApiKey),
      reason: env.enableRealModels && env.openaiApiKey ? undefined : "env-gated",
    },
    {
      name: "anthropic",
      available: env.enableRealModels && Boolean(env.anthropicApiKey),
      reason: env.enableRealModels && env.anthropicApiKey ? undefined : "env-gated",
    },
    {
      name: "local",
      available: env.enableRealModels && Boolean(env.localModelBaseUrl),
      reason: env.enableRealModels && env.localModelBaseUrl ? undefined : "env-gated",
    },
    {
      name: "groq",
      available: env.enableRealModels && env.enableGroq && Boolean(env.groqApiKey),
      reason: env.enableRealModels && env.enableGroq && env.groqApiKey ? undefined : "env-gated",
    },
    {
      name: "deepseek",
      available: env.enableRealModels && env.enableDeepseek && Boolean(env.deepseekApiKey),
      reason: env.enableRealModels && env.enableDeepseek && env.deepseekApiKey ? undefined : "env-gated",
    },
    {
      name: "ollama",
      available: env.enableRealModels && env.enableOllama && Boolean(env.ollamaBaseUrl),
      reason: env.enableRealModels && env.enableOllama && env.ollamaBaseUrl ? undefined : "env-gated",
    },
  ];
}

export function getProviderAvailabilityByName(name: ProviderReady["name"]) {
  return getProviderAvailability().find((provider) => provider.name === name) ?? { name, available: false, reason: "unknown" };
}

export function getOpenAIClient() {
  const env = getEnvConfig();
  if (!env.openaiApiKey) {
    return null;
  }
  return createOpenAI({ apiKey: env.openaiApiKey });
}

export function getAnthropicClient() {
  const env = getEnvConfig();
  if (!env.anthropicApiKey) {
    return null;
  }
  return createAnthropic({ apiKey: env.anthropicApiKey });
}
