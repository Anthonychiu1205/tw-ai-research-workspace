import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WorkspacePage from "@/app/workspace/page";

describe("light theme", () => {
  test("workspace renders light surfaces for topbar and sidebar", async () => {
    render(<WorkspacePage /> as any);

    await waitFor(() => {
      expect(screen.getByTestId("topbar").className).toMatch(/bg-white/);
      expect(screen.getByTestId("sidebar").className).toMatch(/bg-white/);
    });
  });

  test("topbar does not use dark-only styling", async () => {
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      const topbarClass = screen.getByTestId("topbar").className;
      expect(topbarClass).toMatch(/border-b/);
      expect(topbarClass).not.toMatch(/bg-black|bg-slate-950|backdrop-blur/);
    });
  });
});
