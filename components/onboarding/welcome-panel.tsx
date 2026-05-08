import { Button } from "@/components/ui/button";

export function WelcomePanel({
  onStart2330,
  onCompareWatchlist,
  onOpenTrace,
  onConnectBackend,
}: {
  onStart2330: () => void;
  onCompareWatchlist: () => void;
  onOpenTrace: () => void;
  onConnectBackend: () => void;
}) {
  return (
    <div className="space-y-3 rounded-md border p-3" data-testid="welcome-panel">
      <div className="text-sm font-medium">Welcome to Taiwan AI Research Workspace</div>
      <ul className="list-disc pl-4 text-xs text-muted-foreground">
        <li>Mock-first runtime, no API key required by default.</li>
        <li>Synthetic workspace output only, not financial advice.</li>
        <li>No broker integration and no trading execution path.</li>
        <li>Backend is optional; sessions/artifacts are local-only.</li>
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onStart2330}>Start with 2330 demo</Button>
        <Button type="button" size="sm" variant="outline" onClick={onCompareWatchlist}>Compare watchlist</Button>
        <Button type="button" size="sm" variant="outline" onClick={onOpenTrace}>Open planner trace</Button>
        <Button type="button" size="sm" variant="outline" onClick={onConnectBackend}>Connect backend</Button>
      </div>
    </div>
  );
}
