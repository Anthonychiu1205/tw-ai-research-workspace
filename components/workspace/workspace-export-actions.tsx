"use client";

import type { RuntimeSettings, WorkspaceSession } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { exportWorkspaceState, importWorkspaceState } from "@/lib/workspace/export-import";
import { Button } from "@/components/ui/button";

export function WorkspaceExportActions({
  sessions,
  artifacts,
  runtimeSettings,
  onImport,
  onReset,
}: {
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
  onImport: (payload: { sessions: WorkspaceSession[]; artifacts: WorkspaceArtifactRecord[]; runtimeSettings: RuntimeSettings }) => void;
  onReset: () => void;
}) {
  const exportJson = () => exportWorkspaceState({ sessions, artifacts, runtimeSettings });

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
      });
      return;
    }
    window.alert(parsed.error ?? "Invalid backup");
  };

  return (
    <div className="flex flex-wrap gap-2" data-testid="workspace-export-actions">
      <Button type="button" size="sm" variant="outline" onClick={() => void copyBackup()}>
        Export workspace JSON
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={importBackup}>
        Import workspace JSON
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onReset}>
        Reset workspace local state
      </Button>
    </div>
  );
}
