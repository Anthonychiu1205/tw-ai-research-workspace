import type { WorkspaceSession } from "@/lib/schemas/workspace";

const STORAGE_KEY = "tw-ai-research-workspace:sessions";

export function readSessionsFromLocalStorage(): WorkspaceSession[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as WorkspaceSession[];
  } catch {
    return [];
  }
}

export function writeSessionsToLocalStorage(sessions: WorkspaceSession[]) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export { STORAGE_KEY };
