"use client";

import type { BackendConnectionState } from "@/lib/schemas/workspace";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/app-shell/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";

function backendLabel(connection: BackendConnectionState | undefined, t: (path: string) => string) {
  if (!connection) return t("backend.statusOptional");
  if (connection.mode === "mock") return t("backend.mockWorkspace");
  if (connection.reachable) return t("backend.apiConnected");
  if (connection.fallbackActive) return t("backend.apiFallback");
  return t("backend.unreachable");
}

export function Topbar({
  mode,
  backendStatus,
  modelLabel,
  connection,
}: {
  mode: "mock" | "api";
  backendStatus?: string;
  modelLabel?: string;
  connection?: BackendConnectionState;
}) {
  const { t } = useI18n();

  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4" data-testid="topbar">
      <div className="text-sm">{t("app.title")}</div>
      <div className="flex items-center gap-2 text-xs">
        <Badge>{backendLabel(connection, t)}</Badge>
        <Badge>
          {t("runtime.mode")}: {mode === "mock" ? t("runtime.mockMode") : t("runtime.apiMode")}
        </Badge>
        <Badge>{t("runtime.backend")}: {connection?.reachable ? t("backend.connected") : t("backend.optional")}</Badge>
        <Badge>{t("runtime.model")}: {modelLabel ?? "mock-research"}</Badge>
        <Badge>{t("disclaimers.syntheticBadge")}</Badge>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
