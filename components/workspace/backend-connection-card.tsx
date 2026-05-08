"use client";

import type { BackendConnectionState } from "@/lib/schemas/workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BackendConnectionCard({
  state,
  onRefresh,
}: {
  state: BackendConnectionState;
  onRefresh?: () => void;
}) {
  const statusLabel = state.mode === "mock" ? "Mock workspace" : state.reachable ? "API connected" : "API fallback";

  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="backend-connection-card">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Backend Connection</div>
        <Badge>{statusLabel}</Badge>
      </div>
      <div className="text-xs text-muted-foreground">base URL: {state.apiBaseUrl}</div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>{state.reachable ? "reachable" : "unreachable"}</Badge>
        {state.checkedAt ? <Badge>checked: {new Date(state.checkedAt).toLocaleTimeString()}</Badge> : null}
        {state.appTitle ? <Badge>{state.appTitle}</Badge> : null}
        {state.fallbackActive ? <Badge>fallback active</Badge> : null}
      </div>
      {state.error ? <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">{state.error}</div> : null}
      {state.fallbackReason ? (
        <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">fallback reason: {state.fallbackReason}</div>
      ) : null}
      {onRefresh ? (
        <Button type="button" size="sm" variant="outline" onClick={onRefresh}>
          Test backend connection
        </Button>
      ) : null}
    </div>
  );
}
