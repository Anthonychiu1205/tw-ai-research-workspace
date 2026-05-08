import type { BackendCapabilitiesReport } from "@/lib/api/capabilities";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function BackendCapabilitiesPanel({ report }: { report: BackendCapabilitiesReport }) {
  const { t } = useI18n();
  const categories = Array.from(new Set(report.capabilities.map((capability) => capability.category)));

  return (
    <div className="space-y-2 rounded-lg border border-border/80 bg-workspace-panel p-3" data-testid="backend-capabilities-panel">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{t("backend.capabilitiesTitle")}</div>
        <StatusBadge tone={report.mode === "mock" ? "mock" : "backend"}>{report.mode}</StatusBadge>
      </div>
      <div className="text-xs text-muted-foreground">{t("backend.baseUrl")}: {report.baseUrl}</div>
      <div className="text-xs">{t("backend.reachable")}: {report.reachable ? t("common.yes") : t("common.no")}</div>
      {report.fallbackActive ? <div className="text-xs text-orange-300">{t("backend.fallbackActive")}</div> : null}
      {report.mode === "api" && !report.reachable ? (
        <div className="rounded border border-orange-500/30 bg-orange-500/10 p-2 text-xs">
          {t("backend.apiFallback")}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-1 text-xs">
        {categories.map((category) => (
          <StatusBadge key={category} tone="backend">{category}</StatusBadge>
        ))}
      </div>
      {report.warnings.map((warning) => (
        <div key={warning} className="rounded border border-orange-500/30 bg-orange-500/10 p-2 text-xs">
          {warning}
        </div>
      ))}
      <div className="space-y-1">
        {report.capabilities.map((capability) => (
          <div key={capability.id} className="flex items-center justify-between rounded border p-2 text-xs">
            <div>
              <div>{capability.label}</div>
              <div className="text-muted-foreground">{capability.method} {capability.endpoint}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge tone="backend">{capability.category}</StatusBadge>
              <StatusBadge tone={capability.available ? "success" : "danger"}>{capability.available ? t("common.available") : t("common.unavailable")}</StatusBadge>
            </div>
          </div>
        ))}
      </div>
      {report.missing.length > 0 ? (
        <div className="text-xs text-orange-300">{t("common.missing")}: {report.missing.join(", ")}</div>
      ) : null}
    </div>
  );
}
