import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ToolCallRenderer } from "@/components/chat/tool-call-renderer";
import { workspaceTools } from "@/lib/ai/tool-registry";

describe("tool renderer", () => {
  test("renderer handles succeeded tool", () => {
    render(
      <ToolCallRenderer
        event={{
          toolName: "runResearch",
          status: "succeeded",
          summary: "done",
          source: "mock",
          fallbackUsed: false,
          evidenceIds: ["ev-1"],
          warnings: [],
          data: { score: 0.64 },
        }}
      />,
    );

    expect(screen.getByText(/tool: runResearch/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  test("renderer handles failed tool", () => {
    render(
      <ToolCallRenderer
        event={{
          toolName: "generateReport",
          status: "failed",
          summary: "fallback",
          source: "mock_fallback",
          fallbackUsed: true,
          evidenceIds: [],
          warnings: ["api down"],
          data: { sections: [] },
        }}
      />,
    );

    expect(screen.getAllByText(/fallback/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/warnings: api down/i)).toBeInTheDocument();
  });

  test("renderer handles fallback metadata", () => {
    render(
      <ToolCallRenderer
        event={{
          toolName: "evaluateSignals",
          status: "succeeded",
          summary: "ok",
          source: "mock_fallback",
          fallbackUsed: true,
          evidenceIds: [],
          warnings: [],
          data: { distribution: { positive: 1, neutral: 1, negative: 1 } },
        }}
      />,
    );

    expect(screen.getAllByText(/fallback/i).length).toBeGreaterThan(0);
  });

  test("renderer displays evidence ids", () => {
    render(
      <ToolCallRenderer
        event={{
          toolName: "getEvidenceTimeline",
          status: "succeeded",
          summary: "ok",
          source: "mock",
          fallbackUsed: false,
          evidenceIds: ["ev-1", "ev-2"],
          warnings: [],
          data: { points: [] },
        }}
      />,
    );

    expect(screen.getByText(/evidence: ev-1, ev-2/i)).toBeInTheDocument();
  });

  test("no trading tool exists", () => {
    const names = workspaceTools.map((tool) => tool.name.toLowerCase());
    expect(names.some((name) => name.includes("trade") || name.includes("broker"))).toBe(false);
  });
});
