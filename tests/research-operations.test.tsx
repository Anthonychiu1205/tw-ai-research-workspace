import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { createDefaultOperationRequest, runResearchOperation } from "@/lib/operations/operation-runner";

function clickSubmitByInputLabel(labelPattern: RegExp) {
  const input = screen.getByLabelText(labelPattern);
  const form = input.closest("form");
  if (!form) {
    throw new Error("Expected input to be wrapped by form.");
  }
  const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (!submit) {
    throw new Error("Expected form to have submit button.");
  }
  fireEvent.click(submit);
}

describe("research operations", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    vi.restoreAllMocks();
  });

  test("render operation panel", () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);
    expect(screen.getByTestId("research-operation-panel")).toBeInTheDocument();
  });

  test("run research operation in mock mode", async () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);

    clickSubmitByInputLabel(/^(Run research|執行研究)$/i);

    await waitFor(() => {
      expect(screen.getByText(/run_research/i)).toBeInTheDocument();
    });

    expect(artifactStore.listAll().some((item) => item.type === "research_card")).toBe(true);
  });

  test("generate report operation creates report artifact", async () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);

    clickSubmitByInputLabel(/^(Generate report|產生研究報告)$/i);

    await waitFor(() => {
      expect(artifactStore.listAll().some((item) => item.type === "report")).toBe(true);
    });
  });

  test("run pipeline operation creates trace artifact", async () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);

    clickSubmitByInputLabel(/^(Run pipeline|執行研究流程)$/i);

    await waitFor(() => {
      expect(artifactStore.listAll().some((item) => item.type === "pipeline_trace")).toBe(true);
    });
  });

  test("compare strategies creates strategy artifact", async () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);

    clickSubmitByInputLabel(/^(Compare strategies|比較策略)$/i);

    await waitFor(() => {
      expect(artifactStore.listAll().some((item) => item.type === "strategy_comparison")).toBe(true);
    });
  });

  test("backend failure fallback still creates mock artifact", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("backend offline")));

    const artifactStore = createArtifactStore([]);
    const request = createDefaultOperationRequest("run_research");
    const result = await runResearchOperation(request, artifactStore);

    expect(result.source).toBe("mock_fallback");
    expect(result.status).toBe("succeeded");
    expect(artifactStore.listAll().length).toBeGreaterThan(0);
  });

  test("no trading operation exists", () => {
    const request = createDefaultOperationRequest("run_research");
    expect(request.kind.includes("trade")).toBe(false);
  });
});
