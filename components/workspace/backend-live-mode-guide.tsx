import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function BackendLiveModeGuide({
  apiBaseUrl,
  fallbackActive,
  onTestConnection,
}: {
  apiBaseUrl: string;
  fallbackActive: boolean;
  onTestConnection?: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-md border p-3 text-xs" data-testid="backend-live-mode-guide">
      <div className="text-sm font-medium">{t("backend.liveModeGuideTitle")}</div>
      <div className="text-muted-foreground">{t("runtime.apiBaseUrl")}: {apiBaseUrl}</div>
      <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
        <li>{t("backend.liveStepStart")}</li>
        <li>{t("backend.liveStepMode")}</li>
        <li>{t("backend.liveStepBridge")}</li>
        <li>{t("backend.liveStepTest")}</li>
      </ol>
      <div className="rounded border border-amber-200 bg-amber-50 p-2 text-amber-800">
        {fallbackActive
          ? t("backend.liveFallbackActive")
          : t("backend.liveFallbackReady")}
      </div>
      <div className="text-muted-foreground">{t("disclaimers.noTrading")}</div>
      {onTestConnection ? (
        <Button type="button" size="sm" variant="outline" onClick={onTestConnection} aria-label="Test backend live mode connection">
          {t("backend.testConnection")}
        </Button>
      ) : null}
    </div>
  );
}
