import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("right context panel", () => {
  test("backend summary and collapsed capability details render", async () => {
    render(<WorkspacePage /> as any);

    await waitFor(() => {
      expect(screen.getByTestId("backend-connection-card")).toBeInTheDocument();
      expect(screen.getByTestId("backend-capabilities-panel")).toBeInTheDocument();
      expect(screen.getByTestId("backend-capabilities-details")).toBeInTheDocument();
    });

    const details = screen.getByTestId("backend-capabilities-details") as HTMLDetailsElement;
    expect(details.open).toBe(false);
  });

  test("runtime settings and export/import remain in context panel", async () => {
    render(<WorkspacePage /> as any);

    await waitFor(() => {
      expect(screen.getAllByText(/Runtime 設定|Runtime Settings/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/匯出 \/ 匯入|Export \/ Import/i).length).toBeGreaterThan(0);
    });
  });
});
