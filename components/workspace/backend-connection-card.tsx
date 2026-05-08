"use client";

import { useEffect, useState } from "react";
import type { BackendConnectionState } from "@/lib/schemas/workspace";
import type { LiveIntegrationSnapshot } from "@/lib/utils/live-integration-cache";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

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
    <Panel className="space-y-3" data-testid="backend-connection-card">
      <div className="flex items-center justify-between">
        <SectionHeading title={t("backend.connectionCardTitle")} />
        <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
      </div>
      <div className="text-xs text-muted-foreground break-all">{t("backend.baseUrl")}: {state.apiBaseUrl}</div>
      <div className="flex flex-wrap gap-2 text-xs">
        <StatusBadge tone={state.reachable ? "success" : "danger"}>{state.reachable ? t("backend.connected") : t("backend.unreachable")}</StatusBadge>
        {mounted && state.checkedAt ? <StatusBadge tone="neutral">{t("backend.lastChecked")}: {formatCheckedAt(state.checkedAt)}</StatusBadge> : null}
        {mounted && state.appTitle ? <StatusBadge tone="neutral">{state.appTitle}</StatusBadge> : null}
        {mounted && state.fallbackActive ? <StatusBadge tone="warning">{t("backend.fallback")}</StatusBadge> : null}
      </div>
      {mounted && state.error ? <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-800">{state.error}</div> : null}
      {state.fallbackReason ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-800">{t("runtime.fallback")}: {state.fallbackReason}</div>
      ) : null}
      {mounted && lastLiveIntegration ? (
        <details className="rounded-md border border-border bg-muted/40 p-2 text-xs" data-testid="last-live-integration">
          <summary className="cursor-pointer font-medium">{t("backend.lastLiveCheck")}</summary>
          <div className="mt-2 space-y-1">
            <div>{t("backend.baseUrl")}: {lastLiveIntegration.baseUrl}</div>
            <div>{t("backend.reachable")}: {lastLiveIntegration.reachable ? t("common.yes") : t("common.no")}</div>
            <div>{t("backend.lastChecked")}: {formatCheckedAt(lastLiveIntegration.checkedAt)}</div>
            {lastLiveIntegration.fallbackActive ? <div>{t("backend.fallbackActive")}</div> : null}
            {lastLiveIntegration.fallbackReason ? <div>{t("backend.reason")}: {lastLiveIntegration.fallbackReason}</div> : null}
          </div>
        </details>
      ) : null}
      {onRefresh ? (
        <Button type="button" size="sm" variant="outline" onClick={onRefresh} className="w-fit">
          {t("backend.testConnection")}
        </Button>
      ) : null}
    </Panel>
  );
}
