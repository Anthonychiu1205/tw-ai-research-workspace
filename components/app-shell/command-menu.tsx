"use client";

import { useMemo, useState } from "react";
import type { WorkspaceCommand } from "@/lib/commands/command-types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { InlineFeedback } from "@/components/ui/inline-feedback";

export function CommandMenu({
  commands,
  onRun,
  open,
  onClose,
}: {
  commands: WorkspaceCommand[];
  onRun: (command: WorkspaceCommand) => Promise<void> | void;
  open?: boolean;
  onClose?: () => void;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "warning" | "danger"; message: string; detail?: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [commands, query]);

  if (!open) {
    return (
      <div className="rounded-md border border-border bg-white p-2 text-xs text-muted-foreground" data-testid="command-menu-closed">
        Press Cmd/Ctrl+K to open command menu.
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-border bg-white p-2" data-testid="command-menu" role="dialog" aria-label="Command menu">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-muted-foreground">Command Palette</div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          {t("common.close")}
        </Button>
      </div>
      <Input aria-label="Command search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("nav.quickActions")} />
      {feedback ? <InlineFeedback tone={feedback.tone} message={feedback.message} detail={feedback.detail} /> : null}
      <div className="max-h-44 space-y-1 overflow-auto">
        {filtered.map((command) => (
          <div key={command.id} className="rounded border border-border bg-white p-2 text-xs">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-medium">{command.label}</div>
              <Badge>{command.category}</Badge>
            </div>
            <div className="mb-2 text-muted-foreground">{command.description}</div>
            {command.unavailableReason ? (
              <div className="mb-2 text-amber-700">{command.unavailableReason}</div>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={Boolean(command.unavailableReason)}
              onClick={async () => {
                try {
                  await onRun(command);
                  setFeedback({ tone: "success", message: t("common.completed"), detail: command.label });
                } catch (error) {
                  setFeedback({
                    tone: "danger",
                    message: t("errors.generic"),
                    detail: error instanceof Error ? error.message : "Command failed",
                  });
                }
                onClose?.();
              }}
            >
              {t("common.run")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
