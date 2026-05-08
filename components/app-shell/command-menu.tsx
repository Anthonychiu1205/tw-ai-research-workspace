"use client";

import { useMemo, useState } from "react";
import type { WorkspaceCommand } from "@/lib/commands/command-types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CommandMenu({
  commands,
  onRun,
}: {
  commands: WorkspaceCommand[];
  onRun: (command: WorkspaceCommand) => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [commands, query]);

  return (
    <div className="space-y-2 rounded-md border border-border p-2" data-testid="command-menu">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick actions" />
      <div className="max-h-44 space-y-1 overflow-auto">
        {filtered.map((command) => (
          <div key={command.id} className="rounded border p-2 text-xs">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-medium">{command.label}</div>
              <Badge>{command.category}</Badge>
            </div>
            <div className="mb-2 text-muted-foreground">{command.description}</div>
            {command.unavailableReason ? (
              <div className="mb-2 text-yellow-400">{command.unavailableReason}</div>
            ) : null}
            <Button type="button" size="sm" variant="outline" disabled={Boolean(command.unavailableReason)} onClick={() => onRun(command)}>
              Run
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
