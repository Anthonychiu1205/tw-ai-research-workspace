import { describe, expect, test } from "vitest";
import { listScenarios } from "@/lib/scenarios/scenario-registry";

describe("scenario registry", () => {
  test("all scenarios listed", () => {
    const scenarios = listScenarios();
    expect(scenarios.length).toBe(6);
  });

  test("all scenarios are mock-safe", () => {
    const scenarios = listScenarios();
    expect(scenarios.every((item) => item.mockSafe === true)).toBe(true);
  });

  test("no trading scenario", () => {
    const scenarios = listScenarios();
    const text = JSON.stringify(scenarios).toLowerCase();
    expect(text.includes("trade") || text.includes("order") || text.includes("broker")).toBe(false);
  });

  test("expected artifacts declared", () => {
    const scenarios = listScenarios();
    expect(scenarios.every((item) => item.expectedArtifacts.length > 0)).toBe(true);
  });
});
