"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { StatusBadge } from "@/components/ui/status-badge";
import { CompactListItem } from "@/components/ui/compact-list-item";
import { workspaceVisualTokens } from "@/lib/ui/visual-tokens";

const items = [
  { href: "/workspace", key: "workspace" },
  { href: "/reports", key: "reports" },
  { href: "/strategies", key: "strategies" },
  { href: "/traces", key: "traces" },
  { href: "/portfolio", key: "portfolio" },
] as const;

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
    <aside
      className={`${workspaceVisualTokens.sidebarWidth} h-screen flex-shrink-0 overflow-y-auto border-r border-border bg-white px-3 py-4`}
      data-testid="sidebar"
    >
      <div className="space-y-4">
        <section className="space-y-1 px-2">
          <h1 className="text-sm font-semibold leading-6">{t("app.shortTitle")}</h1>
          <StatusBadge tone="mock">{t("runtime.mockFirst")}</StatusBadge>
        </section>

        <section className="space-y-1">
          <div className="px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("nav.navigation")}</div>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </section>

        <section className="space-y-2 px-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("nav.quickActions")}</div>
          <Button type="button" size="sm" variant="outline" className="w-full justify-start" onClick={onQuickAnalyze}>
            {t("commands.analyze2330")}
          </Button>
        </section>

        <section className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("sessions.history")}</div>
            {sessions.length > 5 ? <span className="text-[11px] text-muted-foreground">{t("common.viewAll")}</span> : null}
          </div>
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="px-2 text-xs text-muted-foreground">{t("sessions.noSessions")}</div>
            ) : (
              sessions.slice(0, 5).map((session) => (
                <CompactListItem key={session.id} title={session.title} />
              ))
            )}
          </div>
        </section>

        <section className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("artifacts.recentArtifacts")}</div>
            {artifacts.length > 5 ? <span className="text-[11px] text-muted-foreground">{t("common.viewAll")}</span> : null}
          </div>
          <div className="space-y-1">
            {artifacts.length === 0 ? (
              <div className="px-2 text-xs text-muted-foreground">{t("artifacts.noArtifacts")}</div>
            ) : (
              artifacts.slice(0, 5).map((artifact) => (
                <CompactListItem key={artifact.id} title={artifact.title} />
              ))
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
