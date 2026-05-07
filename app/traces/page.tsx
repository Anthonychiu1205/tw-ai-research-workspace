import pipeline from "@/fixtures/mock-api/pipeline-result.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";

export default function TracesPage() {
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Planner / Executor Trace</h1>
        <p className="text-sm text-muted-foreground">Dexter-style trace visualization with bounded local flow.</p>
        <PlannerTraceViewer
          plan={pipeline.plan}
          execution={pipeline.execution}
          reflection={pipeline.reflection}
        />
      </div>
    </AppShell>
  );
}
