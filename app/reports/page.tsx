"use client";

import report from "@/fixtures/mock-api/report.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { ReportViewer } from "@/components/workspace/report-viewer";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function ReportsPage() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">{t("reports.syntheticViewer")}</h1>
        <p className="text-sm text-muted-foreground">{t("disclaimers.nonAdvice")}</p>
        <ReportViewer sections={report.sections} />
      </div>
    </AppShell>
  );
}
