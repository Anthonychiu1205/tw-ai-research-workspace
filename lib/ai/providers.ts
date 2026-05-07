import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { getEnvConfig } from "@/lib/config/env";

export type ProviderReady = {
  name: "mock" | "openai" | "anthropic" | "local";
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
  ];
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
