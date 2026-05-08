import type { WorkspaceSession, RuntimeSettings } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";

const SESSION_STORAGE_KEY = "tw-ai-research-workspace:sessions";
const ARTIFACT_STORAGE_KEY = "tw-ai-research-workspace:artifacts";
const RUNTIME_SETTINGS_KEY = "tw-ai-research-workspace:runtime-settings";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readSessionsFromLocalStorage(): WorkspaceSession[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  return safeParse<WorkspaceSession[]>(window.localStorage.getItem(SESSION_STORAGE_KEY)) ?? [];
}

export function writeSessionsToLocalStorage(sessions: WorkspaceSession[]) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

export function readArtifactsFromLocalStorage(): WorkspaceArtifactRecord[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  return safeParse<WorkspaceArtifactRecord[]>(window.localStorage.getItem(ARTIFACT_STORAGE_KEY)) ?? [];
}

export function writeArtifactsToLocalStorage(artifacts: WorkspaceArtifactRecord[]) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.setItem(ARTIFACT_STORAGE_KEY, JSON.stringify(artifacts));
}

export function readRuntimeSettingsFromLocalStorage(): RuntimeSettings | null {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  return safeParse<RuntimeSettings>(window.localStorage.getItem(RUNTIME_SETTINGS_KEY));
}

export function writeRuntimeSettingsToLocalStorage(settings: RuntimeSettings) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.setItem(RUNTIME_SETTINGS_KEY, JSON.stringify(settings));
}

export function clearRuntimeSettingsFromLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.removeItem(RUNTIME_SETTINGS_KEY);
}

export { SESSION_STORAGE_KEY, ARTIFACT_STORAGE_KEY, RUNTIME_SETTINGS_KEY };
