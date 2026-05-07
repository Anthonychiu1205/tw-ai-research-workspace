import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { getDemoArtifacts } from "@/lib/artifacts/demo-artifacts";

export function listArtifacts(): WorkspaceArtifactRecord[] {
  return getDemoArtifacts() as WorkspaceArtifactRecord[];
}
