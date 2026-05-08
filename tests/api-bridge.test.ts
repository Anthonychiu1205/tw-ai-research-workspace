import { describe, expect, test, vi, beforeEach } from "vitest";
import { runBackendProxy } from "@/lib/api/backend-proxy";
import { runResearch } from "@/lib/api/client";

describe("api bridge", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    process.env.TW_AI_RESEARCH_API_BASE_URL = "http://localhost:8000";
  });

  test("health proxy success with mocked fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok", appTitle: "Backend" }),
      }),
    );

    const result = await runBackendProxy({ path: "/health", method: "GET" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.data as any).status).toBe("ok");
    }
  });

  test("proxy handles timeout/error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("abort", "AbortError")));

    const result = await runBackendProxy({ path: "/health", method: "GET", timeoutMs: 5 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TIMEOUT");
    }
  });

  test("proxy normalizes non-2xx", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "server error" }),
      }),
    );

    const result = await runBackendProxy({ path: "/v1/research-runs", method: "POST", body: {} });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("HTTP_ERROR");
      expect(result.status).toBe(500);
    }
  });

  test("client uses proxy path in api mode", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { runId: "run-1", symbol: "2330", metadata: { provider: "api" } } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runResearch({ symbol: "2330" });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/api/backend/research");
  });

  test("client falls back to mock if proxy unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("bridge offline")));

    const result = await runResearch({ symbol: "2330" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.meta.source).toBe("mock_fallback");
      expect(result.fallbackData).toBeTruthy();
    }
  });

  test("no secrets included in response", async () => {
    process.env.OPENAI_API_KEY = "sk-test-secret";

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("bridge offline")));

    const result = await runBackendProxy({ path: "/health", method: "GET" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const payload = JSON.stringify(result.error);
      expect(payload.includes("sk-test-secret")).toBe(false);
    }
  });
});
