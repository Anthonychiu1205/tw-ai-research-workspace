"use client";

import { useEffect, useState } from "react";
import type { BackendConnectionState } from "@/lib/schemas/workspace";
import type { LiveIntegrationSnapshot } from "@/lib/utils/live-integration-cache";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";

function formatCheckedAt(iso: string): string {
  return iso.replace("T", " ").slice(0, 19);
}

export function BackendConnectionCard({
  state,
  lastLiveIntegration,
  onRefresh,
}: {
  state: BackendConnectionState;
  lastLiveIntegration?: LiveIntegrationSnapshot | null;
  onRefresh?: () => void;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusLabel = !mounted
    ? t("backend.checking")
    : state.mode === "mock"
      ? t("backend.mockWorkspace")
      : state.reachable
        ? t("backend.apiConnected")
        : state.fallbackActive
          ? t("backend.apiFallback")
          : t("backend.unreachable");
  const statusTone = !mounted ? "neutral" : state.mode === "mock" ? "mock" : state.reachable ? "success" : state.fallbackActive ? "warning" : "danger";

  return (
    <div className="space-y-3 rounded-lg border border-border/80 bg-workspace-panel p-3" data-testid="backend-connection-card">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{t("backend.connectionCardTitle")}</div>
        <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
      </div>
      <div className="text-xs text-muted-foreground">{t("backend.baseUrl")}: {state.apiBaseUrl}</div>
      <div className="flex flex-wrap gap-2 text-xs">
        <StatusBadge tone={state.reachable ? "success" : "danger"}>{state.reachable ? t("backend.connected") : t("backend.unreachable")}</StatusBadge>
        {mounted && state.checkedAt ? <StatusBadge tone="neutral">{t("backend.lastChecked")}: {formatCheckedAt(state.checkedAt)}</StatusBadge> : null}
        {mounted && state.appTitle ? <StatusBadge tone="neutral">{state.appTitle}</StatusBadge> : null}
        {mounted && state.fallbackActive ? <StatusBadge tone="warning">{t("backend.fallback")}</StatusBadge> : null}
      </div>
      {mounted && state.error ? <div className="rounded border border-orange-500/30 bg-orange-500/10 p-2 text-xs">{state.error}</div> : null}
      {state.fallbackReason ? (
        <div className="rounded border border-orange-500/30 bg-orange-500/10 p-2 text-xs">{t("runtime.fallback")}: {state.fallbackReason}</div>
      ) : null}
      {mounted && lastLiveIntegration ? (
        <div className="rounded border p-2 text-xs" data-testid="last-live-integration">
          <div className="font-medium">{t("backend.lastLiveCheck")}</div>
          <div>{t("backend.baseUrl")}: {lastLiveIntegration.baseUrl}</div>
          <div>{t("backend.reachable")}: {lastLiveIntegration.reachable ? t("common.yes") : t("common.no")}</div>
          <div>{t("backend.lastChecked")}: {formatCheckedAt(lastLiveIntegration.checkedAt)}</div>
          {lastLiveIntegration.fallbackActive ? <div>{t("backend.fallbackActive")}</div> : null}
          {lastLiveIntegration.fallbackReason ? <div>{t("backend.reason")}: {lastLiveIntegration.fallbackReason}</div> : null}
        </div>
      ) : null}
      {onRefresh ? (
        <Button type="button" size="sm" variant="outline" onClick={onRefresh}>
          {t("backend.testConnection")}
        </Button>
      ) : null}
    </div>
  );
}
