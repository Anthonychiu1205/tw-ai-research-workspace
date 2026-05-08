import { createDefaultOperationRequest, runResearchOperation } from "@/lib/operations/operation-runner";
import type { ArtifactStoreApi } from "@/lib/artifacts/artifact-store";
import { getScenarioById } from "@/lib/scenarios/scenario-registry";
import type { ScenarioRunEvent, ScenarioRunResult, ScenarioStep, WorkspaceScenarioId } from "@/lib/scenarios/scenario-types";

function cloneSteps(steps: ScenarioStep[]): ScenarioStep[] {
  return steps.map((step) => ({ ...step }));
}

function toStepStatus(steps: ScenarioStep[], stepId: string, status: ScenarioStep["status"]) {
  return steps.map((step) => (step.id === stepId ? { ...step, status } : step));
}

export async function runScenario(input: {
  scenarioId: WorkspaceScenarioId;
  artifactStore: ArtifactStoreApi;
  onEvent?: (event: ScenarioRunEvent) => void;
  onMessage?: (message: string) => void;
  onArtifactCreated?: (artifactId: string) => void;
}): Promise<ScenarioRunResult> {
  const scenario = getScenarioById(input.scenarioId);
  if (!scenario) {
    return {
      scenarioId: input.scenarioId,
      status: "failed",
      steps: [],
      createdArtifactIds: [],
      operationResults: [],
      warnings: [],
      error: `Unknown scenario: ${input.scenarioId}`,
    };
  }

  let steps = cloneSteps(scenario.steps);
  const createdArtifactIds: string[] = [];
  const operationResults: ScenarioRunResult["operationResults"] = [];
  const warnings: string[] = [];

  for (const step of scenario.steps) {
    if (!step.operationKind) {
      continue;
    }

    input.onEvent?.({
      type: "step_start",
      scenarioId: scenario.id,
      stepId: step.id,
      message: `Starting ${step.title}`,
    });
    steps = toStepStatus(steps, step.id, "running");

    const request = createDefaultOperationRequest(step.operationKind);
    if (scenario.defaultTicker) {
      request.ticker = scenario.defaultTicker;
    }
    if (scenario.defaultTickers) {
      request.tickers = scenario.defaultTickers;
      request.ticker = scenario.defaultTickers[0] ?? request.ticker;
    }

    const result = await runResearchOperation(request, input.artifactStore);
    operationResults.push(result);

    if (result.status === "failed") {
      steps = toStepStatus(steps, step.id, "failed");
      input.onEvent?.({
        type: "step_fail",
        scenarioId: scenario.id,
        stepId: step.id,
        message: result.error ?? "Scenario step failed",
      });

      return {
        scenarioId: scenario.id,
        status: "failed",
        steps,
        createdArtifactIds,
        operationResults,
        warnings,
        error: result.error ?? "Scenario failed safely",
      };
    }

    steps = toStepStatus(steps, step.id, "succeeded");
    createdArtifactIds.push(...result.artifactIds);
    warnings.push(...result.warnings);

    if (result.artifactIds[0]) {
      input.onArtifactCreated?.(result.artifactIds[0]);
    }

    input.onMessage?.(
      `Scenario ${scenario.title}: completed step ${step.title}. Generated artifacts: ${result.artifactIds.join(",") || "none"}. Synthetic output only, not financial advice.`,
    );

    input.onEvent?.({
      type: "step_complete",
      scenarioId: scenario.id,
      stepId: step.id,
      message: `Completed ${step.title}`,
    });
  }

  return {
    scenarioId: scenario.id,
    status: "succeeded",
    steps,
    createdArtifactIds,
    operationResults,
    warnings,
  };
}
