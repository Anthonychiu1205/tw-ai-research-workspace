import { Badge } from "@/components/ui/badge";

export function Topbar({
  mode,
  backendStatus,
}: {
  mode: "mock" | "api";
  backendStatus: string;
}) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4">
      <div className="text-sm">AI-native Taiwan Research Workspace</div>
      <div className="flex items-center gap-2 text-xs">
        <Badge>mode: {mode}</Badge>
        <Badge>backend: {backendStatus}</Badge>
        <Badge>synthetic / non-advice</Badge>
      </div>
    </header>
  );
}
