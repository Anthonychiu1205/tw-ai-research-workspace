import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { MessageComposer } from "@/components/chat/message-composer";
import { StatusBadge } from "@/components/ui/status-badge";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

describe("text overflow smoke", () => {
  test("artifact labels render full localized labels", () => {
    const artifacts: WorkspaceArtifactRecord[] = [
      {
        id: "a1",
        type: "research_card",
        title: "2330 研究卡片",
        createdAt: "2026-05-08T00:00:00.000Z",
        source: "mock",
        synthetic: true,
        notFinancialAdvice: true,
        noTradingExecution: true,
        evidenceIds: [],
        relatedArtifactIds: [],
        pinned: false,
      },
      {
        id: "a2",
        type: "pipeline_trace",
        title: "2330 Pipeline 軌跡",
        createdAt: "2026-05-08T00:00:00.000Z",
        source: "mock",
        synthetic: true,
        notFinancialAdvice: true,
        noTradingExecution: true,
        evidenceIds: [],
        relatedArtifactIds: [],
        pinned: false,
      },
    ];

    render(<ArtifactBrowser artifacts={artifacts} selectedArtifactId={null} />);

    expect(screen.getAllByText("研究卡片").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pipeline 軌跡").length).toBeGreaterThan(0);
  });

  test("composer send button remains visible", () => {
    render(<MessageComposer value="hello" onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: /送出|Send/i })).toBeInTheDocument();
  });

  test("status badge uses no-wrap classes for compact Chinese labels", () => {
    const { container } = render(<StatusBadge tone="mock">研究報告</StatusBadge>);
    const el = container.querySelector("span");
    expect(el?.className).toContain("whitespace-nowrap");
  });
});
