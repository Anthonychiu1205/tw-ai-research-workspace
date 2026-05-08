import { describe, expect, test } from "vitest";
import { createSessionStore } from "@/lib/sessions/session-store";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";

describe("session + artifact store", () => {
  test("session CRUD + version", () => {
    const store = createSessionStore();
    const created = store.create("My Session");
    expect(created.schemaVersion).toBe("workspace-session.v0.2");

    const renamed = store.rename(created.id, "Renamed Session");
    expect(renamed?.title).toBe("Renamed Session");

    const duplicated = store.duplicate(created.id);
    expect(duplicated?.id).not.toBe(created.id);

    expect(store.remove(created.id)).toBe(true);
  });

  test("session import/export", () => {
    const store = createSessionStore();
    const first = store.create("First");
    const exported = store.exportJson();

    store.clear();
    expect(store.list().length).toBe(0);

    const imported = store.importJson(exported);
    expect(imported.imported).toBeGreaterThan(0);
    expect(store.get(first.id)?.title).toBe("First");
  });

  test("artifact CRUD + pin + import/export", () => {
    const store = createArtifactStore([]);
    const created = store.create({ sessionId: "s1", kind: "report", title: "Synthetic Report" });
    expect(created.synthetic).toBe(true);

    const pinned = store.pin(created.id);
    expect(pinned?.pinned).toBe(true);

    const exported = store.exportJson();
    const removed = store.remove(created.id);
    expect(removed).toBe(true);

    const imported = store.importJson(exported);
    expect(imported.imported).toBeGreaterThan(0);
  });

  test("corrupted storage fallback import", () => {
    const store = createSessionStore();
    const result = store.importJson("not-json");
    expect(result.imported).toBe(0);
  });
});
