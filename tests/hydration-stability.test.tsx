import React from "react";
import { describe, expect, test } from "vitest";
import { renderToString } from "react-dom/server";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { Topbar } from "@/components/app-shell/topbar";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import { RuntimeSettingsPanel } from "@/components/workspace/runtime-settings-panel";
import { LanguageSwitcher } from "@/components/app-shell/language-switcher";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";
import { getModelOptions } from "@/lib/config/models";

describe("hydration stability", () => {
  test("Topbar server render uses stable placeholder", () => {
    const html = renderToString(
      <I18nProvider>
        <Topbar mode="api" modelLabel="gpt-4.1-mini" />
      </I18nProvider>,
    );

    expect(html).toContain("Runtime 初始化中");
    expect(html).toContain("後端檢查中");
  });

  test("BackendConnectionCard initial render is deterministic", () => {
    const html = renderToString(
      <I18nProvider>
        <BackendConnectionCard
          state={{
            mode: "api",
            apiBaseUrl: "http://localhost:8000",
            reachable: false,
            fallbackActive: true,
            fallbackReason: "offline",
          }}
        />
      </I18nProvider>,
    );

    expect(html).toContain("後端檢查中");
    expect(html).not.toContain("toLocale");
  });

  test("LanguageSwitcher server render uses stable placeholder", () => {
    const html = renderToString(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>,
    );

    expect(html).toContain("語言");
    expect(html).toContain("載入中");
  });

  test("RuntimeSettingsPanel does not require window during render", () => {
    const html = renderToString(
      <I18nProvider>
        <RuntimeSettingsPanel
          settings={getDefaultRuntimeSettings()}
          models={getModelOptions()}
          onChange={() => {}}
          onReset={() => {}}
          onCheckBackend={() => {}}
        />
      </I18nProvider>,
    );

    expect(html).toContain("Runtime 設定");
  });
});
