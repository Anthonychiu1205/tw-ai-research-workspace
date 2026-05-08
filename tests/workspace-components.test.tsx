import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";
import { ModelSwitcher } from "@/components/chat/model-switcher";
import { ResearchChat } from "@/components/chat/research-chat";

describe("workspace components", () => {
  test("workspace page renders", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getByText(/AI-native Taiwan Research Workspace/i)).toBeInTheDocument();
  });

  test("model switcher shows mock available", () => {
    render(<ModelSwitcher value="mock-research" onChange={() => {}} />);
    expect(screen.getByTestId("model-switcher")).toBeInTheDocument();
  });

  test("backend unavailable state renders", async () => {
    render(<ResearchChat />);
    expect(await screen.findByText(/backend:/i)).toBeInTheDocument();
  });

  test("prompt examples render", () => {
    render(<ResearchChat />);
    expect(screen.getByTestId("prompt-examples")).toBeInTheDocument();
    expect(screen.getByText(/Analyze 2330 with Phase 2 agents/i)).toBeInTheDocument();
  });

  test("no buy/sell recommendation text", () => {
    render(<ResearchChat />);
    expect(screen.queryByText(/buy recommendation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sell recommendation/i)).not.toBeInTheDocument();
  });
});
