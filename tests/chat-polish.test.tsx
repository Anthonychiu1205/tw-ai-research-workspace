import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { ResearchChat } from "@/components/chat/research-chat";

const runtimeSettings = {
  mode: "mock" as const,
  apiBaseUrl: "http://localhost:8000",
  apiBridgeMode: "mock" as const,
  selectedProvider: "mock" as const,
  selectedModel: "mock-research",
  fallbackToMock: true,
  showToolCalls: true,
  showTokenUsage: true,
  maxToolSteps: 3,
};

const connectionState = {
  mode: "mock" as const,
  apiBaseUrl: "http://localhost:8000",
  reachable: false,
  fallbackActive: false,
};

describe("chat polish", () => {
  test("chat renders prompt examples and non-advice welcome", () => {
    render(
      <I18nProvider>
        <ResearchChat
          runtimeSettings={runtimeSettings}
          connectionState={connectionState}
          onRuntimeSettingsChange={() => {}}
        />
      </I18nProvider>,
    );

    expect(screen.getByTestId("prompt-examples")).toBeInTheDocument();
    expect(screen.getByText(/非投資建議|not financial advice/i)).toBeInTheDocument();
  });
});
