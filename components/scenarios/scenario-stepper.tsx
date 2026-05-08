import type { ScenarioStep } from "@/lib/scenarios/scenario-types";
import { Badge } from "@/components/ui/badge";

export function ScenarioStepper({ steps }: { steps: ScenarioStep[] }) {
  if (steps.length === 0) {
    return <div className="rounded border border-dashed p-2 text-xs text-muted-foreground">No scenario steps yet.</div>;
  }

  return (
    <div className="space-y-2" data-testid="scenario-stepper">
      {steps.map((step, index) => (
        <div key={step.id} className="rounded border p-2 text-xs">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-medium">{index + 1}. {step.title}</span>
            <Badge>{step.status}</Badge>
            {step.expectedArtifactType ? <Badge>{step.expectedArtifactType}</Badge> : null}
          </div>
          <div className="text-muted-foreground">{step.description}</div>
        </div>
      ))}
    </div>
  );
}
