import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignalCard } from "@/components/research/signal-card";
import { ReportViewer } from "@/components/workspace/report-viewer";
import { PlannerTraceViewer } from "@/components/workspace/planner-trace-viewer";
import { StrategyComparison } from "@/components/workspace/strategy-comparison";
import { SignalExplorer } from "@/components/workspace/signal-explorer";
import { EvidenceTimeline } from "@/components/research/evidence-timeline";
import { AgentConsensusView } from "@/components/research/agent-consensus-view";

function renderToolContent(event: any) {
  const data = event.data ?? {};

  if (event.toolName === "runResearch") {
    return <SignalCard label="Research Score" value={`${((data.score ?? 0) * 100).toFixed(1)}% synthetic confidence`} />;
  }

  if (event.toolName === "generateReport") {
    return <ReportViewer sections={data.sections ?? []} timelinePoints={data.timelinePoints ?? []} />;
  }

  if (event.toolName === "runPipeline") {
    return (
      <PlannerTraceViewer
        plan={data.plan ?? { steps: [] }}
        execution={data.execution ?? { toolCalls: [] }}
        reflection={data.reflection ?? { summary: "Synthetic pipeline trace" }}
      />
    );
  }

  if (event.toolName === "compareStrategies") {
    return <StrategyComparison strategies={data.strategies ?? []} />;
  }

  if (event.toolName === "evaluateSignals") {
    return <SignalExplorer distribution={data.distribution ?? { positive: 0, neutral: 0, negative: 0 }} />;
  }

  if (event.toolName === "getEvidenceTimeline") {
    return <EvidenceTimeline points={data.points ?? []} />;
  }

  if (event.toolName === "getSignalMatrix") {
    return (
      <AgentConsensusView
        consensus={{
          consensus: "balanced",
          confidence: 0.6,
          highlights: (data.signals ?? []).map((signal: any) => `${signal.agent}: ${signal.direction}`),
        }}
      />
    );
  }

  if (event.toolName === "getAgentConsensus") {
    return <AgentConsensusView consensus={data} />;
  }

  return <div className="text-xs text-muted-foreground">No renderer for this tool result</div>;
}

export function ToolCallRenderer({ event }: { event: any }) {
  return (
    <Card data-testid="tool-call-renderer">
      <CardContent>
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>tool: {event.toolName}</span>
          <Badge>{event.status}</Badge>
          <Badge>{event.source}</Badge>
          {event.fallbackUsed ? <Badge>fallback</Badge> : null}
        </div>
        <div className="mb-2 text-sm">{event.summary}</div>
        {event.evidenceIds?.length > 0 ? (
          <div className="mb-2 text-xs text-muted-foreground">evidence: {event.evidenceIds.join(", ")}</div>
        ) : null}
        {event.warnings?.length > 0 ? (
          <div className="mb-2 text-xs text-yellow-400">warnings: {event.warnings.join("; ")}</div>
        ) : null}
        {renderToolContent(event)}
      </CardContent>
    </Card>
  );
}
