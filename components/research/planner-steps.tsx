import { Badge } from "@/components/ui/badge";

export function PlannerSteps({
  steps,
  maxSteps,
}: {
  steps: Array<{ id?: string; title: string; status: string; toolName?: string; dependsOn?: string[]; detail?: string }>;
  maxSteps?: number;
}) {
  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="planner-steps">
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase text-muted-foreground">Plan</span>
        <span>bounded workflow: {steps.length}{typeof maxSteps === "number" ? ` / ${maxSteps}` : ""}</span>
      </div>

      {steps.map((step, index) => (
        <div key={step.id ?? `${step.title}-${index}`} className="rounded border p-2 text-sm">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <span>
              {index + 1}. {step.title}
            </span>
            <Badge>{step.status}</Badge>
          </div>
          {step.toolName ? <div className="text-xs text-muted-foreground">tool: {step.toolName}</div> : null}
          {step.dependsOn?.length ? <div className="text-xs text-muted-foreground">depends on: {step.dependsOn.join(", ")}</div> : null}
          {step.detail ? <div className="text-xs text-muted-foreground">{step.detail}</div> : null}
        </div>
      ))}
    </div>
  );
}
