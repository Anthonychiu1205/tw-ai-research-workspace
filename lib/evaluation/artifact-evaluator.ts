import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { createWorkspaceShareBundle, validateWorkspaceShareBundle } from "@/lib/workspace/export-import";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";
import type { WorkspaceEvaluationCheck } from "@/lib/evaluation/workspace-evaluation-types";

export function evaluateArtifacts(): WorkspaceEvaluationCheck[] {
  const store = createArtifactStore([]);
  const artifacts = store.listAll();

  const metadataOk = artifacts.every(
    (artifact) => artifact.synthetic === true && artifact.notFinancialAdvice === true && artifact.noTradingExecution === true,
  );

  const share = createWorkspaceShareBundle({
    sessions: [],
    artifacts,
    runtimeSettings: getDefaultRuntimeSettings(),
    source: "mock",
    synthetic: true,
    scenariosCompleted: ["analyze_2330"],
  });

  const validShare = validateWorkspaceShareBundle(share).ok;

  return [
    {
      name: "artifacts_metadata_safe",
      category: "artifacts",
      passed: metadataOk,
      severity: "error",
      details: `artifactCount=${artifacts.length}`,
    },
    {
      name: "share_bundle_valid",
      category: "artifacts",
      passed: validShare,
      severity: "error",
      details: "Workspace share bundle should validate with checksum",
    },
  ];
}
