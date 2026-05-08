import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("workspace page integration", () => {
  test("workspace page renders", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getByText(/AI-native Taiwan Research Workspace/i)).toBeInTheDocument();
  });

  test("operation panel exists", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getByTestId("research-operation-panel")).toBeInTheDocument();
  });

  test("chat exists", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getByTestId("research-chat")).toBeInTheDocument();
  });

  test("artifact browser exists", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getByTestId("artifact-browser")).toBeInTheDocument();
  });

  test("context panel empty state", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getByTestId("workspace-context-empty")).toBeInTheDocument();
  });

  test("mock warning visible", () => {
    render(<WorkspacePage /> as any);
    expect(screen.getAllByText(/synthetic/i).length).toBeGreaterThan(0);
  });

  test("no dashboard/SaaS wording", () => {
    render(<WorkspacePage /> as any);
    expect(screen.queryByText(/SaaS dashboard/i)).not.toBeInTheDocument();
  });
});
