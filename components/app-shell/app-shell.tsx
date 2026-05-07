import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { getEnvConfig } from "@/lib/config/env";

export function AppShell({ children }: { children: React.ReactNode }) {
  const env = getEnvConfig();
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar mode={env.workspaceMode} backendStatus={env.workspaceMode === "mock" ? "mock" : "optional"} />
        <main className="min-h-0 flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
