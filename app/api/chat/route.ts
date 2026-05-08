import { runAssistantRuntime } from "@/lib/ai/runtime";
import { toSseChunks } from "@/lib/ai/stream-utils";
import { getEnvConfig } from "@/lib/config/env";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const env = getEnvConfig();

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const provider = body.provider ?? "mock";
  const modelId = body.modelId ?? env.defaultModel;

  const runtime = await runAssistantRuntime({
    messages,
    provider,
    modelId,
    runtimeConfig: {
      mode: body.runtimeMode ?? env.workspaceMode,
      apiBaseUrl: body.apiBaseUrl ?? env.apiBaseUrl,
      maxToolSteps: body.maxToolSteps ?? 3,
      fallbackToMock: body.fallbackToMock ?? true,
      streamToolCalls: body.streamToolCalls ?? true,
      selectedProvider: provider,
      selectedModel: modelId,
    },
  });

  const stream = toSseChunks(runtime.events);

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
