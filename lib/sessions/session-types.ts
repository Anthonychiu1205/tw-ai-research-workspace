import type { WorkspaceSession } from "@/lib/schemas/workspace";

export type SessionStoreApi = {
  list(): WorkspaceSession[];
  get(id: string): WorkspaceSession | undefined;
  upsert(session: WorkspaceSession): WorkspaceSession;
  remove(id: string): boolean;
};
