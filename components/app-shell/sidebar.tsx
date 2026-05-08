"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

const items = [{ href: "/workspace", key: "workspace" }, { href: "/reports", key: "reports" }, { href: "/strategies", key: "strategies" }, { href: "/traces", key: "traces" }] as const;

export function Sidebar({
  sessions = [],
  artifacts = [],
  onQuickAnalyze,
  hidden,
}: {
  sessions?: Array<{ id: string; title: string }>;
  artifacts?: Array<{ id: string; title: string }>;
  onQuickAnalyze?: () => void;
  hidden?: boolean;
}) {
  const { t } = useI18n();

  if (hidden) {
    return null;
  }

  return (
    <aside className="w-64 border-r border-border p-3" data-testid="sidebar">
      <div className="mb-4 text-sm font-semibold">{t("app.shortTitle")}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
            {t(`nav.${item.key}`)}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Badge>{t("runtime.mockFirst")}</Badge>
        <Badge>{t("runtime.localOnly")}</Badge>
      </div>

      <div className="mt-4 space-y-2" id="quick-actions">
        <div className="text-xs uppercase text-muted-foreground">{t("nav.quickActions")}</div>
        <Button type="button" size="sm" variant="outline" onClick={onQuickAnalyze}>
          {t("commands.analyze2330")}
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-xs uppercase text-muted-foreground">{t("sessions.history")}</div>
        {sessions.length === 0 ? (
          <div className="text-xs text-muted-foreground">{t("sessions.noSessions")}</div>
        ) : (
          sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="rounded-md border p-2 text-xs">
              {session.title}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2" id="artifacts">
        <div className="text-xs uppercase text-muted-foreground">{t("artifacts.title")}</div>
        {artifacts.length === 0 ? (
          <div className="text-xs text-muted-foreground">{t("artifacts.noArtifacts")}</div>
        ) : (
          artifacts.slice(0, 5).map((artifact) => (
            <div key={artifact.id} className="rounded-md border p-2 text-xs">
              {artifact.title}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
