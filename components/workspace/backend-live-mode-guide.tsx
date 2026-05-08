import { Button } from "@/components/ui/button";

export function BackendLiveModeGuide({
  apiBaseUrl,
  fallbackActive,
  onTestConnection,
}: {
  apiBaseUrl: string;
  fallbackActive: boolean;
  onTestConnection?: () => void;
}) {
  return (
    <div className="space-y-2 rounded-md border p-3 text-xs" data-testid="backend-live-mode-guide">
      <div className="text-sm font-medium">Backend Live Mode Dry-Run</div>
      <div className="text-muted-foreground">API base URL: {apiBaseUrl}</div>
      <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
        <li>Start local tw-ai-investment-research backend service.</li>
        <li>Set NEXT_PUBLIC_WORKSPACE_MODE=api.</li>
        <li>Set NEXT_PUBLIC_API_BRIDGE_MODE=proxy.</li>
        <li>Test backend connection from runtime settings.</li>
      </ol>
      <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-muted-foreground">
        {fallbackActive
          ? "Fallback is active: workspace will stay demo-safe in mock fallback mode if backend is unreachable."
          : "Fallback-ready: workspace can switch to mock-safe mode if backend fails."}
      </div>
      <div className="text-muted-foreground">No broker integration. No trading execution. Not financial advice.</div>
      {onTestConnection ? (
        <Button type="button" size="sm" variant="outline" onClick={onTestConnection} aria-label="Test backend live mode connection">
          Test connection
        </Button>
      ) : null}
    </div>
  );
}
