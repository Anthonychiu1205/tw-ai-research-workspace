import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { discoverBackendCapabilities } from "@/lib/api/capabilities";
import { BackendCapabilitiesPanel } from "@/components/workspace/backend-capabilities-panel";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

describe("backend capabilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("mock capabilities available", async () => {
    const report = await discoverBackendCapabilities({ ...getDefaultRuntimeSettings(), mode: "mock" });
    expect(report.capabilities.length).toBeGreaterThan(0);
    expect(report.mode).toBe("mock");
  });

  test("api unreachable shows fallback", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const report = await discoverBackendCapabilities({
      ...getDefaultRuntimeSettings(),
      mode: "api",
      apiBridgeMode: "proxy",
      fallbackToMock: true,
    });

    expect(report.reachable).toBe(false);
    expect(report.fallbackActive).toBe(true);
  });

  test("panel renders capability categories", async () => {
    const report = await discoverBackendCapabilities({ ...getDefaultRuntimeSettings(), mode: "mock" });
    render(<BackendCapabilitiesPanel report={report} />);
    expect(screen.getByTestId("backend-capabilities-panel")).toBeInTheDocument();
    expect(screen.getAllByText(/Backend Capabilities|後端能力/i).length).toBeGreaterThan(0);
  });
});
