import { describe, expect, test } from "vitest";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";
import { buildCapabilityMatrix } from "@/lib/availability/capability-matrix";
import type { BackendConnectionState } from "@/lib/schemas/workspace";

function mockBackendState(patch: Partial<BackendConnectionState> = {}): BackendConnectionState {
  return {
    mode: "mock",
    apiBaseUrl: "http://localhost:8000",
    reachable: false,
    checkedAt: "2026-05-08T00:00:00.000Z",
    fallbackActive: false,
    ...patch,
  };
}

describe("capability matrix", () => {
  test("mock mode capabilities are available by default", () => {
    const matrix = buildCapabilityMatrix({
      runtime: getDefaultRuntimeSettings(),
      backend: mockBackendState(),
      artifactCount: 1,
    });

    expect(matrix.find((item) => item.id === "run_research")?.available).toBe(true);
    expect(matrix.find((item) => item.id === "generate_report")?.available).toBe(true);
    expect(matrix.find((item) => item.id === "open_artifact")?.available).toBe(true);
  });

  test("api-only capability is disabled when backend is unavailable", () => {
    const matrix = buildCapabilityMatrix({
      runtime: { ...getDefaultRuntimeSettings(), mode: "api" },
      backend: mockBackendState({ mode: "api", reachable: false, fallbackActive: true }),
      artifactCount: 0,
    });

    const apiMode = matrix.find((item) => item.id === "api_mode");
    expect(apiMode?.available).toBe(false);
    expect(apiMode?.reason).toMatch(/Backend unavailable|fallback/i);
  });

  test("no trading capability exists", () => {
    const ids = buildCapabilityMatrix({
      runtime: getDefaultRuntimeSettings(),
      backend: mockBackendState(),
      artifactCount: 0,
    }).map((item) => item.id);

    expect(ids.some((id) => id.includes("trade") || id.includes("order"))).toBe(false);
  });
});

