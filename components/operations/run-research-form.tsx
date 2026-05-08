"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RunResearchForm({ onSubmit, disabled }: { onSubmit: (ticker: string, includePhase2Agents: boolean) => Promise<void> | void; disabled?: boolean }) {
  const [ticker, setTicker] = useState("2330");
  const [includePhase2Agents, setIncludePhase2Agents] = useState(true);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(ticker, includePhase2Agents);
      }}
    >
      <input aria-label="Research ticker" className="h-8 w-24 rounded border bg-background px-2 text-xs" value={ticker} onChange={(event) => setTicker(event.target.value)} />
      <label className="inline-flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={includePhase2Agents}
          onChange={(event) => setIncludePhase2Agents(event.target.checked)}
        />
        Phase2
      </label>
      <Button type="submit" size="sm" disabled={disabled}>Run research</Button>
    </form>
  );
}
