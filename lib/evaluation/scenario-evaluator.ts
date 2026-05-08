import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { listScenarios } from "@/lib/scenarios/scenario-registry";
import { runScenario } from "@/lib/scenarios/scenario-runner";
import type { WorkspaceEvaluationCheck } from "@/lib/evaluation/workspace-evaluation-types";

export async function evaluateScenarios(): Promise<WorkspaceEvaluationCheck[]> {
  const checks: WorkspaceEvaluationCheck[] = [];
  const scenarios = listScenarios();

  checks.push({
    name: "scenario_registry_non_empty",
    category: "scenarios",
    passed: scenarios.length > 0,
    severity: scenarios.length > 0 ? "info" : "error",
    details: `Scenario count=${scenarios.length}`,
  });

  checks.push({
    name: "scenarios_mock_safe",
    category: "scenarios",
    passed: scenarios.every((scenario) => scenario.mockSafe === true && scenario.requiresBackend === false),
    severity: "error",
    details: "All scenarios must be mock-safe and backend-optional by default",
  });

  for (const scenario of scenarios.slice(0, 3)) {
    const artifactStore = createArtifactStore([]);
    const result = await runScenario({ scenarioId: scenario.id, artifactStore });
    const hasArtifacts = result.createdArtifactIds.length > 0;

    checks.push({
      name: `scenario_${scenario.id}_artifact_output`,
      category: "scenarios",
      passed: result.status === "succeeded" && hasArtifacts,
      severity: "error",
      details: `status=${result.status}, artifacts=${result.createdArtifactIds.length}`,
    });

    const noTradingWords = !JSON.stringify(result).toLowerCase().includes("trade");
    checks.push({
      name: `scenario_${scenario.id}_no_trading_wording`,
      category: "safety",
      passed: noTradingWords,
      severity: "error",
      details: "Scenario result should avoid trading wording",
    });
  }

  return checks;
}
