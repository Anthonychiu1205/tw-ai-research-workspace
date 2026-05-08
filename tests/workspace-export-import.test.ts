import { describe, expect, test } from "vitest";
import { createWorkspaceBackup, exportWorkspaceState, importWorkspaceState } from "@/lib/workspace/export-import";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

describe("workspace export/import", () => {
  const sample = {
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
        title: "synthetic report",
        createdAt: "2026-05-08T00:00:00.000Z",
        source: "mock" as const,
        synthetic: true,
        notFinancialAdvice: true as const,
        noTradingExecution: true as const,
        evidenceIds: ["ev-1"],
        relatedArtifactIds: [],
        pinned: false,
      },
    ],
    runtimeSettings: getDefaultRuntimeSettings(),
  };

  test("export/import roundtrip", () => {
    const raw = exportWorkspaceState(sample);
    const restored = importWorkspaceState(raw);
    expect(restored.ok).toBe(true);
    if (restored.ok && restored.value) {
      expect(restored.value.sessions.length).toBe(1);
      expect(restored.value.artifacts.length).toBe(1);
    }
  });

  test("invalid schema rejected", () => {
    const raw = JSON.stringify({ schemaVersion: "bad", sessions: [], artifacts: [], runtimeSettings: {} });
    const restored = importWorkspaceState(raw);
    expect(restored.ok).toBe(false);
  });

  test("missing sessions/artifacts handled", () => {
    const backup = createWorkspaceBackup(sample);
    const raw = JSON.stringify({ ...backup, sessions: undefined, artifacts: undefined });
    const restored = importWorkspaceState(raw);
    expect(restored.ok).toBe(true);
    if (restored.ok && restored.value) {
      expect(Array.isArray(restored.value.sessions)).toBe(true);
      expect(Array.isArray(restored.value.artifacts)).toBe(true);
    }
  });

  test("metadata preserved", () => {
    const backup = createWorkspaceBackup(sample);
    expect(backup.schemaVersion).toBe("workspace-backup.v0.3");
    expect(typeof backup.exportedAt).toBe("string");
  });
});
