import { workspaceSessionSchema, runtimeSettingsSchema, type RuntimeSettings, type WorkspaceSession } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

export type WorkspaceBackup = {
  schemaVersion: "workspace-backup.v0.3";
  exportedAt: string;
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
};

export function createWorkspaceBackup(input: {
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
}): WorkspaceBackup {
  return {
    schemaVersion: "workspace-backup.v0.3",
    exportedAt: new Date().toISOString(),
    sessions: input.sessions.map((session) => workspaceSessionSchema.parse(session)),
    artifacts: input.artifacts,
    runtimeSettings: runtimeSettingsSchema.parse(input.runtimeSettings),
  };
}

export function validateWorkspaceBackup(input: unknown): {
  ok: boolean;
  error?: string;
  value?: WorkspaceBackup;
} {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Backup must be an object" };
  }

  const candidate = input as Partial<WorkspaceBackup>;
  if (candidate.schemaVersion !== "workspace-backup.v0.3") {
    return { ok: false, error: "Unsupported schemaVersion" };
  }

  const sessions = Array.isArray(candidate.sessions)
    ? candidate.sessions
        .map((item) => workspaceSessionSchema.safeParse(item))
        .filter((result) => result.success)
        .map((result) => result.data)
    : [];

  const runtimeResult = runtimeSettingsSchema.safeParse(candidate.runtimeSettings);
  if (!runtimeResult.success) {
    return { ok: false, error: "Invalid runtimeSettings" };
  }

  const artifacts = Array.isArray(candidate.artifacts) ? (candidate.artifacts as WorkspaceArtifactRecord[]) : [];

  return {
    ok: true,
    value: {
      schemaVersion: "workspace-backup.v0.3",
      exportedAt: typeof candidate.exportedAt === "string" ? candidate.exportedAt : new Date().toISOString(),
      sessions,
      artifacts,
      runtimeSettings: runtimeResult.data,
    },
  };
}

export function exportWorkspaceState(input: {
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
}) {
  return JSON.stringify(createWorkspaceBackup(input), null, 2);
}

export function importWorkspaceState(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return validateWorkspaceBackup(parsed);
  } catch {
    return { ok: false as const, error: "Invalid JSON" };
  }
}
