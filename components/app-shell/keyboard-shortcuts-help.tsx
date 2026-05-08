import { workspaceShortcuts } from "@/lib/keyboard/shortcuts";

export function KeyboardShortcutsHelp() {
  return (
    <div className="space-y-2 rounded-md border p-3 text-xs" data-testid="keyboard-shortcuts-help">
      <div className="font-medium">Keyboard Shortcuts</div>
      {workspaceShortcuts.map((shortcut) => (
        <div key={shortcut.id} className="flex items-center justify-between rounded border p-2">
          <span>{shortcut.description}</span>
          <span>{shortcut.combo}</span>
        </div>
      ))}
    </div>
  );
}
