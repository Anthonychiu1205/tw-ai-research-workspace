"use client";

import { Tabs } from "@/components/ui/tabs";
import { PlannerSteps } from "@/components/research/planner-steps";
import { ExecutorTrace } from "@/components/research/executor-trace";
import { ReflectionSummary } from "@/components/research/reflection-summary";

export function PlannerTraceViewer({
  plan,
  execution,
  reflection,
}: {
  plan: { steps: Array<{ id?: string; title: string; status: string; detail?: string }> };
  execution: {
    toolCalls: Array<{
      toolName: string;
      status: string;
      latencyMs?: number;
      startedAt?: string;
      completedAt?: string;
      argsPreview?: string;
      fallbackUsed?: boolean;
      evidenceCount?: number;
      error?: string;
    }>;
  };
  reflection: {
    summary?: string;
    cautionFlags?: string[];
    critiques?: string[];
    missingEvidence?: string[];
    overclaimingRisk?: string;
  };
}) {
  return (
    <div className="space-y-3" data-testid="planner-trace-viewer">
      <div className="rounded border p-2 text-xs text-muted-foreground">Bounded deterministic workflow visualization (no uncontrolled autonomous loops).</div>
      <Tabs tabs={["plan", "execution", "reflection"]} initial="plan">
        {(active) => {
          if (active === "plan") {
            return <PlannerSteps steps={plan.steps} maxSteps={8} />;
          }

          if (active === "execution") {
            return <ExecutorTrace calls={execution.toolCalls} />;
          }

          return (
            <ReflectionSummary
              summary={reflection.summary ?? "Synthetic reflection summary"}
              warnings={reflection.cautionFlags}
              critiques={reflection.critiques}
              missingEvidence={reflection.missingEvidence}
              overclaimingRisk={reflection.overclaimingRisk}
            />
          );
        }}
      </Tabs>
    </div>
  );
}
