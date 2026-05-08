"use client";

import { useI18n } from "@/lib/i18n/use-i18n";
import type { Locale } from "@/lib/i18n/types";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

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
