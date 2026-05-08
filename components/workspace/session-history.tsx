"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-lg border border-border/80 bg-workspace-panel p-3" data-testid="session-history">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("sessions.history")}</div>
        <Button type="button" size="sm" variant="outline" onClick={onCreate}>
          {t("common.create")}
        </Button>
      </div>
      {sessions.length === 0 ? (
        <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">{t("sessions.noSessions")}</div>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
            <button className="text-left" onClick={() => onSelect?.(session.id)}>
              {session.title}
            </button>
            <div className="flex items-center gap-2">
              {selectedSessionId === session.id ? <span className="text-[10px] text-muted-foreground">{t("common.active")}</span> : null}
              <Button type="button" size="sm" variant="ghost" onClick={() => onDelete?.(session.id)}>
                {t("common.delete")}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
