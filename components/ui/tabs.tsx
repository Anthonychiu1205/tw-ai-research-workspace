"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Tabs({
  tabs,
  initial,
  children,
}: {
  tabs: string[];
  initial?: string;
  children: (active: string) => React.ReactNode;
}) {
  const [active, setActive] = useState(initial ?? tabs[0]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={cn(
              "rounded-md border px-3 py-1 text-xs",
              active === tab ? "bg-muted" : "opacity-70 hover:opacity-100",
            )}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{children(active)}</div>
    </div>
  );
}
