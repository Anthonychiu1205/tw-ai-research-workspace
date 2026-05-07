import { getEnvConfig } from "@/lib/config/env";
import { getProviderAvailability } from "@/lib/ai/providers";
import { buildMockResponse, mockTokenUsage, type MockMessage } from "@/lib/ai/mock-provider";

export async function runAssistantRuntime(input: {
  messages: MockMessage[];
  modelId: string;
  provider: "mock" | "openai" | "anthropic" | "local";
}) {
  const env = getEnvConfig();
  const availability = getProviderAvailability();
  const selected = availability.find((item) => item.name === input.provider);

  if (env.workspaceMode === "mock" || !selected?.available) {
    return {
      mode: "mock" as const,
      chunks: buildMockResponse(input.messages),
      usage: mockTokenUsage(),
      warning: selected?.available ? undefined : `Provider ${input.provider} unavailable, fallback to mock`,
    };
  }

  return {
    mode: "mock" as const,
    chunks: buildMockResponse(input.messages),
    usage: mockTokenUsage(),
    warning: "Real provider path is env-gated; using mock fallback",
  };
}
