"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function RunResearchForm({ onSubmit, disabled, loading }: { onSubmit: (ticker: string, includePhase2Agents: boolean) => Promise<void> | void; disabled?: boolean; loading?: boolean }) {
  const { t } = useI18n();
  const [ticker, setTicker] = useState("2330");
  const [includePhase2Agents, setIncludePhase2Agents] = useState(true);

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(ticker, includePhase2Agents);
      }}
    >
      <input aria-label={t("operations.runResearch")} className="h-9 w-24 rounded border bg-background px-2 text-xs" value={ticker} onChange={(event) => setTicker(event.target.value)} />
      <label className="inline-flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={includePhase2Agents}
          onChange={(event) => setIncludePhase2Agents(event.target.checked)}
        />
        Phase2
      </label>
      <LoadingButton type="submit" size="sm" disabled={disabled} loading={loading} loadingLabel={t("common.loading")}>
        {t("operations.runResearch")}
      </LoadingButton>
    </form>
  );
}
