import { PlannerSteps } from "@/components/research/planner-steps";
import { ExecutorTrace } from "@/components/research/executor-trace";
import { ReflectionSummary } from "@/components/research/reflection-summary";

export function PlannerTraceViewer({
  plan,
  execution,
  reflection,
}: {
  plan: { steps: Array<{ title: string; status: string }> };
  execution: { toolCalls: Array<{ toolName: string; status: string }> };
  reflection: { summary: string };
}) {
  return (
    <div className="space-y-3">
      <PlannerSteps steps={plan.steps} />
      <ExecutorTrace calls={execution.toolCalls} />
      <ReflectionSummary summary={reflection.summary} />
    </div>
  );
}
