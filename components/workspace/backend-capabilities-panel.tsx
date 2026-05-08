import type { BackendCapabilitiesReport } from "@/lib/api/capabilities";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

export function BackendCapabilitiesPanel({ report }: { report: BackendCapabilitiesReport }) {
  const { t } = useI18n();
  const categories = Array.from(new Set(report.capabilities.map((capability) => capability.category)));

  return (
    <Panel className="space-y-2" data-testid="backend-capabilities-panel">
      <div className="flex items-center justify-between">
        <SectionHeading title={t("backend.capabilitiesTitle")} />
        <StatusBadge tone={report.mode === "mock" ? "mock" : "backend"}>{report.mode}</StatusBadge>
      </div>
      <div className="text-xs text-muted-foreground">{t("backend.baseUrl")}: {report.baseUrl}</div>
      <div className="text-xs">{t("backend.reachable")}: {report.reachable ? t("common.yes") : t("common.no")}</div>
      {report.fallbackActive ? <div className="text-xs text-amber-700">{t("backend.fallbackActive")}</div> : null}
      {report.mode === "api" && !report.reachable ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          {t("backend.apiFallback")}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-1 text-xs">
        {categories.map((category) => (
          <StatusBadge key={category} tone="backend">{category}</StatusBadge>
        ))}
      </div>
      {report.warnings.map((warning) => (
        <div key={warning} className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          {warning}
        </div>
      ))}
      <details className="rounded-md border border-border bg-muted/40 p-2" data-testid="backend-capabilities-details">
        <summary className="cursor-pointer text-xs font-medium">
          {t("backend.capabilitiesTitle")} ({report.capabilities.length})
        </summary>
        <div className="mt-2 space-y-1">
          {report.capabilities.map((capability) => (
            <div key={capability.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted/35">
              <div>
                <div>{capability.label}</div>
                <div className="text-muted-foreground">{capability.method} {capability.endpoint}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone="backend">{capability.category}</StatusBadge>
                <StatusBadge tone={capability.available ? "success" : "danger"}>
                  {capability.available ? t("common.available") : t("common.unavailable")}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </details>
      {report.missing.length > 0 ? (
        <div className="text-xs text-amber-700">{t("common.missing")}: {report.missing.join(", ")}</div>
      ) : null}
    </Panel>
  );
}
