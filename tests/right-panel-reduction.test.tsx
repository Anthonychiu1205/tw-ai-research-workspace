import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("right panel reduction", () => {
  test("backend capabilities are collapsed by default", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      const details = screen.getByTestId("capability-status-collapsible");
      expect(details).toBeInTheDocument();
      expect(details.hasAttribute("open")).toBe(false);
    });
  });

  test("runtime settings are collapsed by default", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      const details = screen.getByTestId("runtime-settings-collapsible");
      expect(details).toBeInTheDocument();
      expect(details.hasAttribute("open")).toBe(false);
    });
    expect(screen.getByTestId("workspace-context-empty")).toBeInTheDocument();
  });
});
