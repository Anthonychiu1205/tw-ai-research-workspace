import { createId } from "@/lib/utils/ids";
import { evaluateScenarios } from "@/lib/evaluation/scenario-evaluator";
import { evaluateChatEvents } from "@/lib/evaluation/chat-event-evaluator";
import { evaluateArtifacts } from "@/lib/evaluation/artifact-evaluator";
import { evaluateSafetySources } from "@/lib/evaluation/safety-evaluator";
import type { WorkspaceEvaluationReport } from "@/lib/evaluation/workspace-evaluation-types";

export async function evaluateWorkspace(rootDir: string): Promise<WorkspaceEvaluationReport> {
  const checks = [
    ...(await evaluateScenarios()),
    ...(await evaluateChatEvents()),
    ...evaluateArtifacts(),
    ...evaluateSafetySources(rootDir),
  ];

  const warnings = checks.filter((check) => !check.passed && check.severity !== "error").map((check) => `${check.name}: ${check.details}`);
  const errors = checks.filter((check) => !check.passed && check.severity === "error");

  return {
    evaluationId: createId("workspace-eval"),
    createdAt: new Date().toISOString(),
    passed: errors.length === 0,
    checks,
    summary: `checks=${checks.length}, errors=${errors.length}, warnings=${warnings.length}`,
    warnings,
  };
}
