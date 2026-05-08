"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";

export function ExecutorTrace({
  calls,
}: {
  calls: Array<{
    toolName: string;
    status: string;
    latencyMs?: number;
    argsPreview?: string;
    fallbackUsed?: boolean;
    evidenceCount?: number;
    error?: string;
  }>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2 rounded-md border border-border/80 bg-card/60 p-3 text-sm" data-testid="executor-trace">
      {calls.map((call, index) => {
        const id = `${call.toolName}-${index}`;
        const open = openId === id;

        return (
          <div key={id} className="rounded border p-2">
            <button className="flex w-full items-center justify-between text-left" onClick={() => setOpenId(open ? null : id)}>
              <span>{call.toolName}</span>
              <div className="flex items-center gap-1">
                <StatusBadge tone={call.status === "succeeded" ? "success" : call.status === "failed" ? "danger" : "trace"}>
                  {call.status}
                </StatusBadge>
                {typeof call.latencyMs === "number" ? <StatusBadge tone="neutral">{call.latencyMs}ms</StatusBadge> : null}
              </div>
            </button>
            {open ? (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                {call.argsPreview ? <div>args: {call.argsPreview}</div> : null}
                {typeof call.evidenceCount === "number" ? <div>evidence count: {call.evidenceCount}</div> : null}
                {call.fallbackUsed ? <StatusBadge tone="warning">fallbackUsed: true</StatusBadge> : null}
                {call.error ? <div className="text-rose-300">error: {call.error}</div> : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
