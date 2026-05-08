"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function GenerateReportForm({ onSubmit, disabled }: { onSubmit: (ticker: string) => Promise<void> | void; disabled?: boolean }) {
  const { t } = useI18n();
  const [ticker, setTicker] = useState("2330");

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(ticker);
      }}
    >
      <input aria-label={t("operations.generateReport")} className="h-9 w-24 rounded border bg-background px-2 text-xs" value={ticker} onChange={(event) => setTicker(event.target.value)} />
      <Button type="submit" size="sm" disabled={disabled}>{t("operations.generateReport")}</Button>
    </form>
  );
}
