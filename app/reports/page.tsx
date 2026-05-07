import report from "@/fixtures/mock-api/report.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { ReportViewer } from "@/components/workspace/report-viewer";

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Synthetic Report Viewer</h1>
        <p className="text-sm text-muted-foreground">Mock / synthetic artifact. Not financial advice.</p>
        <ReportViewer sections={report.sections} />
      </div>
    </AppShell>
  );
}
