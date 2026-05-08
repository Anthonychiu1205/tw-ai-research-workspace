import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ReportViewer } from "@/components/workspace/report-viewer";

describe("evidence and report interaction", () => {
  test("report section renders evidence ids", () => {
    render(
      <ReportViewer
        sections={[{ id: "s1", title: "Synthetic overview", content: "summary", evidenceIds: ["ev-1", "ev-2"] }]}
        timelinePoints={[{ id: "ev-1", at: "2026-05-01", label: "A", note: "N" }]}
      />,
    );

    expect(screen.getAllByText("ev-1").length).toBeGreaterThan(0);
    expect(screen.getByText("ev-2")).toBeInTheDocument();
  });

  test("clicking evidence id selects timeline item", () => {
    render(
      <ReportViewer
        sections={[{ id: "s1", title: "Synthetic overview", content: "summary", evidenceIds: ["ev-1"] }]}
        timelinePoints={[{ id: "ev-1", at: "2026-05-01", label: "A", note: "N" }]}
      />,
    );

    fireEvent.click(screen.getAllByText("ev-1")[0]);
    expect(screen.getByText(/selected|已選擇/i)).toBeInTheDocument();
  });

  test("missing evidence warning appears", () => {
    render(
      <ReportViewer
        sections={[{ id: "s1", title: "Synthetic overview", content: "summary", evidenceIds: [] }]}
        timelinePoints={[]}
      />,
    );

    expect(screen.getByText(/unavailable for this section/i)).toBeInTheDocument();
  });

  test("disclaimer visible", () => {
    render(
      <ReportViewer
        sections={[
          {
            id: "s1",
            title: "Limitations",
            content: "This output is not financial advice and no trading execution.",
            evidenceIds: [],
          },
        ]}
        timelinePoints={[]}
      />,
    );

    expect(screen.getAllByText(/not financial advice/i).length).toBeGreaterThan(0);
  });

  test("no buy/sell recommendation wording", () => {
    render(
      <ReportViewer
        sections={[{ id: "s1", title: "Synthetic overview", content: "workspace-only synthetic summary", evidenceIds: [] }]}
        timelinePoints={[]}
      />,
    );

    expect(screen.queryByText(/buy recommendation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sell recommendation/i)).not.toBeInTheDocument();
  });
});
