import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { ArtifactDetailPanel } from "@/components/workspace/artifact-detail-panel";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

const artifact: WorkspaceArtifactRecord = {
  id: "artifact-report-1",
  type: "report",
  title: "2330 report",
  summary: "Synthetic report summary",
  createdAt: "2026-05-08T10:00:00.000Z",
  source: "mock",
  synthetic: true,
  notFinancialAdvice: true,
  noTradingExecution: true,
  evidenceIds: ["ev-1"],
  relatedArtifactIds: [],
  pinned: false,
  data: {
    sections: [
      { title: "overview", content: "synthetic" },
      { title: "risk", content: "non-advice" },
    ],
  },
};

describe("artifact readability", () => {
  test("artifact detail favors semantic content and keeps raw json collapsed", () => {
    render(
      <I18nProvider>
        <ArtifactDetailPanel artifact={artifact} />
      </I18nProvider>,
    );

    expect(screen.getByTestId("artifact-detail-panel")).toBeInTheDocument();
    expect(screen.getAllByText(/Research Report|研究報告/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Raw JSON/i)).toBeInTheDocument();
  });
});
