import sessionDemo from "@/fixtures/demo/session-demo.json";
import signalEval from "@/fixtures/mock-api/signal-evaluation.json";
import reportSections from "@/fixtures/demo/report-sections-2330.json";
import pipelineTrace from "@/fixtures/demo/planner-trace-2330.json";
import timeline from "@/fixtures/demo/evidence-timeline-2330.json";
import researchCard from "@/fixtures/demo/research-card-2330.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { ResearchChat } from "@/components/chat/research-chat";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { SessionHistory } from "@/components/workspace/session-history";
import { SignalExplorer } from "@/components/workspace/signal-explorer";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";
import { ReportViewer } from "@/components/workspace/report-viewer";
import { EvidenceTimeline } from "@/components/research/evidence-timeline";
import { SignalCard } from "@/components/research/signal-card";

export default function WorkspacePage() {
  return (
    <AppShell
      sessions={sessionDemo.sessions.map((session) => ({ id: session.id, title: session.title }))}
      artifacts={sessionDemo.artifacts.map((artifact) => ({ id: artifact.id, title: artifact.title }))}
      backendStatus="optional"
      modelLabel="mock-research"
    >
      <div className="grid h-full grid-cols-12 gap-4">
        <section className="col-span-7 min-h-0 space-y-3">
          <ResearchChat />
        </section>
        <aside className="col-span-5 min-h-0 space-y-3 overflow-auto">
          <SessionHistory sessions={sessionDemo.sessions} />
          <ArtifactBrowser artifacts={sessionDemo.artifacts} />
          <SignalCard label="Active Signal" value={`${researchCard.symbol} ${researchCard.name} synthetic score ${researchCard.score}`} />
          <SignalExplorer distribution={signalEval.distribution} />
          <EvidenceTimeline points={timeline.points} />
          <PlannerTraceViewer
            plan={pipelineTrace.plan}
            execution={pipelineTrace.execution}
            reflection={pipelineTrace.reflection}
          />
          <ReportViewer sections={reportSections.sections.slice(0, 2)} />
        </aside>
      </div>
    </AppShell>
  );
}
