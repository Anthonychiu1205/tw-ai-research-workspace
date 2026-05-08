import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ResearchChat } from "@/components/chat/research-chat";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { RuntimeSettingsPanel } from "@/components/workspace/runtime-settings-panel";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import { CommandMenu } from "@/components/app-shell/command-menu";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";
import { getModelOptions } from "@/lib/config/models";

describe("a11y smoke", () => {
  test("ResearchChat renders labels", () => {
    render(
      <ResearchChat
        runtimeSettings={getDefaultRuntimeSettings()}
        connectionState={{ mode: "mock", apiBaseUrl: "http://localhost:8000", reachable: false, fallbackActive: false }}
        onRuntimeSettingsChange={() => {}}
      />,
    );

    expect(screen.getByLabelText(/Runtime mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Research prompt/i)).toBeInTheDocument();
  });

  test("ResearchOperationPanel renders", () => {
    const store = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={store} />);
    expect(screen.getByTestId("research-operation-panel")).toBeInTheDocument();
    expect(screen.getByLabelText(/Research ticker/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Report ticker/i)).toBeInTheDocument();
  });

  test("ArtifactBrowser renders", () => {
    const store = createArtifactStore([]);
    render(<ArtifactBrowser artifacts={store.listAll()} />);
    expect(screen.getByTestId("artifact-browser")).toBeInTheDocument();
    expect(screen.getByLabelText(/Artifact type filter/i)).toBeInTheDocument();
  });

  test("RuntimeSettingsPanel renders labels", () => {
    render(
      <RuntimeSettingsPanel
        settings={getDefaultRuntimeSettings()}
        models={getModelOptions()}
        onChange={() => {}}
        onReset={() => {}}
        onCheckBackend={() => {}}
      />,
    );

    expect(screen.getByLabelText(/API base URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API bridge mode/i)).toBeInTheDocument();
  });

  test("CommandMenu renders", () => {
    render(
      <CommandMenu
        open
        commands={[
          {
            id: "c1",
            label: "Analyze 2330",
            description: "run",
            category: "operations",
            run: () => {},
          },
        ] as any}
        onRun={() => {}}
      />,
    );

    expect(screen.getByLabelText(/Command search/i)).toBeInTheDocument();
  });

  test("BackendConnectionCard status has text", () => {
    render(
      <BackendConnectionCard
        state={{ mode: "mock", apiBaseUrl: "http://localhost:8000", reachable: false, fallbackActive: false }}
      />,
    );
    expect(screen.getByText(/Mock workspace|API fallback|API connected/i)).toBeInTheDocument();
  });
});
