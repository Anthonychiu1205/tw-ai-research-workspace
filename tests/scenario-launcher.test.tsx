import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { ScenarioLauncher } from "@/components/scenarios/scenario-launcher";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";

describe("scenario launcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders launcher", () => {
    const store = createArtifactStore([]);
    render(<ScenarioLauncher artifactStore={store} />);
    expect(screen.getByTestId("scenario-launcher")).toBeInTheDocument();
  });

  test("lists scenarios", () => {
    const store = createArtifactStore([]);
    render(<ScenarioLauncher artifactStore={store} />);
    expect(screen.getByTestId("scenario-card-analyze_2330")).toBeInTheDocument();
    expect(screen.getByTestId("scenario-card-generate_2330_report")).toBeInTheDocument();
  });

  test("running scenario updates result panel", async () => {
    const store = createArtifactStore([]);
    render(<ScenarioLauncher artifactStore={store} />);

    const firstRunButton = screen.getAllByRole("button", { name: /Run scenario/i })[0];
    fireEvent.click(firstRunButton);

    await waitFor(() => {
      expect(screen.getByTestId("scenario-result-panel")).toBeInTheDocument();
      expect(screen.getByText(/Scenario:/i)).toBeInTheDocument();
    });
  });

  test("onScenarioCompleted callback fires", async () => {
    const store = createArtifactStore([]);
    const calls: string[] = [];

    render(<ScenarioLauncher artifactStore={store} onScenarioCompleted={(id) => calls.push(id)} />);

    const firstRunButton = screen.getAllByRole("button", { name: /Run scenario/i })[0];
    fireEvent.click(firstRunButton);

    await waitFor(() => {
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  test("onArtifactCreated callback fires", async () => {
    const store = createArtifactStore([]);
    const artifactIds: string[] = [];

    render(<ScenarioLauncher artifactStore={store} onArtifactCreated={(id) => artifactIds.push(id)} />);

    const firstRunButton = screen.getAllByRole("button", { name: /Run scenario/i })[0];
    fireEvent.click(firstRunButton);

    await waitFor(() => {
      expect(artifactIds.length).toBeGreaterThan(0);
    });
  });
});
