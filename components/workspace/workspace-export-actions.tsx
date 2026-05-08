"use client";

import type { RuntimeSettings, WorkspaceSession } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { useState } from "react";
import {
  exportWorkspaceShareBundle,
  exportWorkspaceState,
  importWorkspaceShareBundle,
  importWorkspaceState,
} from "@/lib/workspace/export-import";
import { Button } from "@/components/ui/button";
import { InlineFeedback } from "@/components/ui/inline-feedback";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const { t } = useI18n();
  const [feedback, setFeedback] = useState<{ tone: "success" | "warning" | "danger"; message: string; detail?: string } | null>(null);
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
    setFeedback({ tone: "success", message: t("common.completed"), detail: "Workspace JSON copied" });
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
      setFeedback({ tone: "success", message: t("common.completed"), detail: "Workspace JSON imported" });
      return;
    }
    setFeedback({ tone: "danger", message: t("errors.generic"), detail: parsed.error ?? "Invalid backup" });
  };

  const copyShareBundle = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(exportShare());
    setFeedback({ tone: "success", message: t("common.completed"), detail: "Share bundle copied" });
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
      setFeedback({ tone: "success", message: t("common.completed"), detail: "Share bundle imported" });
      return;
    }
    setFeedback({ tone: "danger", message: t("errors.generic"), detail: parsed.error ?? "Invalid share bundle" });
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
    setFeedback({ tone: "success", message: t("common.completed"), detail: "Bundle summary copied" });
  };

  return (
    <div className="flex flex-wrap gap-2" data-testid="workspace-export-actions">
      {feedback ? (
        <div className="w-full">
          <InlineFeedback tone={feedback.tone} message={feedback.message} detail={feedback.detail} />
        </div>
      ) : null}
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
