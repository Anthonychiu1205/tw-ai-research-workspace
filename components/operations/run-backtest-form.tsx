"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function RunBacktestForm({ onSubmit, disabled, loading }: { onSubmit: (ticker: string) => Promise<void> | void; disabled?: boolean; loading?: boolean }) {
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
      <input aria-label={t("operations.runBacktest")} className="h-9 w-24 rounded border bg-background px-2 text-xs" value={ticker} onChange={(event) => setTicker(event.target.value)} />
      <LoadingButton type="submit" size="sm" disabled={disabled} loading={loading} loadingLabel={t("common.loading")}>
        {t("operations.runBacktest")}
      </LoadingButton>
    </form>
  );
}
