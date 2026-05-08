import { useI18n } from "@/lib/i18n/use-i18n";

export function WorkspaceModeExplainer() {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-border bg-white p-4 text-xs text-muted-foreground" data-testid="workspace-mode-explainer">
      {t("runtime.mode")}: <strong>mock</strong> / <strong>api</strong>。{t("backend.liveFallbackReady")}
    </div>
  );
}
