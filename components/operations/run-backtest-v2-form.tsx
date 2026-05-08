"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function RunBacktestV2Form({
  onSubmit,
  disabled,
  loading,
}: {
  onSubmit: (tickers: string[]) => Promise<void> | void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { t } = useI18n();
  const [tickersText, setTickersText] = useState("2330,2317,2454,2308");

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const tickers = tickersText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        void onSubmit(tickers);
      }}
    >
      <input
        aria-label={t("operations.runBacktestV2")}
        className="h-9 w-56 rounded border bg-background px-2 text-xs"
        value={tickersText}
        onChange={(event) => setTickersText(event.target.value)}
      />
      <LoadingButton type="submit" size="sm" disabled={disabled} loading={loading} loadingLabel={t("common.loading")}>
        {t("operations.runBacktestV2")}
      </LoadingButton>
    </form>
  );
}
