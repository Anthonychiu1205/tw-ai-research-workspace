"use client";

import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ArtifactExportActions({
  artifact,
  onPinToggle,
}: {
  artifact: WorkspaceArtifactRecord;
  onPinToggle?: (artifactId: string, pinned: boolean) => void;
}) {
  const { t } = useI18n();
  const copyJson = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(JSON.stringify(artifact, null, 2));
    }
  };

  const downloadJson = () => {
    if (typeof window === "undefined") return;
    const blob = new Blob([JSON.stringify(artifact, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2" data-testid="artifact-export-actions">
      <Button type="button" size="sm" variant="outline" onClick={() => void copyJson()}>
        {t("artifacts.exportJson")}
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={downloadJson}>
        Download JSON
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onPinToggle?.(artifact.id, !artifact.pinned)}
      >
        {artifact.pinned ? t("artifacts.unpin") : t("artifacts.pin")}
      </Button>
    </div>
  );
}
