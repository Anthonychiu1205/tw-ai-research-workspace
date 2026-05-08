import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { createDefaultOperationRequest, runResearchOperation } from "@/lib/operations/operation-runner";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";

describe("operation reliability", () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...envBackup };
    vi.unstubAllGlobals();
  });

  test("each core operation creates expected artifact type", async () => {
    const kinds = [
      "run_research",
      "generate_report",
      "run_pipeline",
      "run_backtest",
      "run_portfolio_review",
      "run_backtest_v2",
      "compare_strategies",
      "evaluate_signals",
    ] as const;
    const expected = [
      "research_card",
      "report",
      "pipeline_trace",
      "backtest_summary",
      "portfolio_review",
      "backtest_v2_summary",
      "strategy_comparison",
      "signal_evaluation",
    ];

    const store = createArtifactStore([]);
    const created: string[] = [];

    for (const kind of kinds) {
      const result = await runResearchOperation(createDefaultOperationRequest(kind), store);
      expect(result.status).toBe("succeeded");
      expect(result.artifactIds.length).toBeGreaterThan(0);
      created.push(result.artifactIds[0]);
    }

    const types = created.map((id) => store.get(id)?.type);
    expect(types).toEqual(expected);
  });

  test("fallback feedback is returned when API mode is unavailable", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "direct";
    process.env.TW_AI_RESEARCH_API_BASE_URL = "http://127.0.0.1:65530";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const store = createArtifactStore([]);
    const result = await runResearchOperation(createDefaultOperationRequest("run_research"), store);

    expect(result.status).toBe("succeeded");
    expect(result.source).toBe("mock_fallback");
    expect(result.artifactIds.length).toBe(1);
  });

  test("operation panel shows success feedback and emits artifact", async () => {
    const store = createArtifactStore([]);
    const onArtifactCreated = vi.fn();
    render(<ResearchOperationPanel artifactStore={store} onArtifactCreated={onArtifactCreated} />);
    const runResearchSection = screen.getByText(/^Run Research$|^執行研究$/, { selector: "summary" }).closest("details");
    expect(runResearchSection).toBeTruthy();
    fireEvent.click(within(runResearchSection as HTMLElement).getByRole("button", { name: /^Run Research$|^執行研究$/ }));

    await waitFor(() => {
      expect(screen.getByTestId("operation-result-summary")).toBeInTheDocument();
    });
    expect(onArtifactCreated).toHaveBeenCalled();
  });
});
