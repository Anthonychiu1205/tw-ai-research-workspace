import { describe, expect, test } from "vitest";
import { runAssistantRuntime } from "@/lib/ai/runtime";

async function toolStartsForPrompt(prompt: string) {
  const runtime = await runAssistantRuntime({
    messages: [{ role: "user", content: prompt }],
    provider: "mock",
    modelId: "mock-research",
    runtimeConfig: { mode: "mock", maxToolSteps: 4, streamToolCalls: true },
  });

  return runtime.events
    .filter((event) => event.type === "tool_call_start")
    .map((event) => String(event.payload.toolName));
}

describe("chat route runtime", () => {
  test("analyze prompt triggers runResearch event", async () => {
    const starts = await toolStartsForPrompt("Analyze 2330 now");
    expect(starts).toContain("runResearch");
  });

  test("report prompt triggers generateReport event", async () => {
    const starts = await toolStartsForPrompt("Generate report for 2330");
    expect(starts).toContain("generateReport");
  });

  test("strategy prompt triggers compareStrategies event", async () => {
    const starts = await toolStartsForPrompt("Compare strategy profiles");
    expect(starts).toContain("compareStrategies");
  });

  test("pipeline prompt triggers runPipeline event", async () => {
    const starts = await toolStartsForPrompt("Show pipeline trace");
    expect(starts).toContain("runPipeline");
  });

  test("signal prompt triggers evaluateSignals event", async () => {
    const starts = await toolStartsForPrompt("Evaluate signal distribution");
    expect(starts).toContain("evaluateSignals");
  });

  test("portfolio prompt triggers runPortfolioReview event", async () => {
    const starts = await toolStartsForPrompt("Run portfolio review for 2330 watchlist");
    expect(starts).toContain("runPortfolioReview");
  });

  test("backtest v2 prompt triggers runBacktestV2 event", async () => {
    const starts = await toolStartsForPrompt("Run portfolio backtest v2 for watchlist");
    expect(starts).toContain("runBacktestV2");
  });

  test("general prompt still returns final", async () => {
    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: "Hello workspace" }],
      provider: "mock",
      modelId: "mock-research",
      runtimeConfig: { mode: "mock" },
    });

    expect(runtime.events.some((event) => event.type === "final")).toBe(true);
  });

  test("no trading tool triggered", async () => {
    const starts = await toolStartsForPrompt("analyze 2330");
    expect(starts.some((name) => /trade|broker|order/i.test(name))).toBe(false);
  });
});
