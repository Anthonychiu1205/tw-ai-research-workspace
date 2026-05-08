"use client";

import type { BackendConnectionState } from "@/lib/schemas/workspace";
import type { LiveIntegrationSnapshot } from "@/lib/utils/live-integration-cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const statusLabel = state.mode === "mock" ? t("backend.mockWorkspace") : state.reachable ? t("backend.apiConnected") : t("backend.apiFallback");

  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="backend-connection-card">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{t("runtime.backend")}</div>
        <Badge>{statusLabel}</Badge>
      </div>
      <div className="text-xs text-muted-foreground">base URL: {state.apiBaseUrl}</div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>{state.reachable ? t("backend.connected") : t("backend.unreachable")}</Badge>
        {state.checkedAt ? <Badge>checked: {new Date(state.checkedAt).toLocaleTimeString()}</Badge> : null}
        {state.appTitle ? <Badge>{state.appTitle}</Badge> : null}
        {state.fallbackActive ? <Badge>{t("backend.fallback")}</Badge> : null}
      </div>
      {state.error ? <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">{state.error}</div> : null}
      {state.fallbackReason ? (
        <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">{t("runtime.fallback")}: {state.fallbackReason}</div>
      ) : null}
      {lastLiveIntegration ? (
        <div className="rounded border p-2 text-xs" data-testid="last-live-integration">
          <div className="font-medium">Last live integration check</div>
          <div>base URL: {lastLiveIntegration.baseUrl}</div>
          <div>reachable: {lastLiveIntegration.reachable ? "yes" : "no"}</div>
          <div>checked: {new Date(lastLiveIntegration.checkedAt).toLocaleString()}</div>
          {lastLiveIntegration.fallbackActive ? <div>fallback active</div> : null}
          {lastLiveIntegration.fallbackReason ? <div>reason: {lastLiveIntegration.fallbackReason}</div> : null}
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
