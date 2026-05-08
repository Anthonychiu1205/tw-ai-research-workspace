"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RunPipelineForm({ onSubmit, disabled }: { onSubmit: (ticker: string) => Promise<void> | void; disabled?: boolean }) {
  const [ticker, setTicker] = useState("2330");

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(ticker);
      }}
    >
      <input className="h-8 w-24 rounded border bg-background px-2 text-xs" value={ticker} onChange={(event) => setTicker(event.target.value)} />
      <Button type="submit" size="sm" disabled={disabled}>Run pipeline</Button>
    </form>
  );
}
