import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import type { CapabilityStatus } from "@/lib/availability/availability-types";

describe("interaction reliability", () => {
  test("operation shows loading then success state", async () => {
    const store = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={store} />);

    const runResearchSection = screen.getByText(/^Run Research$|^執行研究$/, { selector: "summary" }).closest("details");
    expect(runResearchSection).toBeTruthy();
    fireEvent.click(within(runResearchSection as HTMLElement).getByRole("button", { name: /^Run Research$|^執行研究$/ }));

    await waitFor(() => {
      const summary = screen.getByTestId("operation-result-summary");
      expect(summary).toHaveTextContent(/succeeded|已完成|Completed/i);
    });
  });

  test("backend connection card starts with checking placeholder", () => {
    render(
      <BackendConnectionCard
        state={{
          mode: "api",
          apiBaseUrl: "http://127.0.0.1:8000",
          reachable: false,
          fallbackActive: false,
        }}
      />,
    );

    expect(screen.getByTestId("backend-connection-card")).toHaveTextContent(/後端檢查中|Checking backend|後端不可用|Backend unavailable/i);
  });

  test("disabled reason is shown when capability is unavailable", () => {
    const store = createArtifactStore([]);
    const capabilityMap = {
      run_research: {
        id: "run_research",
        label: "Run Research",
        description: "Run deterministic research flow.",
        mode: "api",
        available: false,
        reason: "Backend unavailable",
        fallbackAvailable: false,
      } satisfies CapabilityStatus,
    };

    render(<ResearchOperationPanel artifactStore={store} capabilityMap={capabilityMap as any} />);
    expect(screen.getByText(/Backend unavailable/i)).toBeInTheDocument();
    const runResearchSection = screen.getByText(/^Run Research$|^執行研究$/, { selector: "summary" }).closest("details");
    expect(runResearchSection).toBeTruthy();
    expect(within(runResearchSection as HTMLElement).getByRole("button", { name: /^Run Research$|^執行研究$/ })).toBeDisabled();
  });
});
