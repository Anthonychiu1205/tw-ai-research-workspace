"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageList } from "@/components/chat/message-list";
import { MessageComposer } from "@/components/chat/message-composer";
import { ModelSwitcher } from "@/components/chat/model-switcher";
import { RetryMessageButton } from "@/components/chat/retry-message-button";
import { resolveModelProvider, getModelAvailability } from "@/lib/config/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResearchChat } from "@/lib/ai/use-research-chat";
import type { BackendConnectionState, RuntimeSettings } from "@/lib/schemas/workspace";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ResearchChat({
  runtimeSettings,
  connectionState,
  onRuntimeSettingsChange,
  onToolResult,
  onOpenArtifact,
  systemEvents,
}: {
  runtimeSettings: RuntimeSettings;
  connectionState: BackendConnectionState;
  onRuntimeSettingsChange: (patch: Partial<RuntimeSettings>) => void;
  onToolResult?: (payload: Record<string, unknown>) => void;
  onOpenArtifact?: (artifactId: string) => void;
  systemEvents?: Array<{ id: string; content: string }>;
}) {
  const { t, locale } = useI18n();
  const [runtimeWarning, setRuntimeWarning] = useState<string | null>(null);
  const selectedProvider = useMemo(() => resolveModelProvider(runtimeSettings.selectedModel), [runtimeSettings.selectedModel]);
  const modelAvailability = useMemo(() => getModelAvailability(runtimeSettings.selectedModel), [runtimeSettings.selectedModel]);
  const promptExamples = useMemo(
    () => [t("chat.exampleAnalyze"), t("chat.exampleReport"), t("chat.exampleStrategy"), t("chat.exampleTrace"), t("chat.exampleSignals")],
    [t],
  );

  const chat = useResearchChat({
    runtimeSettings,
    modelId: runtimeSettings.selectedModel,
    provider: selectedProvider,
    initialMessages: [
      {
        id: "m-welcome",
        role: "assistant",
        content: t("chat.welcome"),
        createdAt: new Date().toISOString(),
        status: "complete",
        metadata: {
          provider: "mock",
          model: "mock-research",
          fallbackUsed: false,
        },
      },
    ],
    locale,
    onToolResult,
  });

  const seenSystemEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const event of systemEvents ?? []) {
      if (seenSystemEventsRef.current.has(event.id)) {
        continue;
      }
      seenSystemEventsRef.current.add(event.id);
      chat.injectSystemMessage(event.content);
    }
  }, [chat, systemEvents]);

  return (
    <div className="space-y-3" data-testid="research-chat">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">{t("chat.title")}</div>
        <div className="flex items-center gap-2 text-xs">
          <Badge>
            {t("runtime.mode")}: {runtimeSettings.mode === "mock" ? t("runtime.mockMode") : t("runtime.apiMode")}
          </Badge>
          <Badge>
            {t("runtime.provider")}: {selectedProvider}
          </Badge>
          <Badge>
            {t("runtime.model")}: {runtimeSettings.selectedModel}
          </Badge>
          <Badge>
            {t("runtime.backend")}: {connectionState.reachable ? t("backend.connected") : t("backend.optional")}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ModelSwitcher
          value={runtimeSettings.selectedModel}
          onChange={(next) => onRuntimeSettingsChange({ selectedModel: next, selectedProvider: resolveModelProvider(next) })}
          onUnavailableSelect={(reason) => setRuntimeWarning(`${t("model.unavailable")}；${t("backend.fallback")} ${reason}`)}
        />
        <select
          className="h-9 rounded-md border bg-background px-2 text-xs"
          value={runtimeSettings.mode}
          aria-label={t("chat.runtimeMode")}
          onChange={(event) => onRuntimeSettingsChange({ mode: event.target.value as "mock" | "api" })}
        >
          <option value="mock">{t("runtime.mockMode")}</option>
          <option value="api">{t("runtime.apiMode")}</option>
        </select>
        {!modelAvailability.available ? <Badge>{t("runtime.fallback")}: {modelAvailability.reasonUnavailable ?? t("model.unavailable")}</Badge> : null}
      </div>

      {runtimeWarning ? <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-2 text-xs">{runtimeWarning}</div> : null}
      {chat.lastError ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs">
          <div className="mb-2">{chat.lastError}</div>
          <div className="flex gap-2">
            <RetryMessageButton onRetry={() => void chat.retryLast()} disabled={chat.isStreaming} />
            <Button type="button" size="sm" variant="outline" onClick={chat.clear}>
              {t("chat.clear")}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2" data-testid="prompt-examples">
        {promptExamples.map((example) => (
          <Button key={example} type="button" size="sm" variant="outline" onClick={() => void chat.sendMessage(example)} disabled={chat.isStreaming}>
            {example}
          </Button>
        ))}
      </div>

      <MessageList messages={chat.messages} onOpenArtifact={onOpenArtifact} />
      <MessageComposer
        value={chat.input}
        onChange={chat.setInput}
        onSubmit={() => void chat.sendMessage()}
        onStop={chat.stop}
        disabled={chat.isStreaming}
      />

      {runtimeSettings.showTokenUsage && chat.tokenUsage ? (
        <div className="rounded-md border p-2 text-xs text-muted-foreground">
          {t("chat.tokenUsage")}: {JSON.stringify(chat.tokenUsage)}
        </div>
      ) : null}

      {runtimeSettings.showToolCalls && chat.activeToolCalls.length > 0 ? (
        <div className="rounded-md border p-2 text-xs text-muted-foreground">
          {t("chat.activeToolCalls")}: {chat.activeToolCalls.length}
        </div>
      ) : null}
    </div>
  );
}
