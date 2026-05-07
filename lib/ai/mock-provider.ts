import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export type MockMessage = { role: string; content: string };

export function buildMockResponse(messages: MockMessage[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  return [
    "Synthetic research workspace response: ",
    `received prompt \"${lastUser.slice(0, 80)}\". `,
    "Generated plan: collect signals, compare strategy profiles, summarize risk notes. ",
    "No trading execution performed. ",
    "Disclaimer: Synthetic workspace output, not financial advice.",
    `\n\n[system-context]: ${SYSTEM_PROMPT.slice(0, 80)}...`,
  ];
}

export function mockTokenUsage() {
  return {
    inputTokens: 256,
    outputTokens: 182,
    latencyMs: 420,
  };
}
