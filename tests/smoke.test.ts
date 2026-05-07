import { describe, expect, test } from "vitest";
import researchRun from "@/fixtures/mock-api/research-run.json";
import { workspaceTools } from "@/lib/ai/tool-registry";

describe("workspace smoke", () => {
  test("core imports work", async () => {
    const env = await import("@/lib/config/env");
    expect(env.getEnvConfig).toBeTypeOf("function");
  });

  test("fixture metadata has synthetic/non-advice flags", () => {
    expect(researchRun.metadata.provider).toBe("mock");
    expect(researchRun.metadata.dataType).toBe("synthetic_mock");
    expect(researchRun.metadata.notFinancialAdvice).toBe(true);
    expect(researchRun.metadata.noTradingExecution).toBe(true);
  });

  test("no trading tools", () => {
    const names = workspaceTools.map((tool) => tool.name.toLowerCase());
    expect(names.some((name) => name.includes("trade") || name.includes("broker"))).toBe(false);
  });
});
