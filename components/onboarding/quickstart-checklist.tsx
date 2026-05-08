export function QuickstartChecklist() {
  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="quickstart-checklist">
      <div className="text-sm font-medium">Quickstart Checklist</div>
      <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
        <li>Development checks: typecheck / tests / build.</li>
        <li>Mock mode is ready by default.</li>
        <li>Backend is optional with fallback behavior.</li>
        <li>No API key is required for default local demo.</li>
      </ul>
    </div>
  );
}
