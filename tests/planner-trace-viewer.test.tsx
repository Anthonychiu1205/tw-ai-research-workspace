import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";

const trace = {
  plan: {
    steps: [
      { id: "s1", title: "Collect synthetic evidence", status: "completed", detail: "ok" },
      { id: "s2", title: "Generate bounded summary", status: "warning", detail: "missing one evidence id" },
    ],
  },
  execution: {
    toolCalls: [
      {
        toolName: "runResearch",
        status: "succeeded",
        latencyMs: 420,
        argsPreview: "symbol=2330",
        fallbackUsed: false,
        evidenceCount: 2,
      },
    ],
  },
  reflection: {
    summary: "Synthetic reflection",
    cautionFlags: ["mock data"],
    critiques: ["verify evidence links"],
    missingEvidence: ["ev-9"],
    overclaimingRisk: "low",
  },
};

describe("planner trace viewer", () => {
  test("renders steps", () => {
    render(<PlannerTraceViewer plan={trace.plan} execution={trace.execution} reflection={trace.reflection} />);
    expect(screen.getByText(/Collect synthetic evidence/i)).toBeInTheDocument();
  });

  test("expands tool trace", () => {
    render(<PlannerTraceViewer plan={trace.plan} execution={trace.execution} reflection={trace.reflection} />);
    fireEvent.click(screen.getByText("execution"));
    fireEvent.click(screen.getByText(/runResearch/i));
    expect(screen.getByText(/args: symbol=2330/i)).toBeInTheDocument();
  });

  test("reflection warnings visible", () => {
    render(<PlannerTraceViewer plan={trace.plan} execution={trace.execution} reflection={trace.reflection} />);
    fireEvent.click(screen.getByText("reflection"));
    expect(screen.getByText(/warnings: mock data/i)).toBeInTheDocument();
  });

  test("bounded workflow copy visible", () => {
    render(<PlannerTraceViewer plan={trace.plan} execution={trace.execution} reflection={trace.reflection} />);
    expect(screen.getByText(/bounded deterministic workflow visualization/i)).toBeInTheDocument();
  });

  test("no uncontrolled loop wording", () => {
    render(<PlannerTraceViewer plan={trace.plan} execution={trace.execution} reflection={trace.reflection} />);
    expect(screen.queryByText(/autonomous trading loop enabled/i)).not.toBeInTheDocument();
  });
});
