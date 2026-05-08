import { afterEach, describe, expect, test, vi } from "vitest";
import {
  checkBackendHealth,
  generateReport,
  runPipeline,
  runResearch,
} from "@/lib/api/client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("api client hardening", () => {
  test("backend health success with mocked fetch", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ status: "ok", appTitle: "backend" }),
      })),
    );

    const result = await checkBackendHealth();
    expect(result.reachable).toBe(true);
    expect(result.status).toBe("ok");
  });

  test("backend health failure", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("offline");
    }));

    const result = await checkBackendHealth();
    expect(result.reachable).toBe(false);
    expect(result.error).toContain("offline");
  });

  test("api fallback to mock", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("api down");
    }));

    const result = await runPipeline({ symbol: "2330" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fallbackData).toBeTruthy();
      expect(result.meta.source).toBe("mock_fallback");
      expect(result.meta.fallbackUsed).toBe(true);
    }
  });

  test("typed error for non-2xx", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({}),
      })),
    );

    const result = await generateReport({ symbol: "2330" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("HTTP_ERROR");
    }
  });

  test("adapted result metadata source/fallback fields flow from client", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    const result = await runResearch({ symbol: "2330" });
    expect(result.meta.source).toBe("mock");
    expect(result.meta.notFinancialAdvice).toBe(true);
  });
});
