import { afterEach, describe, expect, test, vi } from "vitest";
import * as client from "@/lib/api/client";

afterEach(() => {
  vi.unstubAllGlobals();
  process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
});

describe("api client", () => {
  test("mock mode returns fixtures", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    const result = await client.runResearch({ symbol: "2330" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.data as any).metadata.provider).toBe("mock");
    }
  });

  test("api mode fallback on failure", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("network down");
    }));

    const result = await client.runPipeline({ symbol: "2330" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fallbackData).toBeTruthy();
      expect(result.error.code).toBe("NETWORK");
    }
  });

  test("typed error is returned instead of throw", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({}),
      })),
    );

    const result = await client.generateReport({ symbol: "2330" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.name).toBe("WorkspaceApiError");
    }
  });
});
