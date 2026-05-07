import { workspaceSessionSchema, type WorkspaceSession } from "@/lib/schemas/workspace";
import type { SessionStoreApi } from "@/lib/sessions/session-types";
import { readSessionsFromLocalStorage, writeSessionsToLocalStorage } from "@/lib/sessions/local-storage";

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
    remove(id) {
      const before = sessions.length;
      sessions = sessions.filter((item) => item.id !== id);
      save();
      return sessions.length < before;
    },
  };
}
