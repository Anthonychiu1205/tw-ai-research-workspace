import type { BackendConnectionState } from "@/lib/schemas/workspace";
import { Badge } from "@/components/ui/badge";

function backendLabel(connection?: BackendConnectionState) {
  if (!connection) return "backend: optional";
  if (connection.mode === "mock") return "Mock workspace";
  if (connection.reachable) return "API connected";
  if (connection.fallbackActive) return "API fallback";
  return "API unavailable";
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
  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4" data-testid="topbar">
      <div className="text-sm">AI-native Taiwan Research Workspace</div>
      <div className="flex items-center gap-2 text-xs">
        <Badge>{backendLabel(connection)}</Badge>
        <Badge>mode: {mode}</Badge>
        <Badge>backend: {backendStatus ?? (connection?.reachable ? "ok" : "optional")}</Badge>
        <Badge>model: {modelLabel ?? "mock-research"}</Badge>
        <Badge>synthetic / non-advice</Badge>
      </div>
    </header>
  );
}
