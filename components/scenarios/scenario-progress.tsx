import type { ScenarioStep } from "@/lib/scenarios/scenario-types";

export function ScenarioProgress({ steps }: { steps: ScenarioStep[] }) {
  if (steps.length === 0) return null;
  const done = steps.filter((step) => step.status === "succeeded").length;
  return (
    <div className="rounded-md border p-2 text-xs" data-testid="scenario-progress">
      Scenario progress: {done}/{steps.length} steps completed.
    </div>
  );
}
