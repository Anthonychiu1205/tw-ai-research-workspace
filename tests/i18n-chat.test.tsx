import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { ResearchChat } from "@/components/chat/research-chat";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";
import type { BackendConnectionState } from "@/lib/schemas/workspace";
import { runAssistantRuntime } from "@/lib/ai/runtime";

function baseConnection(): BackendConnectionState {
  return {
    mode: "mock",
    apiBaseUrl: "http://localhost:8000",
    reachable: false,
    fallbackActive: false,
  };
}

describe("i18n chat", () => {
  test("zh prompt examples render", () => {
    render(
      <I18nProvider>
        <ResearchChat runtimeSettings={getDefaultRuntimeSettings()} connectionState={baseConnection()} onRuntimeSettingsChange={() => undefined} />
      </I18nProvider>,
    );

    expect(screen.getByText("分析 2330，並使用 Phase 2 agents")).toBeInTheDocument();
  });

  test("en prompt examples render after locale switch", () => {
    window.localStorage.setItem("tw-ai-research-workspace.locale", "en-US");

    render(
      <I18nProvider>
        <ResearchChat runtimeSettings={getDefaultRuntimeSettings()} connectionState={baseConnection()} onRuntimeSettingsChange={() => undefined} />
      </I18nProvider>,
    );

    expect(screen.getByText("Analyze 2330 with Phase 2 agents")).toBeInTheDocument();
  });

  test("mock response disclaimer follows locale", async () => {
    const zh = await runAssistantRuntime({
      messages: [{ role: "user", content: "分析 2330" }],
      modelId: "mock-research",
      provider: "mock",
      locale: "zh-TW",
    });
    const en = await runAssistantRuntime({
      messages: [{ role: "user", content: "Analyze 2330" }],
      modelId: "mock-research",
      provider: "mock",
      locale: "en-US",
    });

    const zhFinal = zh.events.find((event) => event.type === "final");
    const enFinal = en.events.find((event) => event.type === "final");
    expect(JSON.stringify(zhFinal?.payload ?? {})).toContain("非投資建議");
    expect(JSON.stringify(enFinal?.payload ?? {})).toContain("not financial advice");
  });

  test("no forbidden investment wording", async () => {
    const result = await runAssistantRuntime({
      messages: [{ role: "user", content: "Analyze 2330" }],
      modelId: "mock-research",
      provider: "mock",
      locale: "en-US",
    });
    const text = JSON.stringify(result.events).toLowerCase();
    expect(text.includes("buy recommendation")).toBe(false);
    expect(text.includes("sell recommendation")).toBe(false);
    expect(text.includes("guaranteed returns")).toBe(false);
  });
});
