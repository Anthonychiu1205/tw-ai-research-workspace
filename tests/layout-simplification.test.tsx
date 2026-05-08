import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("layout simplification", () => {
  test("workspace grid and core panels render", async () => {
    const { container } = render(<WorkspacePage /> as any);

    await waitFor(() => {
      expect(screen.getByTestId("workspace-page-grid")).toBeInTheDocument();
      expect(screen.getByTestId("backend-connection-card")).toBeInTheDocument();
    });

    const mainScroll = container.querySelector("main.overflow-y-auto");
    expect(mainScroll).toBeInTheDocument();
  });

  test("scenario and artifacts zones remain available", async () => {
    render(<WorkspacePage /> as any);

    await waitFor(() => {
      expect(screen.getByTestId("workspace-scenarios-zone")).toBeInTheDocument();
      expect(screen.getByTestId("artifact-browser")).toBeInTheDocument();
    });
  });
});
