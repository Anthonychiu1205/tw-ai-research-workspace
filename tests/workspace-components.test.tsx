import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";
import { ModelSwitcher } from "@/components/chat/model-switcher";
import { ResearchChat } from "@/components/chat/research-chat";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

describe("workspace components", () => {
  test("workspace page renders", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByText(/台股 AI 研究工作區|Taiwan AI Research Workspace/i)).toBeInTheDocument();
    });
  });

  test("model switcher shows mock available", () => {
    render(<ModelSwitcher value="mock-research" onChange={() => {}} />);
    expect(screen.getByTestId("model-switcher")).toBeInTheDocument();
  });

  test("backend unavailable state renders", async () => {
    render(
      <ResearchChat
        runtimeSettings={getDefaultRuntimeSettings()}
        connectionState={{ mode: "mock", apiBaseUrl: "http://localhost:8000", reachable: false, fallbackActive: false }}
        onRuntimeSettingsChange={() => {}}
      />,
    );
    expect(await screen.findByText(/backend|後端/i)).toBeInTheDocument();
  });

  test("prompt examples render", () => {
    render(
      <ResearchChat
        runtimeSettings={getDefaultRuntimeSettings()}
        connectionState={{ mode: "mock", apiBaseUrl: "http://localhost:8000", reachable: false, fallbackActive: false }}
        onRuntimeSettingsChange={() => {}}
      />,
    );
    expect(screen.getByTestId("prompt-examples")).toBeInTheDocument();
    expect(screen.getByText(/Analyze 2330 with Phase 2 agents|分析 2330，並使用 Phase 2 agents/i)).toBeInTheDocument();
  });

  test("no buy/sell recommendation text", () => {
    render(
      <ResearchChat
        runtimeSettings={getDefaultRuntimeSettings()}
        connectionState={{ mode: "mock", apiBaseUrl: "http://localhost:8000", reachable: false, fallbackActive: false }}
        onRuntimeSettingsChange={() => {}}
      />,
    );
    expect(screen.queryByText(/buy recommendation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sell recommendation/i)).not.toBeInTheDocument();
  });
});
