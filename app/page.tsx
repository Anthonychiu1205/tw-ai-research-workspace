"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <StatusBadge tone="mock">{t("runtime.mockFirst")}</StatusBadge>
          <StatusBadge tone="neutral">{t("backend.optional")}</StatusBadge>
          <StatusBadge tone="warning">{t("disclaimers.nonAdvice")}</StatusBadge>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{t("app.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Taiwan AI Research Workspace</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{t("app.entryTagline")}</p>

        <ul className="mt-6 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
          <li className="rounded-lg bg-slate-50 px-3 py-2">{t("app.entryPoint1")}</li>
          <li className="rounded-lg bg-slate-50 px-3 py-2">{t("app.entryPoint2")}</li>
          <li className="rounded-lg bg-slate-50 px-3 py-2">{t("app.entryPoint3")}</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={() => (window.location.href = "/workspace")}>
            {t("app.ctaEnterWorkspace")}
          </Button>
          <Button type="button" variant="outline" onClick={() => (window.location.href = "/workspace?view=chat&ticker=2330")}>
            {t("app.ctaStartDemo")}
          </Button>
          <Button type="button" variant="outline" onClick={() => (window.location.href = "/workspace?view=chat")}>
            {t("app.ctaDemoWalkthrough")}
          </Button>
        </div>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {t("disclaimers.mockData")} {t("disclaimers.nonAdvice")} {t("disclaimers.noTrading")}
        </div>
      </div>
    </main>
  );
}
