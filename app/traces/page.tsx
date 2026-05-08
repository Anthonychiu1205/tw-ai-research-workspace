"use client";

import pipeline from "@/fixtures/mock-api/pipeline-result.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function TracesPage() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">{t("app.traces")}</h1>
        <p className="text-sm text-muted-foreground">{t("trace.reflectionChecks")}</p>
        <PlannerTraceViewer
          plan={pipeline.plan}
          execution={pipeline.execution}
          reflection={pipeline.reflection}
        />
      </div>
    </AppShell>
  );
}
