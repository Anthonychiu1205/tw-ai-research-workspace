import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import WorkspacePage from "@/app/workspace/page";
import ReportsPage from "@/app/reports/page";
import StrategiesPage from "@/app/strategies/page";
import TracesPage from "@/app/traces/page";

describe("page smoke", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  test("workspace page renders", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("workspace-page-grid")).toBeInTheDocument();
    });
  });

  test("reports page renders", () => {
    render(<ReportsPage /> as any);
    expect(screen.getByRole("heading", { name: /^Synthetic Report Viewer$/i })).toBeInTheDocument();
  });

  test("strategies page renders", () => {
    render(<StrategiesPage /> as any);
    expect(screen.getByText(/Strategy Comparison/i)).toBeInTheDocument();
  });

  test("traces page renders", () => {
    render(<TracesPage /> as any);
    expect(screen.getByText(/Planner \/ Executor Trace/i)).toBeInTheDocument();
  });

  test("page empty states render", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("scenario-launcher")).toBeInTheDocument();
    });
  });

  test("no backend required", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getAllByText(/Mock workspace|optional/i).length).toBeGreaterThan(0);
    });
  });
});
