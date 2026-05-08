import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { ArtifactDetailPanel } from "@/components/workspace/artifact-detail-panel";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";

describe("artifact workbench", () => {
  test("artifact browser renders", () => {
    const store = createArtifactStore([]);
    const artifacts = store.listAll();

    render(<ArtifactBrowser artifacts={artifacts} />);
    expect(screen.getByTestId("artifact-browser")).toBeInTheDocument();
  });

  test("artifact detail renders metadata", () => {
    const store = createArtifactStore([]);
    const artifact = store.create({ type: "report", title: "Synthetic report", source: "mock", data: { sections: [] } });

    render(<ArtifactDetailPanel artifact={artifact} />);
    expect(screen.getByTestId("artifact-metadata-card")).toBeInTheDocument();
  });

  test("pin/unpin works", () => {
    const store = createArtifactStore([]);
    const artifact = store.create({ type: "report", title: "Synthetic report", source: "mock" });

    store.pin(artifact.id);
    expect(store.get(artifact.id)?.pinned).toBe(true);
    store.unpin(artifact.id);
    expect(store.get(artifact.id)?.pinned).toBe(false);
  });

  test("export/import works", () => {
    const store = createArtifactStore([]);
    store.create({ type: "report", title: "Synthetic report", source: "mock" });

    const exported = store.exportJson();
    const another = createArtifactStore([]);
    const result = another.importJson(exported);
    expect(result.imported).toBeGreaterThan(0);
  });

  test("corrupted storage fallback", () => {
    window.localStorage.setItem("tw-ai-research-workspace:artifacts", "bad-json");
    const store = createArtifactStore([]);
    expect(store.listAll().length).toBeGreaterThan(0);
  });

  test("synthetic/mock metadata visible", () => {
    const store = createArtifactStore([]);
    const artifact = store.create({ type: "report", title: "Synthetic report", source: "mock", synthetic: true });
    render(<ArtifactDetailPanel artifact={artifact} />);
    expect(screen.getByTestId("artifact-metadata-card")).toHaveTextContent(/mock|synthetic|非投資建議/i);
  });

  test("evidence ids visible", () => {
    const store = createArtifactStore([]);
    const artifact = store.create({
      type: "report",
      title: "Synthetic report",
      source: "mock",
      evidenceIds: ["ev-1", "ev-2"],
    });
    render(<ArtifactDetailPanel artifact={artifact} />);
    expect(screen.getByText(/evidence ids|證據引用/i)).toBeInTheDocument();
    expect(screen.getByText("ev-1")).toBeInTheDocument();
    expect(screen.getByText("ev-2")).toBeInTheDocument();
  });

  test("artifact browser select action", () => {
    const store = createArtifactStore([]);
    const artifact = store.create({ type: "report", title: "Synthetic report", source: "mock" });
    let selected = "";

    render(
      <ArtifactBrowser
        artifacts={[artifact]}
        selectedArtifactId={null}
        onSelect={(id) => {
          selected = id;
        }}
      />,
    );

    fireEvent.click(screen.getByText(/Open|開啟 artifact/i));
    expect(selected).toBe(artifact.id);
  });
});
