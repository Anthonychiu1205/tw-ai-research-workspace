"use client";

import type { BackendConnectionState } from "@/lib/schemas/workspace";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";

export function AppShell({
  children,
  sessions = [],
  artifacts = [],
  backendStatus,
  modelLabel,
  mode = "mock",
  connection,
  onQuickAnalyze,
  sidebarHidden,
}: {
  children: React.ReactNode;
  sessions?: Array<{ id: string; title: string }>;
  artifacts?: Array<{ id: string; title: string }>;
  backendStatus?: string;
  modelLabel?: string;
  mode?: "mock" | "api";
  connection?: BackendConnectionState;
  onQuickAnalyze?: () => void;
  sidebarHidden?: boolean;
}) {
  return (
    <div className="flex h-screen w-full bg-workspace-canvas">
      <Sidebar sessions={sessions} artifacts={artifacts} onQuickAnalyze={onQuickAnalyze} hidden={sidebarHidden} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          mode={mode}
          backendStatus={backendStatus ?? (mode === "mock" ? "mock" : "optional")}
          modelLabel={modelLabel}
          connection={connection}
        />
        <main className="min-h-0 flex-1 p-4 md:p-5">{children}</main>
      </div>
    </div>
  );
}
