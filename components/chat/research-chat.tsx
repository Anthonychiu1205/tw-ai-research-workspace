"use client";

import { useMemo, useState } from "react";
import { createId } from "@/lib/utils/ids";
import { MessageList, type ChatMessage } from "@/components/chat/message-list";
import { MessageComposer } from "@/components/chat/message-composer";
import { ModelSwitcher } from "@/components/chat/model-switcher";
import { ToolCallRenderer } from "@/components/chat/tool-call-renderer";
import { resolveModelProvider, getModelAvailability } from "@/lib/config/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BackendConnectionState, RuntimeSettings } from "@/lib/schemas/workspace";

const promptExamples = [
  "Analyze 2330 with Phase 2 agents",
  "Generate a research report for 2330",
  "Compare strategies for 2330, 2317, 2454",
  "Show planner trace for 2330",
];

const defaultMessages: ChatMessage[] = [
  {
    id: "m-welcome",
    role: "assistant",
    content:
      "Workspace ready in mock mode. You can inspect synthetic reports, signals, and traces. Disclaimer: Synthetic workspace output, not financial advice.",
  },
];

export function ResearchChat({
  runtimeSettings,
  connectionState,
  onRuntimeSettingsChange,
}: {
  runtimeSettings: RuntimeSettings;
  connectionState: BackendConnectionState;
  onRuntimeSettingsChange: (patch: Partial<RuntimeSettings>) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [toolEvents, setToolEvents] = useState<any[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [runtimeWarning, setRuntimeWarning] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<Record<string, unknown> | null>(null);

  const selectedProvider = useMemo(() => resolveModelProvider(runtimeSettings.selectedModel), [runtimeSettings.selectedModel]);
  const modelAvailability = useMemo(() => getModelAvailability(runtimeSettings.selectedModel), [runtimeSettings.selectedModel]);

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessage = { id: createId("m"), role: "user", content: text };
    const assistantId = createId("m");

    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);
    setRuntimeWarning(null);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        modelId: runtimeSettings.selectedModel,
        provider: selectedProvider,
        runtimeMode: runtimeSettings.mode,
        streamToolCalls: runtimeSettings.showToolCalls,
        fallbackToMock: runtimeSettings.fallbackToMock,
        maxToolSteps: runtimeSettings.maxToolSteps,
      }),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      setStreaming(false);
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        if (!part.startsWith("data: ")) continue;
        const event = JSON.parse(part.slice(6));

        if (event.type === "message_delta") {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: `${message.content}${String(event.payload?.content ?? "")}` }
                : message,
            ),
          );
        }

        if (event.type === "tool_call_result") {
          setToolEvents((prev) => [...prev, event.payload]);
        }

        if (event.type === "trace_update" && event.payload?.warning) {
          setRuntimeWarning(String(event.payload.warning));
        }

        if (event.type === "token_usage") {
          setTokenUsage(event.payload ?? null);
        }

        if (event.type === "final") {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content: message.content.includes("not financial advice")
                      ? message.content
                      : `${message.content}\n\nDisclaimer: Synthetic workspace output, not financial advice.`,
                  }
                : message,
            ),
          );
        }
      }
    }

    setStreaming(false);
  };

  return (
    <div className="space-y-3" data-testid="research-chat">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">Research Chat</div>
        <div className="flex items-center gap-2 text-xs">
          <Badge>mode: {runtimeSettings.mode}</Badge>
          <Badge>provider: {selectedProvider}</Badge>
          <Badge>model: {runtimeSettings.selectedModel}</Badge>
          <Badge>backend: {connectionState.reachable ? "reachable" : "optional"}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ModelSwitcher
          value={runtimeSettings.selectedModel}
          onChange={(next) => onRuntimeSettingsChange({ selectedModel: next, selectedProvider: resolveModelProvider(next) })}
          onUnavailableSelect={(reason) => setRuntimeWarning(`Provider unavailable; fallback to mock. ${reason}`)}
        />
        <select
          className="h-9 rounded-md border bg-background px-2 text-xs"
          value={runtimeSettings.mode}
          onChange={(event) => onRuntimeSettingsChange({ mode: event.target.value as "mock" | "api" })}
        >
          <option value="mock">mock</option>
          <option value="api">api</option>
        </select>
        {!modelAvailability.available ? <Badge>fallback: {modelAvailability.reasonUnavailable ?? "provider unavailable"}</Badge> : null}
      </div>

      {runtimeWarning ? <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-2 text-xs">{runtimeWarning}</div> : null}

      <div className="flex flex-wrap gap-2" data-testid="prompt-examples">
        {promptExamples.map((example) => (
          <Button key={example} type="button" size="sm" variant="outline" onClick={() => void sendMessage(example)} disabled={streaming}>
            {example}
          </Button>
        ))}
      </div>

      <MessageList messages={messages} />
      <MessageComposer onSubmit={(text) => void sendMessage(text)} disabled={streaming} />

      {runtimeSettings.showTokenUsage && tokenUsage ? (
        <div className="rounded-md border p-2 text-xs text-muted-foreground">token usage: {JSON.stringify(tokenUsage)}</div>
      ) : null}

      {runtimeSettings.showToolCalls ? (
        <div className="space-y-2">
          {toolEvents.map((event, index) => (
            <ToolCallRenderer key={`${event.toolName}-${index}`} event={event} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
