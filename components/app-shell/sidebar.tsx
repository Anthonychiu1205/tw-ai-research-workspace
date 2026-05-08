import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/workspace", label: "Workspace" },
  { href: "/reports", label: "Reports" },
  { href: "/strategies", label: "Strategies" },
  { href: "/traces", label: "Traces" },
];

export function Sidebar({
  sessions = [],
  artifacts = [],
  onQuickAnalyze,
  hidden,
}: {
  sessions?: Array<{ id: string; title: string }>;
  artifacts?: Array<{ id: string; title: string }>;
  onQuickAnalyze?: () => void;
  hidden?: boolean;
}) {
  if (hidden) {
    return null;
  }

  return (
    <aside className="w-64 border-r border-border p-3" data-testid="sidebar">
      <div className="mb-4 text-sm font-semibold">TW AI Research</div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Badge>mock-first</Badge>
        <Badge>local-only</Badge>
      </div>

      <div className="mt-4 space-y-2" id="quick-actions">
        <div className="text-xs uppercase text-muted-foreground">Quick actions</div>
        <Button type="button" size="sm" variant="outline" onClick={onQuickAnalyze}>
          Analyze 2330
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-xs uppercase text-muted-foreground">Sessions</div>
        {sessions.length === 0 ? (
          <div className="text-xs text-muted-foreground">No sessions</div>
        ) : (
          sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="rounded-md border p-2 text-xs">
              {session.title}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2" id="artifacts">
        <div className="text-xs uppercase text-muted-foreground">Artifacts</div>
        {artifacts.length === 0 ? (
          <div className="text-xs text-muted-foreground">No artifacts</div>
        ) : (
          artifacts.slice(0, 5).map((artifact) => (
            <div key={artifact.id} className="rounded-md border p-2 text-xs">
              {artifact.title}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
