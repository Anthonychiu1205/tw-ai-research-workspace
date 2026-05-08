"use client";

import { useEffect, useState } from "react";
import type { BackendConnectionState } from "@/lib/schemas/workspace";
import { LanguageSwitcher } from "@/components/app-shell/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";

function backendStatusTone(connection: BackendConnectionState | undefined) {
  if (!connection || connection.mode === "mock") return "mock" as const;
  if (connection.reachable) return "success" as const;
  if (connection.fallbackActive) return "warning" as const;
  return "danger" as const;
}

export function Topbar({
  mode,
  modelLabel,
  connection,
}: {
  mode: "mock" | "api";
  backendStatus?: string;
  modelLabel?: string;
  connection?: BackendConnectionState;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runtimeLabel = mounted ? (mode === "mock" ? t("runtime.mockMode") : t("runtime.apiMode")) : t("runtime.initializing");
  const backendLabel = mounted
    ? connection?.mode === "mock"
      ? t("backend.optional")
      : connection?.reachable
        ? t("backend.connected")
        : connection?.fallbackActive
          ? t("runtime.fallback")
          : t("backend.unreachable")
    : t("backend.checking");
  const modelText = mounted ? modelLabel ?? "mock-research" : "—";
  const backendTone = mounted ? backendStatusTone(connection) : "neutral";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4" data-testid="topbar">
      <div>
        <div className="text-sm font-semibold">{t("app.title")}</div>
        <p className="text-[11px] text-muted-foreground">{t("runtime.mockFirst")} · {t("runtime.localOnly")}</p>
      </div>

      <div className="flex items-center gap-2 text-xs" data-testid="topbar-core-statuses">
        <StatusBadge tone={mode === "mock" ? "mock" : "backend"} className="topbar-status">
          {t("runtime.mode")}: {runtimeLabel}
        </StatusBadge>
        <StatusBadge tone={backendTone} className="topbar-status">
          {t("runtime.backend")}: {backendLabel}
        </StatusBadge>
        <StatusBadge tone="trace" className="topbar-status">
          {t("runtime.model")}: {modelText}
        </StatusBadge>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
