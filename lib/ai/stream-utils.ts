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

export function toSseChunks(events: WorkspaceStreamEvent[]) {
  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
      }
      controller.close();
    },
  });
}
