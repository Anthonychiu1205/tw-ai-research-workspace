import {
  workspaceMessageSchema,
  workspaceSessionSchema,
  type WorkspaceMessage,
  type WorkspaceSession,
} from "@/lib/schemas/workspace";
import { readSessionsFromLocalStorage, writeSessionsToLocalStorage } from "@/lib/sessions/local-storage";
import type { SessionStoreApi } from "@/lib/sessions/session-types";
import { createId } from "@/lib/utils/ids";
import { nowIso } from "@/lib/utils/dates";

function newSession(title = "New Research Session"): WorkspaceSession {
  return workspaceSessionSchema.parse({
    id: createId("session"),
    title,
    schemaVersion: "workspace-session.v0.2",
    runtimeMode: "mock",
    modelId: "mock-research",
    provider: "mock",
    messages: [],
    artifacts: [],
    updatedAt: nowIso(),
  });
}

export function createSessionStore(seed: WorkspaceSession[] = []): SessionStoreApi {
  let sessions = [...seed];

  const load = () => {
    const ls = readSessionsFromLocalStorage();
    if (ls.length > 0) {
      sessions = ls;
    }
  };

  const save = () => writeSessionsToLocalStorage(sessions);

  return {
    list() {
      load();
      return [...sessions];
    },
    get(id) {
      load();
      return sessions.find((item) => item.id === id);
    },
    create(title) {
      const session = newSession(title);
      sessions.unshift(session);
      save();
      return session;
    },
    rename(id, title) {
      const found = sessions.find((item) => item.id === id);
      if (!found) {
        return undefined;
      }
      found.title = title.trim() || found.title;
      found.updatedAt = nowIso();
      save();
      return found;
    },
    updateMessages(id, messages) {
      const parsedMessages = messages.map((message) => workspaceMessageSchema.parse(message));
      const found = sessions.find((item) => item.id === id);
      if (!found) {
        return undefined;
      }
      found.messages = parsedMessages as WorkspaceMessage[];
      found.updatedAt = nowIso();
      save();
      return found;
    },
    upsert(session) {
      const parsed = workspaceSessionSchema.parse(session);
      const index = sessions.findIndex((item) => item.id === parsed.id);
      if (index >= 0) {
        sessions[index] = parsed;
      } else {
        sessions.unshift(parsed);
      }
      save();
      return parsed;
    },
    duplicate(id) {
      const found = sessions.find((item) => item.id === id);
      if (!found) {
        return undefined;
      }
      const copy = workspaceSessionSchema.parse({
        ...found,
        id: createId("session"),
        title: `${found.title} (copy)`,
        updatedAt: nowIso(),
      });
      sessions.unshift(copy);
      save();
      return copy;
    },
    remove(id) {
      const before = sessions.length;
      sessions = sessions.filter((item) => item.id !== id);
      save();
      return sessions.length < before;
    },
    clear() {
      sessions = [];
      save();
    },
    exportJson() {
      return JSON.stringify(sessions, null, 2);
    },
    importJson(raw) {
      try {
        const parsed = JSON.parse(raw) as unknown[];
        let imported = 0;
        let skipped = 0;
        for (const entry of parsed) {
          const result = workspaceSessionSchema.safeParse(entry);
          if (result.success) {
            const existing = sessions.findIndex((item) => item.id === result.data.id);
            if (existing >= 0) {
              sessions[existing] = result.data;
            } else {
              sessions.unshift(result.data);
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
