import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("visual hierarchy", () => {
  test("workspace page renders section headers", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getAllByText(/研究工作區|Research Workspace/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/研究對話|Research Chat/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Runtime 設定|Runtime Settings/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Context/i).length).toBeGreaterThan(0);
    });
  });

  test("topbar exposes only core status badges", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      const topbar = screen.getByTestId("topbar-core-statuses");
      const badges = topbar.querySelectorAll(".topbar-status");
      expect(badges.length).toBe(3);
      expect(screen.getByLabelText(/語言|Language/i)).toBeInTheDocument();
    });
  });

  test("artifact cards show type labels", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("artifact-browser")).toBeInTheDocument();
    });

    expect(screen.getAllByText(/研究 Artifacts|Research Artifacts/i).length).toBeGreaterThan(0);
  });

  test("backend and runtime cards exist", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("backend-connection-card")).toBeInTheDocument();
      expect(screen.getByTestId("runtime-settings-panel")).toBeInTheDocument();
    });
  });
});
