import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("workspace page integration", () => {
  test("workspace page renders", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByText(/AI-native Taiwan Research Workspace/i)).toBeInTheDocument();
    });
  });

  test("operation panel exists", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("research-operation-panel")).toBeInTheDocument();
    });
  });

  test("chat exists", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("research-chat")).toBeInTheDocument();
    });
  });

  test("artifact browser exists", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("artifact-browser")).toBeInTheDocument();
    });
  });

  test("context panel empty state", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("workspace-context-empty")).toBeInTheDocument();
    });
  });

  test("mock warning visible", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getAllByText(/synthetic/i).length).toBeGreaterThan(0);
    });
  });

  test("no dashboard/SaaS wording", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.queryByText(/SaaS dashboard/i)).not.toBeInTheDocument();
    });
  });
});
