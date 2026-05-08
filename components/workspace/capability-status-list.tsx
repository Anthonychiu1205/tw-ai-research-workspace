import type { CapabilityStatus } from "@/lib/availability/availability-types";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

function toneForCapability(status: CapabilityStatus) {
  if (!status.available && status.fallbackAvailable) return "warning" as const;
  if (!status.available) return "danger" as const;
  if (status.mode === "api") return "backend" as const;
  return "success" as const;
}

export function CapabilityStatusList({ capabilities }: { capabilities: CapabilityStatus[] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-2" data-testid="capability-status-list">
      {capabilities.map((item) => (
        <div key={item.id} className="rounded-md border border-border bg-white px-2.5 py-2 text-xs">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="font-medium">{item.label}</div>
            <StatusBadge tone={toneForCapability(item)}>{item.available ? t("common.available") : t("common.unavailable")}</StatusBadge>
          </div>
          <div className="text-muted-foreground">{item.description}</div>
          {item.reason ? <div className="mt-1 text-amber-700">{item.reason}</div> : null}
          {!item.available && item.fallbackAvailable ? <div className="mt-1 text-slate-600">{t("backend.fallback")}</div> : null}
        </div>
      ))}
    </div>
  );
}
