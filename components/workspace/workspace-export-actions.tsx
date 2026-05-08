"use client";

import type { RuntimeSettings, WorkspaceSession } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import {
  exportWorkspaceShareBundle,
  exportWorkspaceState,
  importWorkspaceShareBundle,
  importWorkspaceState,
} from "@/lib/workspace/export-import";
import { Button } from "@/components/ui/button";

export function WorkspaceExportActions({
  sessions,
  artifacts,
  runtimeSettings,
  scenariosCompleted,
  onImport,
  onReset,
}: {
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
  scenariosCompleted?: string[];
  onImport: (payload: {
    sessions: WorkspaceSession[];
    artifacts: WorkspaceArtifactRecord[];
    runtimeSettings: RuntimeSettings;
    scenariosCompleted?: string[];
  }) => void;
  onReset: () => void;
}) {
  const exportJson = () => exportWorkspaceState({ sessions, artifacts, runtimeSettings });
  const exportShare = () =>
    exportWorkspaceShareBundle({
      sessions,
      artifacts,
      runtimeSettings,
      scenariosCompleted: scenariosCompleted ?? [],
      source: runtimeSettings.mode === "api" ? "api" : "mock",
      synthetic: runtimeSettings.mode !== "api",
    });

  const copyBackup = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(exportJson());
  };

  const importBackup = () => {
    if (typeof window === "undefined") return;
    const raw = window.prompt("Paste workspace backup JSON");
    if (!raw) return;
    const parsed = importWorkspaceState(raw);
    if (parsed.ok && parsed.value) {
      onImport({
        sessions: parsed.value.sessions,
        artifacts: parsed.value.artifacts,
        runtimeSettings: parsed.value.runtimeSettings,
        scenariosCompleted: [],
      });
      return;
    }
    window.alert(parsed.error ?? "Invalid backup");
  };

  const copyShareBundle = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(exportShare());
  };

  const importShareBundle = () => {
    if (typeof window === "undefined") return;
    const raw = window.prompt("Paste workspace share bundle JSON");
    if (!raw) return;
    const parsed = importWorkspaceShareBundle(raw);
    if (parsed.ok && parsed.value) {
      onImport({
        sessions: parsed.value.sessions,
        artifacts: parsed.value.artifacts,
        runtimeSettings: parsed.value.runtimeSettings,
        scenariosCompleted: parsed.value.scenariosCompleted,
      });
      return;
    }
    window.alert(parsed.error ?? "Invalid share bundle");
  };

  const copyBundleSummary = async () => {
    const summary = {
      sessions: sessions.length,
      artifacts: artifacts.length,
      scenariosCompleted: (scenariosCompleted ?? []).length,
      runtimeMode: runtimeSettings.mode,
      source: runtimeSettings.mode === "api" ? "api" : "mock",
      notFinancialAdvice: true,
      noTradingExecution: true,
    };
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
  };

  return (
    <div className="flex flex-wrap gap-2" data-testid="workspace-export-actions">
      <Button type="button" size="sm" variant="outline" onClick={() => void copyBackup()}>
        Export workspace JSON
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={importBackup}>
        Import workspace JSON
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => void copyShareBundle()}>
        Export share bundle
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={importShareBundle}>
        Import share bundle
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => void copyBundleSummary()}>
        Copy bundle summary
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onReset}>
        Reset workspace local state
      </Button>
    </div>
  );
}
