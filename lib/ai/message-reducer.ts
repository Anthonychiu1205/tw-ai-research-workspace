import type { WorkspaceStreamEvent } from "@/lib/ai/stream-utils";
import type { WorkspaceChatMessage, WorkspaceChatState, WorkspaceToolCallState } from "@/lib/ai/message-types";

function nowIso() {
  return new Date().toISOString();
}

export type ChatAction =
  | { type: "set_input"; input: string }
  | { type: "send_start"; userMessage: WorkspaceChatMessage; assistantMessage: WorkspaceChatMessage }
  | { type: "inject_system"; message: WorkspaceChatMessage }
  | { type: "stream_event"; event: WorkspaceStreamEvent }
  | { type: "stream_error"; error: string }
  | { type: "stream_complete" }
  | { type: "clear" };

export const initialChatState: WorkspaceChatState = {
  messages: [],
  input: "",
  isStreaming: false,
  activeToolCalls: [],
  tokenUsage: null,
  lastError: null,
  lastUserMessage: null,
  activeAssistantId: null,
};

function updateAssistantMessage(state: WorkspaceChatState, updater: (message: WorkspaceChatMessage) => WorkspaceChatMessage) {
  if (!state.activeAssistantId) {
    return state.messages;
  }

  return state.messages.map((message) =>
    message.id === state.activeAssistantId ? updater(message) : message,
  );
}

function upsertToolCall(calls: WorkspaceToolCallState[], next: WorkspaceToolCallState) {
  const index = calls.findIndex((item) => item.id === next.id);
  if (index < 0) {
    return [...calls, next];
  }

  const clone = [...calls];
  clone[index] = {
    ...clone[index],
    ...next,
  };
  return clone;
}

export function chatReducer(state: WorkspaceChatState, action: ChatAction): WorkspaceChatState {
  if (action.type === "set_input") {
    return { ...state, input: action.input };
  }

  if (action.type === "send_start") {
    return {
      ...state,
      input: "",
      isStreaming: true,
      lastError: null,
      lastUserMessage: action.userMessage.content,
      activeAssistantId: action.assistantMessage.id,
      messages: [...state.messages, action.userMessage, action.assistantMessage],
      activeToolCalls: [],
    };
  }

  if (action.type === "inject_system") {
    return {
      ...state,
      messages: [...state.messages, action.message],
    };
  }

  if (action.type === "stream_event") {
    const event = action.event;

    if (event.type === "message_delta") {
      return {
        ...state,
        messages: updateAssistantMessage(state, (message) => ({
          ...message,
          content: `${message.content}${String(event.payload.content ?? "")}`,
          status: "streaming",
        })),
      };
    }

    if (event.type === "tool_call_start") {
      const toolId = String(event.id);
      return {
        ...state,
        activeToolCalls: upsertToolCall(state.activeToolCalls, {
          id: toolId,
          toolName: String(event.payload.toolName ?? "tool"),
          status: "pending",
          args: (event.payload.args as Record<string, unknown> | undefined) ?? {},
          evidenceIds: [],
          startedAt: nowIso(),
        }),
      };
    }

    if (event.type === "tool_call_delta") {
      const toolId = String(event.id).replace("-delta", "-start");
      return {
        ...state,
        activeToolCalls: state.activeToolCalls.map((call) =>
          call.id === toolId
            ? {
                ...call,
                status: "running",
              }
            : call,
        ),
      };
    }

    if (event.type === "tool_call_result") {
      const toolId = String(event.id).replace("-result", "-start");
      const status = String(event.payload.status ?? "failed");
      const normalizedStatus: WorkspaceToolCallState["status"] =
        status === "succeeded" ? "succeeded" : status === "failed" ? "failed" : "running";

      const nextCalls = state.activeToolCalls.map((call) =>
        call.id === toolId
          ? {
              ...call,
              status: normalizedStatus,
              resultSummary: String(event.payload.summary ?? ""),
              evidenceIds: Array.isArray(event.payload.evidenceIds)
                ? (event.payload.evidenceIds as string[])
                : [],
              completedAt: nowIso(),
              latencyMs:
                typeof event.payload.latencyMs === "number" ? Number(event.payload.latencyMs) : call.latencyMs,
              fallbackUsed: Boolean(event.payload.fallbackUsed),
              artifactId:
                typeof event.payload.artifactId === "string" ? String(event.payload.artifactId) : undefined,
            }
          : call,
      );

      return {
        ...state,
        activeToolCalls: nextCalls,
        messages: updateAssistantMessage(state, (message) => ({
          ...message,
          toolCalls: nextCalls,
          metadata: {
            ...message.metadata,
            fallbackUsed: nextCalls.some((item) => item.fallbackUsed),
            artifactsCreated: nextCalls.map((item) => item.artifactId).filter(Boolean) as string[],
          },
        })),
      };
    }

    if (event.type === "token_usage") {
      return {
        ...state,
        tokenUsage: event.payload,
        messages: updateAssistantMessage(state, (message) => ({
          ...message,
          metadata: {
            ...message.metadata,
            tokenUsage: event.payload,
          },
        })),
      };
    }

    if (event.type === "final") {
      const disclaimer = String(event.payload.disclaimer ?? "Synthetic workspace output, not financial advice.");
      return {
        ...state,
        isStreaming: false,
        messages: updateAssistantMessage(state, (message) => ({
          ...message,
          status: "complete",
          content: message.content.includes("not financial advice") ? message.content : `${message.content}\n\n${disclaimer}`,
        })),
      };
    }

    if (event.type === "error") {
      const error = String(event.payload.message ?? "stream error");
      return {
        ...state,
        isStreaming: false,
        lastError: error,
        messages: updateAssistantMessage(state, (message) => ({
          ...message,
          status: "error",
          content: `${message.content}\n\nError: ${error}`,
        })),
      };
    }

    return state;
  }

  if (action.type === "stream_error") {
    return {
      ...state,
      isStreaming: false,
      lastError: action.error,
      messages: updateAssistantMessage(state, (message) => ({
        ...message,
        status: "error",
        content: `${message.content}\n\nError: ${action.error}`,
      })),
    };
  }

  if (action.type === "stream_complete") {
    return {
      ...state,
      isStreaming: false,
      activeAssistantId: null,
    };
  }

  return initialChatState;
}
