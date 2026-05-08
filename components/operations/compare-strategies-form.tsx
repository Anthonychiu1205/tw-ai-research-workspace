"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CompareStrategiesForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (tickers: string[]) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [tickersText, setTickersText] = useState("2330,2317,2454,2308,0050");

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const tickers = tickersText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        void onSubmit(tickers);
      }}
    >
      <input aria-label="Strategy tickers" className="h-8 w-48 rounded border bg-background px-2 text-xs" value={tickersText} onChange={(event) => setTickersText(event.target.value)} />
      <Button type="submit" size="sm" disabled={disabled}>Compare strategies</Button>
    </form>
  );
}
