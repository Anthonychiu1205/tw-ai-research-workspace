import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("artifact activation", () => {
  test("clicking artifact opens it in context panel", async () => {
    render(<WorkspacePage /> as any);

    const tabs = await screen.findByTestId("workspace-segmented-tabs");
    fireEvent.click(within(tabs).getByRole("button", { name: /^研究產物$|^Research Outputs$/ }));

    const browser = await screen.findByTestId("artifact-browser");
    const openButtons = within(browser).getAllByRole("button", { name: /Open research output|開啟研究產物/i });
    fireEvent.click(openButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId("workspace-context-panel")).toBeInTheDocument();
    });
  });

  test("active artifact button reflects selected state", async () => {
    render(<WorkspacePage /> as any);

    const tabs = await screen.findByTestId("workspace-segmented-tabs");
    fireEvent.click(within(tabs).getByRole("button", { name: /^研究產物$|^Research Outputs$/ }));
    const browser = await screen.findByTestId("artifact-browser");
    const openButtons = within(browser).getAllByRole("button", { name: /Open research output|開啟研究產物/i });
    fireEvent.click(openButtons[0]);

    await waitFor(() => {
      expect(within(browser).getByRole("button", { name: /Selected|已選擇/i })).toBeInTheDocument();
    });
  });
});
