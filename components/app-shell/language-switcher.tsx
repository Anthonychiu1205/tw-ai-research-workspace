"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { Locale } from "@/lib/i18n/types";
import { StatusBadge } from "@/components/ui/status-badge";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 text-xs" aria-label={t("common.language")}>
        <span>{t("common.language")}</span>
        <StatusBadge tone="neutral">{t("common.loading")}</StatusBadge>
      </div>
    );
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <span>{t("common.language")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="h-7 rounded border border-border bg-background px-2"
        aria-label={t("common.language")}
      >
        <option value="zh-TW">{t("common.traditionalChinese")}</option>
        <option value="en-US">{t("common.english")}</option>
      </select>
    </label>
  );
}
