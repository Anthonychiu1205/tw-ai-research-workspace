import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useWorkspaceShortcuts, workspaceShortcuts } from "@/lib/keyboard/shortcuts";
import { KeyboardShortcutsHelp } from "@/components/app-shell/keyboard-shortcuts-help";

function ShortcutHarness() {
  const [count, setCount] = useState(0);
  useWorkspaceShortcuts({
    onCommandMenu: () => setCount((v) => v + 1),
  });

  return <div data-testid="count">{count}</div>;
}

describe("keyboard shortcuts", () => {
  test("shortcuts registered", () => {
    render(<ShortcutHarness />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  test("command menu shortcut documented", () => {
    expect(workspaceShortcuts.some((item) => item.id === "command-menu")).toBe(true);
  });

  test("help component renders", () => {
    render(<KeyboardShortcutsHelp />);
    expect(screen.getByTestId("keyboard-shortcuts-help")).toBeInTheDocument();
    expect(screen.getByText(/Cmd\/Ctrl\+K/i)).toBeInTheDocument();
  });
});
