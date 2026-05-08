import type { WorkspaceScenario } from "@/lib/scenarios/scenario-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ScenarioCard({
  scenario,
  onRun,
  running,
}: {
  scenario: WorkspaceScenario;
  onRun: (id: WorkspaceScenario["id"]) => void;
  running?: boolean;
}) {
  return (
    <div className="rounded-md border p-3 text-xs" data-testid={`scenario-card-${scenario.id}`}>
      <div className="mb-1 flex items-center gap-2">
        <div className="text-sm font-medium">{scenario.title}</div>
        <Badge>{scenario.category}</Badge>
        <Badge>{scenario.mockSafe ? "mock-safe" : "backend"}</Badge>
      </div>
      <p className="mb-2 text-muted-foreground">{scenario.description}</p>
      <div className="mb-2 text-muted-foreground">Expected artifacts: {scenario.expectedArtifacts.join(", ")}</div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onRun(scenario.id)}
        disabled={running}
        aria-label={`Run scenario ${scenario.title}`}
      >
        Run scenario
      </Button>
    </div>
  );
}
