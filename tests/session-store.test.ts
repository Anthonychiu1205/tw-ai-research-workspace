import { describe, expect, test } from "vitest";
import { createSessionStore } from "@/lib/sessions/session-store";

const seed = {
  id: "s1",
  title: "Session 1",
  runtimeMode: "mock",
  modelId: "mock-research",
  provider: "mock",
  messages: [],
  artifacts: [],
  updatedAt: "2026-05-08T10:00:00+08:00",
} as const;

describe("session store", () => {
  test("create/list/update/delete", () => {
    const store = createSessionStore();
    store.upsert(seed as any);
    expect(store.list().length).toBeGreaterThan(0);

    const updated = { ...seed, title: "Updated", updatedAt: "2026-05-08T10:01:00+08:00" };
    store.upsert(updated as any);
    expect(store.get(seed.id)?.title).toBe("Updated");

    expect(store.remove(seed.id)).toBe(true);
  });

  test("handles unavailable localStorage gracefully", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", { value: undefined, configurable: true });

    const store = createSessionStore();
    expect(() => store.list()).not.toThrow();

    if (original) {
      Object.defineProperty(window, "localStorage", original);
    }
  });
});
