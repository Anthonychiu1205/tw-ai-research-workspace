import { useI18n } from "@/lib/i18n/use-i18n";

export function QuickstartChecklist() {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-4" data-testid="quickstart-checklist">
      <div className="text-sm font-semibold">{t("onboarding.quickstartTitle")}</div>
      <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
        <li>{t("onboarding.quickstartLine1")}</li>
        <li>{t("onboarding.quickstartLine2")}</li>
        <li>{t("onboarding.quickstartLine3")}</li>
        <li>{t("onboarding.quickstartLine4")}</li>
      </ul>
    </div>
  );
}
