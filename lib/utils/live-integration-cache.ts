export type LiveIntegrationSnapshot = {
  checkedAt: string;
  baseUrl: string;
  reachable: boolean;
  fallbackActive: boolean;
  fallbackReason?: string;
  source: "connection_check";
};

const STORAGE_KEY = "workspace.liveBackendIntegrationReport";

export function readLiveIntegrationSnapshot(): LiveIntegrationSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LiveIntegrationSnapshot;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.checkedAt !== "string" || typeof parsed.baseUrl !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeLiveIntegrationSnapshot(snapshot: LiveIntegrationSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Best effort cache only.
  }
}
