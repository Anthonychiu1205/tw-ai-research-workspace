import type { WorkspaceMessage, WorkspaceSession } from "@/lib/schemas/workspace";

export type SessionStoreApi = {
  list(): WorkspaceSession[];
  get(id: string): WorkspaceSession | undefined;
  create(title?: string): WorkspaceSession;
  rename(id: string, title: string): WorkspaceSession | undefined;
  updateMessages(id: string, messages: WorkspaceMessage[]): WorkspaceSession | undefined;
  upsert(session: WorkspaceSession): WorkspaceSession;
  duplicate(id: string): WorkspaceSession | undefined;
  remove(id: string): boolean;
  clear(): void;
  exportJson(): string;
  importJson(raw: string): { imported: number; skipped: number };
};
