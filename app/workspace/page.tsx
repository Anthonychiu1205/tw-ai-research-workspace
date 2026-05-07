import sessionDemo from "@/fixtures/demo/session-demo.json";
import signalEval from "@/fixtures/mock-api/signal-evaluation.json";
import reportSections from "@/fixtures/demo/report-sections-2330.json";
import pipelineTrace from "@/fixtures/demo/planner-trace-2330.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { ResearchChat } from "@/components/chat/research-chat";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { SessionHistory } from "@/components/workspace/session-history";
import { SignalExplorer } from "@/components/workspace/signal-explorer";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";
import { ReportViewer } from "@/components/workspace/report-viewer";

export default function WorkspacePage() {
  return (
    <AppShell>
      <div className="grid h-full grid-cols-12 gap-4">
        <section className="col-span-7 min-h-0 space-y-3">
          <ResearchChat />
          <ReportViewer sections={reportSections.sections} />
        </section>
        <aside className="col-span-5 min-h-0 space-y-3 overflow-auto">
          <SessionHistory sessions={sessionDemo.sessions} />
          <ArtifactBrowser artifacts={sessionDemo.artifacts} />
          <SignalExplorer distribution={signalEval.distribution} />
          <PlannerTraceViewer
            plan={pipelineTrace.plan}
            execution={pipelineTrace.execution}
            reflection={pipelineTrace.reflection}
          />
        </aside>
      </div>
    </AppShell>
  );
}
