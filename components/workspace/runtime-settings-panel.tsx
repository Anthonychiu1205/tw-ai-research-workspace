"use client";

import type { ModelProvider, RuntimeSettings } from "@/lib/schemas/workspace";
import type { ModelOption } from "@/lib/config/models";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackendLiveModeGuide } from "@/components/workspace/backend-live-mode-guide";

export function RuntimeSettingsPanel({
  settings,
  models,
  providerUnavailableReason,
  onChange,
  onReset,
  onCheckBackend,
  fallbackActive,
}: {
  settings: RuntimeSettings;
  models: ModelOption[];
  providerUnavailableReason?: string;
  onChange: (patch: Partial<RuntimeSettings>) => void;
  onReset: () => void;
  onCheckBackend: () => void;
  fallbackActive?: boolean;
}) {
  const providers: ModelProvider[] = ["mock", "openai", "anthropic", "local", "groq", "deepseek", "ollama"];

  return (
    <div className="space-y-3 rounded-md border p-3" data-testid="runtime-settings-panel">
      <div className="text-sm font-medium">Runtime Settings</div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <label className="space-y-1">
          <div>Mode</div>
          <select
            aria-label="Workspace mode"
            className="h-9 w-full rounded-md border bg-background px-2"
            value={settings.mode}
            onChange={(event) => onChange({ mode: event.target.value as "mock" | "api" })}
          >
            <option value="mock">mock</option>
            <option value="api">api</option>
          </select>
        </label>

        <label className="space-y-1">
          <div>Model</div>
          <select
            aria-label="Model selection"
            className="h-9 w-full rounded-md border bg-background px-2"
            value={settings.selectedModel}
            onChange={(event) => {
              const modelId = event.target.value;
              const selected = models.find((model) => model.id === modelId);
              onChange({ selectedModel: modelId, selectedProvider: selected?.provider ?? "mock" });
            }}
          >
            {models.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1 text-xs">
        <div>API Base URL</div>
        <Input aria-label="API base URL" value={settings.apiBaseUrl} onChange={(event) => onChange({ apiBaseUrl: event.target.value })} />
      </label>

      <label className="space-y-1 text-xs">
        <div>API Bridge Mode</div>
        <select
          aria-label="API bridge mode"
          className="h-9 w-full rounded-md border bg-background px-2"
          value={settings.apiBridgeMode}
          onChange={(event) => onChange({ apiBridgeMode: event.target.value as "mock" | "proxy" | "direct" })}
        >
          <option value="mock">mock</option>
          <option value="proxy">proxy</option>
          <option value="direct">direct</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.fallbackToMock}
            onChange={(event) => onChange({ fallbackToMock: event.target.checked })}
          />
          fallback to mock
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showToolCalls}
            onChange={(event) => onChange({ showToolCalls: event.target.checked })}
          />
          show tool calls
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showTokenUsage}
            onChange={(event) => onChange({ showTokenUsage: event.target.checked })}
          />
          show token usage
        </label>
        <label className="space-y-1">
          <span className="block">max tool steps</span>
          <input
            className="h-8 w-full rounded border bg-background px-2"
            type="number"
            min={1}
            max={8}
            value={settings.maxToolSteps}
            onChange={(event) => onChange({ maxToolSteps: Number(event.target.value) })}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>provider: {settings.selectedProvider}</Badge>
        <Badge>model: {settings.selectedModel}</Badge>
        {providerUnavailableReason ? <Badge>unavailable: {providerUnavailableReason}</Badge> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <Button
            key={provider}
            type="button"
            size="sm"
            variant={settings.selectedProvider === provider ? "default" : "outline"}
            onClick={() => onChange({ selectedProvider: provider })}
          >
            {provider}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onReset}>
          Reset mock defaults
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCheckBackend}>
          Test backend connection
        </Button>
      </div>

      <BackendLiveModeGuide apiBaseUrl={settings.apiBaseUrl} fallbackActive={Boolean(fallbackActive)} onTestConnection={onCheckBackend} />
    </div>
  );
}
