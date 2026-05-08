import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";

export function WelcomePanel({
  onStart2330,
  onCompareWatchlist,
  onOpenTrace,
  onConnectBackend,
}: {
  onStart2330: () => void;
  onCompareWatchlist: () => void;
  onOpenTrace: () => void;
  onConnectBackend: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4" data-testid="welcome-panel">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold">{t("onboarding.welcomeTitle")}</div>
        <StatusBadge tone="mock">{t("runtime.mockFirst")}</StatusBadge>
      </div>
      <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
        <li>{t("onboarding.welcomeLine1")}</li>
        <li>{t("onboarding.welcomeLine2")}</li>
        <li>{t("disclaimers.nonAdvice")}</li>
        <li>{t("onboarding.welcomeLine3")}</li>
        <li>{t("onboarding.welcomeLine4")}</li>
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onStart2330}>{t("onboarding.start2330")}</Button>
        <Button type="button" size="sm" variant="outline" onClick={onCompareWatchlist}>{t("onboarding.compareWatchlist")}</Button>
        <Button type="button" size="sm" variant="outline" onClick={onOpenTrace}>{t("onboarding.openTrace")}</Button>
        <Button type="button" size="sm" variant="outline" onClick={onConnectBackend}>{t("onboarding.connectBackend")}</Button>
      </div>
    </div>
  );
}
