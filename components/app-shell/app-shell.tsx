import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { getEnvConfig } from "@/lib/config/env";

export function AppShell({
  children,
  sessions = [],
  artifacts = [],
  backendStatus,
  modelLabel,
}: {
  children: React.ReactNode;
  sessions?: Array<{ id: string; title: string }>;
  artifacts?: Array<{ id: string; title: string }>;
  backendStatus?: string;
  modelLabel?: string;
}) {
  const env = getEnvConfig();
  return (
    <div className="flex h-screen w-full">
      <Sidebar sessions={sessions} artifacts={artifacts} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          mode={env.workspaceMode}
          backendStatus={backendStatus ?? (env.workspaceMode === "mock" ? "mock" : "optional")}
          modelLabel={modelLabel}
        />
        <main className="min-h-0 flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
