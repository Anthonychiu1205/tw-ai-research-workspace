"use client";

import { useMemo, useState } from "react";
import { ReportSectionCard } from "@/components/research/report-section-card";
import { EvidenceTimeline } from "@/components/research/evidence-timeline";

type ReportSection = {
  id: string;
  title: string;
  content: string;
  evidenceIds?: string[];
};

export function ReportViewer({
  sections,
  timelinePoints,
}: {
  sections: ReportSection[];
  timelinePoints?: Array<{ id?: string; at: string; label: string; note: string; dataset?: string }>;
}) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | undefined>(undefined);

  const points = useMemo(
    () =>
      (timelinePoints ?? []).map((point, index) => ({
        id: point.id ?? `ev-${index + 1}`,
        at: point.at,
        label: point.label,
        note: point.note,
        dataset: point.dataset,
      })),
    [timelinePoints],
  );

  return (
    <div className="space-y-3" data-testid="report-viewer">
      <div className="rounded border p-2 text-xs text-yellow-300">Synthetic report viewer. Not financial advice and no trading execution.</div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          {sections.map((section) => (
            <ReportSectionCard
              key={section.id}
              title={section.title}
              content={section.content}
              evidenceIds={section.evidenceIds ?? []}
              onEvidenceSelect={setSelectedEvidenceId}
            />
          ))}
        </div>
        <div>
          <EvidenceTimeline points={points} selectedEvidenceId={selectedEvidenceId} />
        </div>
      </div>
    </div>
  );
}
