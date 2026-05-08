import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import type { WorkspaceStreamEvent } from "@/lib/ai/stream-utils";

export type MockMessage = { role: string; content: string };

export function buildMockResponse(messages: MockMessage[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  return [
    "Synthetic research workspace response. ",
    `Received prompt \"${lastUser.slice(0, 80)}\". `,
    "Generated plan: collect signals, compare strategy profiles, summarize risk notes. ",
    "No trading execution performed. ",
    "Disclaimer: Synthetic workspace output, not financial advice.",
    `\n\n[system-context]: ${SYSTEM_PROMPT.slice(0, 80)}...`,
  ];
}

export function createMockResearchStream(input: {
  messageId: string;
  messages: MockMessage[];
}): WorkspaceStreamEvent[] {
  const now = new Date().toISOString();
  return buildMockResponse(input.messages).map((chunk, index) => ({
    type: "message_delta",
    id: `${input.messageId}-delta-${index}`,
    timestamp: now,
    payload: { content: chunk },
  }));
}

export function mockTokenUsage() {
  return {
    inputTokens: 256,
    outputTokens: 182,
    latencyMs: 420,
  };
}
