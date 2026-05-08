import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("ui density", () => {
  test("topbar keeps only core status badges", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      const topbar = screen.getByTestId("topbar-core-statuses");
      expect(topbar.querySelectorAll(".topbar-status").length).toBe(3);
    });
  });

  test("sidebar keeps key sections", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByText(/快速操作|Quick Actions/i)).toBeInTheDocument();
      expect(screen.getByText(/Session 歷史|Session History/i)).toBeInTheDocument();
      expect(screen.getByText(/近期 Artifacts|Recent Artifacts/i)).toBeInTheDocument();
    });
  });

  test("main area keeps segmented workspace tabs", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("workspace-segmented-tabs")).toBeInTheDocument();
      expect(screen.getByTestId("research-chat")).toBeInTheDocument();
    });
  });
});
