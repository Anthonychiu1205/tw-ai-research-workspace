import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ArtifactLineage({ artifact }: { artifact: WorkspaceArtifactRecord }) {
  const { t } = useI18n();
  return (
    <div className="space-y-1 rounded-md border border-border bg-slate-50 p-3 text-xs" data-testid="artifact-lineage">
      <div className="font-medium">Lineage</div>
      <div>operationId: {artifact.lineage?.operationId ?? "n/a"}</div>
      <div>toolCallId: {artifact.lineage?.toolCallId ?? "n/a"}</div>
      <div>source artifacts: {(artifact.lineage?.sourceArtifactIds ?? []).join(", ") || "n/a"}</div>
      <div className="pt-1 text-[11px] text-muted-foreground">{t("disclaimers.noTrading")}</div>
    </div>
  );
}
