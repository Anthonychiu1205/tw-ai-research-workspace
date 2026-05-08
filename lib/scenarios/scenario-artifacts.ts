import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import type { ScenarioRunResult } from "@/lib/scenarios/scenario-types";

export function scenarioSummary(result: ScenarioRunResult) {
  return `${result.status === "succeeded" ? "Completed" : "Failed"} scenario ${result.scenarioId} with ${result.createdArtifactIds.length} artifacts.`;
}

export function collectScenarioArtifacts(result: ScenarioRunResult, artifacts: WorkspaceArtifactRecord[]) {
  const ids = new Set(result.createdArtifactIds);
  return artifacts.filter((item) => ids.has(item.id));
}
