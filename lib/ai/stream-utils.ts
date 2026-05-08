export type WorkspaceStreamEvent = {
  type:
    | "message_delta"
    | "tool_call_start"
    | "tool_call_delta"
    | "tool_call_result"
    | "trace_update"
    | "token_usage"
    | "final"
    | "error";
  id: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

export function createTokenUsageSummary(input: {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}) {
  return {
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    totalTokens: input.inputTokens + input.outputTokens,
    latencyMs: input.latencyMs,
  };
}

export function toJsonlStream(events: WorkspaceStreamEvent[]) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      }
      controller.close();
    },
  });
}

export function toSseChunks(events: WorkspaceStreamEvent[]) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      controller.close();
    },
  });
}

export function parseJsonlBuffer(input: { buffer: string; chunk: string }) {
  const combined = input.buffer + input.chunk;
  const lines = combined.split("\n");
  const rest = lines.pop() ?? "";
  const events: WorkspaceStreamEvent[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      events.push(JSON.parse(trimmed) as WorkspaceStreamEvent);
    } catch {
      continue;
    }
  }

  return { events, rest };
}
