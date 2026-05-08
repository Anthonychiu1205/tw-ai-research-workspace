"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { createId } from "@/lib/utils/ids";
import { chatReducer, initialChatState } from "@/lib/ai/message-reducer";
import type { WorkspaceChatMessage } from "@/lib/ai/message-types";
import type { RuntimeSettings } from "@/lib/schemas/workspace";
import type { WorkspaceStreamEvent } from "@/lib/ai/stream-utils";
import type { Locale } from "@/lib/i18n/types";

type UseResearchChatOptions = {
  runtimeSettings: RuntimeSettings;
  modelId: string;
  provider: "mock" | "openai" | "anthropic" | "local";
  locale?: Locale;
  initialMessages?: WorkspaceChatMessage[];
  onToolResult?: (payload: Record<string, unknown>) => void;
  onMessagesChange?: (messages: WorkspaceChatMessage[]) => void;
};

function nowIso() {
  return new Date().toISOString();
}

function parseStreamChunk(buffer: string, chunk: string) {
  const combined = buffer + chunk;
  const lines = combined.split("\n");
  const rest = lines.pop() ?? "";
  const events: WorkspaceStreamEvent[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const normalized = line.startsWith("data: ") ? line.slice(6).trim() : line;
    if (!normalized) continue;

    try {
      events.push(JSON.parse(normalized) as WorkspaceStreamEvent);
    } catch {
      continue;
    }
  }

  return { events, rest };
}

export function useResearchChat(options: UseResearchChatOptions) {
  const onMessagesChange = options.onMessagesChange;
  const seededState = useMemo(() => {
    if (options.initialMessages && options.initialMessages.length > 0) {
      return {
        ...initialChatState,
        messages: options.initialMessages,
      };
    }
    return initialChatState;
  }, [options.initialMessages]);

  const [state, dispatch] = useReducer(chatReducer, seededState);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (overrideInput?: string) => {
      const content = (overrideInput ?? state.input).trim();
      if (!content || state.isStreaming) return;

      const userMessage: WorkspaceChatMessage = {
        id: createId("chat-user"),
        role: "user",
        content,
        createdAt: nowIso(),
        status: "complete",
      };

      const assistantMessage: WorkspaceChatMessage = {
        id: createId("chat-assistant"),
        role: "assistant",
        content: "",
        createdAt: nowIso(),
        status: "streaming",
        metadata: {
          model: options.modelId,
          provider: options.provider,
        },
      };

      dispatch({ type: "send_start", userMessage, assistantMessage });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: [...state.messages, userMessage].map((message) => ({
              role: message.role,
              content: message.content,
            })),
            modelId: options.modelId,
            provider: options.provider,
            runtimeMode: options.runtimeSettings.mode,
            apiBaseUrl: options.runtimeSettings.apiBaseUrl,
            streamToolCalls: options.runtimeSettings.showToolCalls,
            fallbackToMock: options.runtimeSettings.fallbackToMock,
            maxToolSteps: options.runtimeSettings.maxToolSteps,
            locale: options.locale ?? "zh-TW",
          }),
        });

        if (!response.body) {
          dispatch({ type: "stream_error", error: "No stream body returned" });
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let rest = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const parsed = parseStreamChunk(rest, chunk);
          rest = parsed.rest;

          for (const event of parsed.events) {
            dispatch({ type: "stream_event", event });
            if (event.type === "tool_call_result") {
              options.onToolResult?.(event.payload);
            }
          }
        }

        dispatch({ type: "stream_complete" });
      } catch (error) {
        dispatch({
          type: "stream_error",
          error: error instanceof Error ? error.message : "Unknown stream error",
        });
      }
    },
    [options, state.input, state.isStreaming, state.messages],
  );

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const retryLast = useCallback(async () => {
    if (!state.lastUserMessage) return;
    await sendMessage(state.lastUserMessage);
  }, [sendMessage, state.lastUserMessage]);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const setInput = useCallback((input: string) => {
    dispatch({ type: "set_input", input });
  }, []);

  const injectSystemMessage = useCallback((content: string) => {
    const message: WorkspaceChatMessage = {
      id: createId("chat-system"),
      role: "system",
      content,
      createdAt: nowIso(),
      status: "complete",
    };
    dispatch({ type: "inject_system", message });
  }, []);

  useEffect(() => {
    onMessagesChange?.(state.messages);
  }, [onMessagesChange, state.messages]);

  return {
    messages: state.messages,
    input: state.input,
    setInput,
    sendMessage,
    stop,
    retryLast,
    clear,
    isStreaming: state.isStreaming,
    activeToolCalls: state.activeToolCalls,
    tokenUsage: state.tokenUsage,
    lastError: state.lastError,
    injectSystemMessage,
  };
}
