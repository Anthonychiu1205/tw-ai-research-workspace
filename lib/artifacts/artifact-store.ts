import type { ArtifactKind, WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { getDemoArtifacts } from "@/lib/artifacts/demo-artifacts";
import { readArtifactsFromLocalStorage, writeArtifactsToLocalStorage } from "@/lib/sessions/local-storage";
import { createId } from "@/lib/utils/ids";
import { nowIso } from "@/lib/utils/dates";

type ArtifactCreateInput = {
  sessionId?: string;
  kind?: ArtifactKind;
  type?: ArtifactKind;
  title: string;
  summary?: string;
  ticker?: string;
  tickers?: string[];
  asOfDate?: string;
  source?: WorkspaceArtifactRecord["source"];
  synthetic?: boolean;
  evidenceIds?: string[];
  relatedArtifactIds?: string[];
  lineage?: WorkspaceArtifactRecord["lineage"];
  data?: unknown;
};

type ArtifactFilter = {
  type?: ArtifactKind;
  ticker?: string;
  sessionId?: string;
  pinned?: boolean;
};

export type ArtifactStoreApi = {
  create(input: ArtifactCreateInput): WorkspaceArtifactRecord;
  update(id: string, patch: Partial<WorkspaceArtifactRecord>): WorkspaceArtifactRecord | undefined;
  get(id: string): WorkspaceArtifactRecord | undefined;
  listBySession(sessionId: string): WorkspaceArtifactRecord[];
  listAll(): WorkspaceArtifactRecord[];
  list(filter?: ArtifactFilter): WorkspaceArtifactRecord[];
  pin(id: string): WorkspaceArtifactRecord | undefined;
  unpin(id: string): WorkspaceArtifactRecord | undefined;
  remove(id: string): boolean;
  clear(): void;
  exportJson(): string;
  importJson(raw: string): { imported: number; skipped: number };
};

function normalizeArtifact(input: Partial<WorkspaceArtifactRecord> & { id: string; title: string }): WorkspaceArtifactRecord {
  const kind = input.type ?? input.kind ?? "research_card";
  return {
    id: input.id,
    type: kind,
    kind,
    title: input.title,
    summary: input.summary,
    createdAt: input.createdAt ?? nowIso(),
    updatedAt: input.updatedAt,
    sessionId: input.sessionId,
    ticker: input.ticker,
    tickers: input.tickers,
    asOfDate: input.asOfDate,
    source: input.source ?? "mock",
    synthetic: input.synthetic ?? true,
    notFinancialAdvice: true,
    noTradingExecution: true,
    evidenceIds: input.evidenceIds ?? [],
    relatedArtifactIds: input.relatedArtifactIds ?? [],
    lineage: input.lineage,
    data: input.data,
    pinned: input.pinned ?? false,
  };
}

export function createArtifactStore(seed: WorkspaceArtifactRecord[] = []): ArtifactStoreApi {
  let artifacts = seed.length > 0 ? [...seed] : (getDemoArtifacts() as WorkspaceArtifactRecord[]);

  const load = () => {
    const saved = readArtifactsFromLocalStorage();
    if (saved.length > 0) {
      artifacts = saved.map((item) => normalizeArtifact({ ...item, id: item.id, title: item.title }));
      return;
    }

    artifacts = artifacts.map((item) => normalizeArtifact({ ...item, id: item.id, title: item.title }));
  };

  const save = () => writeArtifactsToLocalStorage(artifacts);

  load();

  return {
    create(input) {
      const next = normalizeArtifact({
        id: createId("artifact"),
        sessionId: input.sessionId,
        type: input.type ?? input.kind ?? "research_card",
        kind: input.kind ?? input.type,
        title: input.title,
        summary: input.summary,
        ticker: input.ticker,
        tickers: input.tickers,
        asOfDate: input.asOfDate,
        source: input.source ?? "mock",
        synthetic: input.synthetic ?? true,
        evidenceIds: input.evidenceIds ?? [],
        relatedArtifactIds: input.relatedArtifactIds ?? [],
        lineage: input.lineage,
        data: input.data,
        pinned: false,
        createdAt: nowIso(),
      });

      artifacts.unshift(next);
      save();
      return next;
    },
    update(id, patch) {
      const index = artifacts.findIndex((item) => item.id === id);
      if (index < 0) {
        return undefined;
      }

      const merged = normalizeArtifact({
        ...artifacts[index],
        ...patch,
        id,
        title: patch.title ?? artifacts[index].title,
        updatedAt: nowIso(),
      });

      artifacts[index] = merged;
      save();
      return merged;
    },
    get(id) {
      load();
      return artifacts.find((item) => item.id === id);
    },
    listBySession(sessionId) {
      load();
      return artifacts.filter((artifact) => artifact.sessionId === sessionId);
    },
    listAll() {
      load();
      return [...artifacts];
    },
    list(filter) {
      load();
      return artifacts.filter((item) => {
        if (filter?.type && item.type !== filter.type) return false;
        if (filter?.ticker && item.ticker !== filter.ticker && !item.tickers?.includes(filter.ticker)) return false;
        if (filter?.sessionId && item.sessionId !== filter.sessionId) return false;
        if (typeof filter?.pinned === "boolean" && item.pinned !== filter.pinned) return false;
        return true;
      });
    },
    pin(id) {
      return this.update(id, { pinned: true });
    },
    unpin(id) {
      return this.update(id, { pinned: false });
    },
    remove(id) {
      const before = artifacts.length;
      artifacts = artifacts.filter((item) => item.id !== id);
      save();
      return artifacts.length < before;
    },
    clear() {
      artifacts = [];
      save();
    },
    exportJson() {
      return JSON.stringify(artifacts, null, 2);
    },
    importJson(raw) {
      try {
        const parsed = JSON.parse(raw) as unknown[];
        let imported = 0;
        let skipped = 0;

        for (const entry of parsed) {
          if (!entry || typeof entry !== "object") {
            skipped += 1;
            continue;
          }

          const candidate = entry as Partial<WorkspaceArtifactRecord> & { id?: string; title?: string };
          if (!candidate.id || !candidate.title) {
            skipped += 1;
            continue;
          }

          const normalized = normalizeArtifact({ ...candidate, id: candidate.id, title: candidate.title });
          const existingIndex = artifacts.findIndex((artifact) => artifact.id === normalized.id);
          if (existingIndex >= 0) {
            artifacts[existingIndex] = normalized;
          } else {
            artifacts.unshift(normalized);
          }

          imported += 1;
        }

        save();
        return { imported, skipped };
      } catch {
        return { imported: 0, skipped: 1 };
      }
    },
  };
}
