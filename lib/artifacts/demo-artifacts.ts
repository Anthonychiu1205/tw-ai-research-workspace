import sessionDemo from "@/fixtures/demo/session-demo.json";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

export function getDemoArtifacts() {
  return (sessionDemo.artifacts as any[]).map((artifact) => ({
    ...artifact,
    sessionId: artifact.sessionId ?? "session-1",
    pinned: artifact.pinned ?? false,
    synthetic: artifact.synthetic ?? true,
    notFinancialAdvice: true,
    noTradingExecution: true,
  })) as WorkspaceArtifactRecord[];
}
