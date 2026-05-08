import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { WorkspaceExportActions } from "@/components/workspace/workspace-export-actions";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

function createProps() {
  return {
    sessions: [
      {
        id: "s1",
        title: "session",
        schemaVersion: "workspace-session.v0.2" as const,
        runtimeMode: "mock" as const,
        modelId: "mock-research",
        provider: "mock" as const,
        messages: [],
        artifacts: [],
        updatedAt: "2026-05-08T00:00:00.000Z",
      },
    ],
    artifacts: [
      {
        id: "a1",
        type: "report" as const,
        kind: "report" as const,
        title: "report",
        createdAt: "2026-05-08T00:00:00.000Z",
        source: "mock" as const,
        synthetic: true,
        notFinancialAdvice: true as const,
        noTradingExecution: true as const,
        evidenceIds: [],
        relatedArtifactIds: [],
        pinned: false,
      },
    ],
    runtimeSettings: getDefaultRuntimeSettings(),
    scenariosCompleted: ["analyze_2330"],
    onImport: vi.fn(),
    onReset: vi.fn(),
  };
}

describe("workspace export actions share", () => {
  test("renders share actions", () => {
    const props = createProps();
    render(<WorkspaceExportActions {...props} />);
    expect(screen.getByRole("button", { name: /Export share bundle/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Import share bundle/i })).toBeInTheDocument();
  });

  test("copy bundle summary action renders", () => {
    const props = createProps();
    render(<WorkspaceExportActions {...props} />);
    expect(screen.getByRole("button", { name: /Copy bundle summary/i })).toBeInTheDocument();
  });

  test("reset action invokes callback", () => {
    const props = createProps();
    render(<WorkspaceExportActions {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Reset workspace local state/i }));
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });

  test("import workspace JSON handles invalid input safely", () => {
    const props = createProps();
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("bad-json");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<WorkspaceExportActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /Import workspace JSON/i }));

    expect(alertSpy).toHaveBeenCalled();
    promptSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
