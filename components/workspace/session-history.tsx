"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SessionHistory({ sessions }: { sessions: Array<{ id: string; title: string }> }) {
  const [local, setLocal] = useState(sessions);
  const [selectedId, setSelectedId] = useState<string | null>(sessions[0]?.id ?? null);

  const createSession = () => {
    const next = {
      id: `local-${Date.now()}`,
      title: "New Local Session",
    };
    setLocal((prev) => [next, ...prev]);
    setSelectedId(next.id);
  };

  const removeSession = (id: string) => {
    setLocal((prev) => prev.filter((session) => session.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-2" data-testid="session-history">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-muted-foreground">Sessions</div>
        <Button type="button" size="sm" variant="outline" onClick={createSession}>Create</Button>
      </div>
      {local.length === 0 ? (
        <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">No sessions yet</div>
      ) : (
        local.map((session) => (
          <div key={session.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
            <button className="text-left" onClick={() => setSelectedId(session.id)}>{session.title}</button>
            <div className="flex items-center gap-2">
              {selectedId === session.id ? <span className="text-[10px] text-muted-foreground">active</span> : null}
              <Button type="button" size="sm" variant="ghost" onClick={() => removeSession(session.id)}>Delete</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
