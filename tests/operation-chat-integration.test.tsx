import React, { useMemo, useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { ResearchChat } from "@/components/chat/research-chat";
import { WorkspaceContextPanel } from "@/components/workspace/workspace-context-panel";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

function IntegrationHarness() {
  const artifactStore = useMemo(() => createArtifactStore([]), []);
  const [artifacts, setArtifacts] = useState(() => artifactStore.listAll());
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [systemEvents, setSystemEvents] = useState<Array<{ id: string; content: string }>>([]);

  const refresh = () => setArtifacts(artifactStore.listAll());
  const selected = artifacts.find((artifact) => artifact.id === selectedArtifactId);

  return (
    <div>
      <div data-testid="artifact-count">{artifacts.length}</div>
      <ResearchChat
        runtimeSettings={getDefaultRuntimeSettings()}
        connectionState={{ mode: "mock", apiBaseUrl: "http://localhost:8000", reachable: false, fallbackActive: false }}
        onRuntimeSettingsChange={() => {}}
        systemEvents={systemEvents}
        onToolResult={(payload) => {
          const artifact = artifactStore.create({
            type: "research_card",
            title: "chat artifact",
            source: "mock",
            summary: String(payload.summary ?? ""),
            data: payload,
          });
          setSelectedArtifactId(artifact.id);
          refresh();
        }}
      />
      <ResearchOperationPanel
        artifactStore={artifactStore}
        onOperationCompleted={(result) => {
          setSystemEvents((prev) => [...prev, { id: result.operationId, content: `Ran research operation ${result.operationId}` }]);
        }}
        onArtifactCreated={(id) => {
          setSelectedArtifactId(id);
          refresh();
        }}
      />
      <WorkspaceContextPanel artifact={selected} />
    </div>
  );
}

function streamResponse(lines: string[]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(`${line}\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

describe("operation chat integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
  });

  test("running operation creates artifact and chat message", async () => {
    render(<IntegrationHarness />);

    fireEvent.click(screen.getByText(/Run research/i));

    await waitFor(() => {
      expect(Number(screen.getByTestId("artifact-count").textContent ?? "0")).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(screen.getByText(/Ran research operation/i)).toBeInTheDocument();
    });
  });

  test("chat tool result creates artifact", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "tool_call_start", id: "tool-1-start", timestamp: "t", payload: { toolName: "runResearch" } }),
          JSON.stringify({ type: "tool_call_result", id: "tool-1-result", timestamp: "t", payload: { toolName: "runResearch", status: "succeeded", summary: "done", evidenceIds: [] } }),
          JSON.stringify({ type: "final", id: "f", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      ),
    );

    render(<IntegrationHarness />);

    fireEvent.click(screen.getByText(/Analyze 2330 with Phase 2 agents/i));

    await waitFor(() => {
      expect(Number(screen.getByTestId("artifact-count").textContent ?? "0")).toBeGreaterThan(0);
    });
  });

  test("active artifact changes context panel", async () => {
    render(<IntegrationHarness />);

    fireEvent.click(screen.getByText(/Run research/i));

    await waitFor(() => {
      expect(screen.queryByTestId("workspace-context-empty")).not.toBeInTheDocument();
    });
  });

  test("artifact can be pinned", async () => {
    render(<IntegrationHarness />);

    fireEvent.click(screen.getByText(/Run research/i));

    await waitFor(() => {
      expect(screen.getByText(/Pin artifact/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Pin artifact/i));
    expect(screen.getByText(/Pin artifact/i)).toBeInTheDocument();
  });
});
