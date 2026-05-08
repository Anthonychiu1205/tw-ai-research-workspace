import { getSystemPrompt } from "@/lib/ai/prompts";
import type { WorkspaceStreamEvent } from "@/lib/ai/stream-utils";
import type { Locale } from "@/lib/i18n/types";

export type MockMessage = { role: string; content: string };

export function buildMockResponse(messages: MockMessage[], locale: Locale = "zh-TW") {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const systemPrompt = getSystemPrompt(locale);
  if (locale === "zh-TW") {
    return [
      "Synthetic 研究工作區回覆。 ",
      `收到提問：「${lastUser.slice(0, 80)}」。 `,
      "已產生流程：蒐集訊號、比較策略輪廓、整理風險重點。 ",
      "未進行任何交易執行。 ",
      "聲明：本工作區輸出為 synthetic 資料，非投資建議。",
      `\n\n[system-context]: ${systemPrompt.slice(0, 80)}...`,
    ];
  }
  return [
    "Synthetic research workspace response. ",
    `Received prompt \"${lastUser.slice(0, 80)}\". `,
    "Generated plan: collect signals, compare strategy profiles, summarize risk notes. ",
    "No trading execution performed. ",
    "Disclaimer: Synthetic workspace output, not financial advice.",
    `\n\n[system-context]: ${systemPrompt.slice(0, 80)}...`,
  ];
}

export function createMockResearchStream(input: {
  messageId: string;
  messages: MockMessage[];
  locale?: Locale;
}): WorkspaceStreamEvent[] {
  const now = new Date().toISOString();
  return buildMockResponse(input.messages, input.locale ?? "zh-TW").map((chunk, index) => ({
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
