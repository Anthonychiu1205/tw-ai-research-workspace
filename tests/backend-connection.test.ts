import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import {
  getDefaultRuntimeSettings,
  normalizeRuntimeSettings,
  restoreRuntimeSettings,
  persistRuntimeSettings,
  buildBackendConnectionState,
} from "@/lib/config/runtime";
import { RUNTIME_SETTINGS_KEY } from "@/lib/sessions/local-storage";
import { getProviderUnavailableReason } from "@/lib/config/models";

describe("backend connection", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "mock";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("mock mode default", () => {
    const settings = getDefaultRuntimeSettings();
    expect(settings.mode).toBe("mock");
    expect(settings.fallbackToMock).toBe(true);
  });

  test("api health success with fake client", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ok", appTitle: "Backend" }),
      }),
    );

    const state = await buildBackendConnectionState(
      normalizeRuntimeSettings({ mode: "api", apiBaseUrl: "http://localhost:8000" }),
    );

    expect(state.mode).toBe("api");
    expect(state.reachable).toBe(true);
  });

  test("api health failure fallback", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "proxy";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const state = await buildBackendConnectionState(
      normalizeRuntimeSettings({ mode: "api", apiBaseUrl: "http://localhost:8000" }),
    );

    expect(state.reachable).toBe(false);
    expect(state.fallbackActive).toBe(true);
  });

  test("settings persisted/restored", () => {
    persistRuntimeSettings({ mode: "api", apiBaseUrl: "http://localhost:9000", maxToolSteps: 2 });
    const restored = restoreRuntimeSettings();
    expect(restored.mode).toBe("api");
    expect(restored.apiBaseUrl).toContain("9000");
    expect(restored.maxToolSteps).toBe(2);
  });

  test("corrupted settings fallback", () => {
    window.localStorage.setItem(RUNTIME_SETTINGS_KEY, "not-json");
    const restored = restoreRuntimeSettings();
    expect(restored.mode).toBe("mock");
  });

  test("maxToolSteps bounded", () => {
    const bounded = normalizeRuntimeSettings({ maxToolSteps: 999 });
    expect(bounded.maxToolSteps).toBe(8);
  });

  test("provider unavailable reason shown", () => {
    process.env.NEXT_PUBLIC_ENABLE_REAL_MODELS = "false";
    const reason = getProviderUnavailableReason("openai");
    expect(reason).toMatch(/missing|disabled/i);
  });
});
