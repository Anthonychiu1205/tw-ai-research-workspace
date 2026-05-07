import { ReportSectionCard } from "@/components/research/report-section-card";

export function ReportViewer({ sections }: { sections: Array<{ id: string; title: string; content: string }> }) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <ReportSectionCard key={section.id} title={section.title} content={section.content} />
      ))}
    </div>
  );
}
