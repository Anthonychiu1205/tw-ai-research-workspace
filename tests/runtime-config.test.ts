import { describe, expect, test } from "vitest";
import { getDefaultRuntimeConfig, normalizeRuntimeConfig, buildRuntimeStatus } from "@/lib/config/runtime";

describe("runtime config", () => {
  test("default config is mock", () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    const config = getDefaultRuntimeConfig();
    expect(config.mode).toBe("mock");
    expect(config.fallbackToMock).toBe(true);
  });

  test("api mode allows base URL and fallback-safe", () => {
    const config = normalizeRuntimeConfig({ mode: "api", apiBaseUrl: "http://localhost:8000", fallbackToMock: true });
    expect(config.mode).toBe("api");
    expect(config.apiBaseUrl).toContain("localhost");
    expect(config.fallbackToMock).toBe(true);
  });

  test("unavailable provider reason works", () => {
    const status = buildRuntimeStatus({
      mode: "api",
      backendReachable: false,
      providerAvailable: false,
      providerUnavailableReason: "env-gated",
      fallbackActive: true,
    });
    expect(status.providerUnavailableReason).toBe("env-gated");
    expect(status.fallbackActive).toBe(true);
  });

  test("maxToolSteps bounded", () => {
    const config = normalizeRuntimeConfig({ maxToolSteps: 999 });
    expect(config.maxToolSteps).toBe(8);
  });
});
