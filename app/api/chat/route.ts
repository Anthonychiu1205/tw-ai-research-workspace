import { runAssistantRuntime } from "@/lib/ai/runtime";
import { toSseChunks } from "@/lib/ai/stream-utils";
import { getEnvConfig } from "@/lib/config/env";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const env = getEnvConfig();

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const provider = body.provider ?? "mock";
  const modelId = body.modelId ?? env.defaultModel;

  // Env-gated real provider attempt. Any failure falls back to deterministic mock streaming.
  if (
    env.workspaceMode !== "mock" &&
    env.enableRealModels &&
    ((provider === "openai" && env.openaiApiKey) || (provider === "anthropic" && env.anthropicApiKey))
  ) {
    try {
      const ai = (await import("ai")) as any;
      const { createOpenAI } = await import("@ai-sdk/openai");
      const { createAnthropic } = await import("@ai-sdk/anthropic");

      const model =
        provider === "openai"
          ? createOpenAI({ apiKey: env.openaiApiKey })(modelId || "gpt-4.1-mini")
          : createAnthropic({ apiKey: env.anthropicApiKey })(modelId || "claude-3-5-sonnet");

      const result = await ai.streamText({
        model,
        system: SYSTEM_PROMPT,
        messages: messages.map((msg: any) => ({ role: msg.role, content: msg.content })),
      });

      if (typeof result?.toDataStreamResponse === "function") {
        return result.toDataStreamResponse();
      }
    } catch {
      // Fall through to mock runtime.
    }
  }

  const runtime = await runAssistantRuntime({ messages, provider, modelId });

  const chunks = [...runtime.chunks];
  if (runtime.warning) {
    chunks.unshift(`Warning: ${runtime.warning}. `);
  }

  const stream = toSseChunks(chunks);

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
