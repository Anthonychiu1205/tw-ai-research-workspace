"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ArtifactBrowser({ artifacts }: { artifacts: Array<{ id: string; title: string; kind: string }> }) {
  const [selectedId, setSelectedId] = useState<string | null>(artifacts[0]?.id ?? null);

  return (
    <div className="space-y-2" data-testid="artifact-browser">
      <div className="text-xs uppercase text-muted-foreground">Artifacts</div>
      {artifacts.map((artifact) => (
        <div key={artifact.id} className="rounded-md border p-2 text-sm">
          <div className="mb-1 flex items-center justify-between">
            <div>{artifact.title}</div>
            <Badge>{artifact.kind}</Badge>
          </div>
          <div className="mb-2 text-[10px] text-muted-foreground">synthetic / mock / non-advice</div>
          <Button type="button" size="sm" variant={selectedId === artifact.id ? "default" : "outline"} onClick={() => setSelectedId(artifact.id)}>
            {selectedId === artifact.id ? "Selected" : "Open"}
          </Button>
        </div>
      ))}
    </div>
  );
}
