import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import { BackendCapabilitiesPanel } from "@/components/workspace/backend-capabilities-panel";
import { RuntimeSettingsPanel } from "@/components/workspace/runtime-settings-panel";
import { getModelOptions } from "@/lib/config/models";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

describe("live backend UI states", () => {
  test("backend connected state renders", () => {
    render(
      <BackendConnectionCard
        state={{
          mode: "api",
          apiBaseUrl: "http://127.0.0.1:8000",
          reachable: true,
          checkedAt: "2026-05-08T08:00:00.000Z",
          appTitle: "TW AI Research Backend",
          fallbackActive: false,
        }}
      />,
    );

    expect(screen.getByTestId("backend-connection-card")).toBeInTheDocument();
    expect(screen.getByText(/base URL:/i)).toBeInTheDocument();
  });

  test("backend unreachable fallback state renders", () => {
    render(
      <BackendConnectionCard
        state={{
          mode: "api",
          apiBaseUrl: "http://127.0.0.1:8000",
          reachable: false,
          checkedAt: "2026-05-08T08:00:00.000Z",
          appTitle: "TW AI Research Backend",
          fallbackActive: true,
          fallbackReason: "backend unavailable",
        }}
        lastLiveIntegration={{
          checkedAt: "2026-05-08T08:01:00.000Z",
          baseUrl: "http://127.0.0.1:8000",
          reachable: false,
          fallbackActive: true,
          fallbackReason: "connection refused",
          source: "connection_check",
        }}
      />,
    );

    expect(screen.getByTestId("last-live-integration")).toBeInTheDocument();
    expect(screen.getAllByText(/fallback/i).length).toBeGreaterThan(0);
  });

  test("capabilities include portfolio and backtests", () => {
    render(
      <BackendCapabilitiesPanel
        report={{
          reachable: true,
          baseUrl: "http://127.0.0.1:8000",
          checkedAt: "2026-05-08T08:00:00.000Z",
          mode: "api",
          fallbackActive: false,
          missing: [],
          warnings: [],
          capabilities: [
            {
              id: "portfolio-review",
              label: "Portfolio Review",
              available: true,
              endpoint: "/api/backend/portfolio",
              method: "POST",
              category: "portfolio",
            },
            {
              id: "backtests",
              label: "Backtests",
              available: true,
              endpoint: "/api/backend/backtests",
              method: "POST",
              category: "backtests",
            },
          ],
        }}
      />,
    );

    expect(screen.getAllByText("portfolio").length).toBeGreaterThan(0);
    expect(screen.getAllByText("backtests").length).toBeGreaterThan(0);
  });

  test("runtime settings panel renders API base URL and avoids trading wording", () => {
    const settings = getDefaultRuntimeSettings();
    render(
      <RuntimeSettingsPanel
        settings={{ ...settings, mode: "api", apiBaseUrl: "http://127.0.0.1:8000" }}
        models={getModelOptions()}
        onChange={vi.fn()}
        onReset={vi.fn()}
        onCheckBackend={vi.fn()}
        fallbackActive
      />,
    );

    expect(screen.getByLabelText("API base URL")).toBeInTheDocument();
    expect(screen.queryByText(/execute trade|place order|guaranteed returns|risk-free/i)).not.toBeInTheDocument();
  });
});
