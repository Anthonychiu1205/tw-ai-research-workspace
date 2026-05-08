"use client";

import { Button } from "@/components/ui/button";

export function SessionHistory({
  sessions,
  selectedSessionId,
  onCreate,
  onSelect,
  onDelete,
}: {
  sessions: Array<{ id: string; title: string }>;
  selectedSessionId?: string | null;
  onCreate?: () => void;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="space-y-2" data-testid="session-history">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-muted-foreground">Sessions</div>
        <Button type="button" size="sm" variant="outline" onClick={onCreate}>
          Create
        </Button>
      </div>
      {sessions.length === 0 ? (
        <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">No sessions yet</div>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
            <button className="text-left" onClick={() => onSelect?.(session.id)}>
              {session.title}
            </button>
            <div className="flex items-center gap-2">
              {selectedSessionId === session.id ? <span className="text-[10px] text-muted-foreground">active</span> : null}
              <Button type="button" size="sm" variant="ghost" onClick={() => onDelete?.(session.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
