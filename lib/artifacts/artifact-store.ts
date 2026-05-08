import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { getDemoArtifacts } from "@/lib/artifacts/demo-artifacts";
import { readArtifactsFromLocalStorage, writeArtifactsToLocalStorage } from "@/lib/sessions/local-storage";
import { createId } from "@/lib/utils/ids";
import { nowIso } from "@/lib/utils/dates";

export type ArtifactStoreApi = {
  create(input: Pick<WorkspaceArtifactRecord, "sessionId" | "kind" | "title">): WorkspaceArtifactRecord;
  listBySession(sessionId: string): WorkspaceArtifactRecord[];
  listAll(): WorkspaceArtifactRecord[];
  pin(id: string): WorkspaceArtifactRecord | undefined;
  unpin(id: string): WorkspaceArtifactRecord | undefined;
  remove(id: string): boolean;
  exportJson(): string;
  importJson(raw: string): { imported: number; skipped: number };
};

export function createArtifactStore(seed: WorkspaceArtifactRecord[] = []): ArtifactStoreApi {
  let artifacts = seed.length > 0 ? [...seed] : (getDemoArtifacts() as WorkspaceArtifactRecord[]);

  const load = () => {
    const saved = readArtifactsFromLocalStorage();
    if (saved.length > 0) {
      artifacts = saved;
    }
  };

  const save = () => writeArtifactsToLocalStorage(artifacts);

  return {
    create(input) {
      const next: WorkspaceArtifactRecord = {
        id: createId("artifact"),
        sessionId: input.sessionId,
        kind: input.kind,
        title: input.title,
        pinned: false,
        synthetic: true,
        notFinancialAdvice: true,
        noTradingExecution: true,
        createdAt: nowIso(),
      };
      artifacts.unshift(next);
      save();
      return next;
    },
    listBySession(sessionId) {
      load();
      return artifacts.filter((artifact) => artifact.sessionId === sessionId);
    },
    listAll() {
      load();
      return [...artifacts];
    },
    pin(id) {
      const found = artifacts.find((item) => item.id === id);
      if (!found) {
        return undefined;
      }
      found.pinned = true;
      save();
      return found;
    },
    unpin(id) {
      const found = artifacts.find((item) => item.id === id);
      if (!found) {
        return undefined;
      }
      found.pinned = false;
      save();
      return found;
    },
    remove(id) {
      const before = artifacts.length;
      artifacts = artifacts.filter((item) => item.id !== id);
      save();
      return artifacts.length < before;
    },
    exportJson() {
      return JSON.stringify(artifacts, null, 2);
    },
    importJson(raw) {
      try {
        const parsed = JSON.parse(raw) as WorkspaceArtifactRecord[];
        let imported = 0;
        let skipped = 0;
        for (const item of parsed) {
          if (
            item &&
            typeof item.id === "string" &&
            typeof item.sessionId === "string" &&
            typeof item.kind === "string" &&
            typeof item.title === "string"
          ) {
            const existing = artifacts.findIndex((artifact) => artifact.id === item.id);
            if (existing >= 0) {
              artifacts[existing] = item;
            } else {
              artifacts.unshift(item);
            }
            imported += 1;
          } else {
            skipped += 1;
          }
        }
        save();
        return { imported, skipped };
      } catch {
        return { imported: 0, skipped: 1 };
      }
    },
  };
}
