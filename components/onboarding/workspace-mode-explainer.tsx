export function WorkspaceModeExplainer() {
  return (
    <div className="rounded-md border p-3 text-xs text-muted-foreground" data-testid="workspace-mode-explainer">
      Workspace mode: use <strong>mock</strong> for deterministic synthetic demo. Use <strong>api</strong> only when local backend is available; fallback to mock remains supported.
    </div>
  );
}
