"use client";

import { useState } from "react";
import { createId } from "@/lib/utils/ids";
import { MessageList, type ChatMessage } from "@/components/chat/message-list";
import { MessageComposer } from "@/components/chat/message-composer";
import { ModelSwitcher } from "@/components/chat/model-switcher";

const defaultMessages: ChatMessage[] = [
  {
    id: "m-welcome",
    role: "assistant",
    content:
      "Workspace ready in mock mode. You can inspect synthetic reports, signals, and traces. Disclaimer: Synthetic workspace output, not financial advice.",
  },
];

export function ResearchChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [streaming, setStreaming] = useState(false);
  const [modelId, setModelId] = useState("mock-research");

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessage = { id: createId("m"), role: "user", content: text };
    const assistantId = createId("m");
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        modelId,
        provider: modelId.includes("gpt") ? "openai" : modelId.includes("claude") ? "anthropic" : "mock",
        runtimeMode: "mock",
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
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        if (!part.startsWith("data: ")) {
          continue;
        }
        const payload = JSON.parse(part.slice(6));
        if (payload.type === "text") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: `${msg.content}${payload.content}` } : msg,
            ),
          );
        }
      }
    }

    setStreaming(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Research Chat</div>
        <ModelSwitcher value={modelId} onChange={setModelId} />
      </div>
      <MessageList messages={messages} />
      <MessageComposer onSubmit={sendMessage} disabled={streaming} />
    </div>
  );
}
