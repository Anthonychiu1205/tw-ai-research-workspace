import { workspaceSessionSchema, runtimeSettingsSchema, type RuntimeSettings, type WorkspaceSession } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

export type WorkspaceBackup = {
  schemaVersion: "workspace-backup.v0.3";
  exportedAt: string;
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
};

export type WorkspaceShareBundle = {
  schemaVersion: "workspace-share-bundle.v0.5";
  bundleId: string;
  createdAt: string;
  source: "mock" | "api" | "mock_fallback";
  synthetic: boolean;
  notFinancialAdvice: true;
  noTradingExecution: true;
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
  scenariosCompleted: string[];
  checksum: string;
};

type ShareBundleInput = {
  sessions: WorkspaceSession[];
  artifacts: WorkspaceArtifactRecord[];
  runtimeSettings: RuntimeSettings;
  scenariosCompleted?: string[];
  source?: WorkspaceShareBundle["source"];
  synthetic?: boolean;
};

function stableSerialize(input: unknown): string {
  if (Array.isArray(input)) {
    return `[${input.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (!input || typeof input !== "object") {
    return JSON.stringify(input);
  }

  const entries = Object.entries(input as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableSerialize(v)}`).join(",")}}`;
}

export function computeBundleChecksum(input: Omit<WorkspaceShareBundle, "checksum">): string {
  const value = stableSerialize(input);
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return `bundle_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

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

export function createWorkspaceShareBundle(input: ShareBundleInput): WorkspaceShareBundle {
  const base = {
    schemaVersion: "workspace-share-bundle.v0.5" as const,
    bundleId: `wsb_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    source: input.source ?? "mock",
    synthetic: input.synthetic ?? (input.source ? input.source !== "api" : true),
    notFinancialAdvice: true as const,
    noTradingExecution: true as const,
    sessions: input.sessions.map((session) => workspaceSessionSchema.parse(session)),
    artifacts: input.artifacts,
    runtimeSettings: runtimeSettingsSchema.parse(input.runtimeSettings),
    scenariosCompleted: Array.isArray(input.scenariosCompleted) ? input.scenariosCompleted : [],
  };

  return {
    ...base,
    checksum: computeBundleChecksum(base),
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

export function validateWorkspaceShareBundle(input: unknown): {
  ok: boolean;
  error?: string;
  value?: WorkspaceShareBundle;
} {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Share bundle must be an object" };
  }

  const candidate = input as Partial<WorkspaceShareBundle>;
  if (candidate.schemaVersion !== "workspace-share-bundle.v0.5") {
    return { ok: false, error: "Unsupported share bundle schemaVersion" };
  }

  if (candidate.notFinancialAdvice !== true || candidate.noTradingExecution !== true) {
    return { ok: false, error: "Share bundle safety metadata is invalid" };
  }

  if (candidate.source !== "mock" && candidate.source !== "api" && candidate.source !== "mock_fallback") {
    return { ok: false, error: "Invalid share bundle source" };
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
  const scenariosCompleted = Array.isArray(candidate.scenariosCompleted)
    ? candidate.scenariosCompleted.filter((item): item is string => typeof item === "string")
    : [];

  const base = {
    schemaVersion: "workspace-share-bundle.v0.5" as const,
    bundleId: typeof candidate.bundleId === "string" ? candidate.bundleId : "wsb_unknown",
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : new Date().toISOString(),
    source: candidate.source,
    synthetic: Boolean(candidate.synthetic),
    notFinancialAdvice: true as const,
    noTradingExecution: true as const,
    sessions,
    artifacts,
    runtimeSettings: runtimeResult.data,
    scenariosCompleted,
  };
  const checksum = typeof candidate.checksum === "string" ? candidate.checksum : "";
  const expected = computeBundleChecksum(base);

  if (checksum !== expected) {
    return { ok: false, error: "Share bundle checksum mismatch" };
  }

  return {
    ok: true,
    value: {
      ...base,
      checksum,
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

export function exportWorkspaceShareBundle(input: ShareBundleInput) {
  return JSON.stringify(createWorkspaceShareBundle(input), null, 2);
}

export function importWorkspaceState(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return validateWorkspaceBackup(parsed);
  } catch {
    return { ok: false as const, error: "Invalid JSON" };
  }
}

export function importWorkspaceShareBundle(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return validateWorkspaceShareBundle(parsed);
  } catch {
    return { ok: false as const, error: "Invalid JSON" };
  }
}
