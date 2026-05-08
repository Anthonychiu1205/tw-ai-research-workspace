"use client";

import type { ModelProvider, RuntimeSettings } from "@/lib/schemas/workspace";
import type { ModelOption } from "@/lib/config/models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackendLiveModeGuide } from "@/components/workspace/backend-live-mode-guide";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const { t } = useI18n();
  const providers: ModelProvider[] = ["mock", "openai", "anthropic", "local", "groq", "deepseek", "ollama"];

  return (
    <div className="space-y-3 rounded-lg border border-border/80 bg-workspace-panel p-3" data-testid="runtime-settings-panel">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{t("runtime.settingsTitle")}</div>
        <StatusBadge tone={settings.mode === "mock" ? "mock" : "backend"}>
          {settings.mode === "mock" ? t("runtime.mockMode") : t("runtime.apiMode")}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <label className="space-y-1">
          <div>{t("runtime.mode")}</div>
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
          <div>{t("runtime.model")}</div>
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
        <div>{t("runtime.apiBaseUrl")}</div>
        <Input aria-label="API base URL" value={settings.apiBaseUrl} onChange={(event) => onChange({ apiBaseUrl: event.target.value })} />
      </label>

      <label className="space-y-1 text-xs">
        <div>{t("runtime.apiBridgeMode")}</div>
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
          {t("runtime.fallbackToMock")}
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showToolCalls}
            onChange={(event) => onChange({ showToolCalls: event.target.checked })}
          />
          {t("runtime.showToolCalls")}
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showTokenUsage}
            onChange={(event) => onChange({ showTokenUsage: event.target.checked })}
          />
          {t("runtime.showTokenUsage")}
        </label>
        <label className="space-y-1">
          <span className="block">{t("runtime.maxToolSteps")}</span>
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
        <StatusBadge tone="trace">{t("runtime.provider")}: {settings.selectedProvider}</StatusBadge>
        <StatusBadge tone="trace">{t("runtime.model")}: {settings.selectedModel}</StatusBadge>
        {providerUnavailableReason ? <StatusBadge tone="warning">{t("model.unavailable")}: {providerUnavailableReason}</StatusBadge> : null}
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
          {t("runtime.resetMockDefaults")}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCheckBackend}>
          {t("backend.testConnection")}
        </Button>
      </div>

      <BackendLiveModeGuide apiBaseUrl={settings.apiBaseUrl} fallbackActive={Boolean(fallbackActive)} onTestConnection={onCheckBackend} />
    </div>
  );
}
