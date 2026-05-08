"use client";

import { useEffect } from "react";

export type WorkspaceShortcut = {
  id: string;
  combo: string;
  description: string;
};

export const workspaceShortcuts: WorkspaceShortcut[] = [
  { id: "command-menu", combo: "Cmd/Ctrl+K", description: "Open command menu" },
  { id: "submit-message", combo: "Cmd/Ctrl+Enter", description: "Submit message" },
  { id: "new-session", combo: "Cmd/Ctrl+N", description: "Create new session" },
  { id: "toggle-sidebar", combo: "Cmd/Ctrl+B", description: "Toggle sidebar" },
  { id: "help", combo: "?", description: "Show shortcut help" },
];

export function isMetaShortcut(event: KeyboardEvent, key: string) {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key.toLowerCase();
}

export function useWorkspaceShortcuts(handlers: {
  onCommandMenu?: () => void;
  onSubmitMessage?: () => void;
  onNewSession?: () => void;
  onToggleSidebar?: () => void;
  onHelp?: () => void;
}) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (isMetaShortcut(event, "k")) {
        event.preventDefault();
        handlers.onCommandMenu?.();
        return;
      }
      if (isMetaShortcut(event, "enter")) {
        handlers.onSubmitMessage?.();
        return;
      }
      if (isMetaShortcut(event, "n")) {
        event.preventDefault();
        handlers.onNewSession?.();
        return;
      }
      if (isMetaShortcut(event, "b")) {
        event.preventDefault();
        handlers.onToggleSidebar?.();
        return;
      }
      if (!event.metaKey && !event.ctrlKey && event.key === "?") {
        handlers.onHelp?.();
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handlers]);
}
