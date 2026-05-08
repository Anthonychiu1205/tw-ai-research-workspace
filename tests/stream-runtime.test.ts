import { describe, expect, test } from "vitest";
import { runAssistantRuntime } from "@/lib/ai/runtime";

describe("stream runtime", () => {
  test("mock stream produces message_delta and final", async () => {
    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: "Analyze 2330" }],
      provider: "mock",
      modelId: "mock-research",
    });

    expect(runtime.events.some((event) => event.type === "message_delta")).toBe(true);
    expect(runtime.events.some((event) => event.type === "final")).toBe(true);
  });

  test("mock stream includes disclaimer", async () => {
    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: "Analyze 2330" }],
      provider: "mock",
      modelId: "mock-research",
    });

    const final = runtime.events.find((event) => event.type === "final");
    expect(String(final?.payload?.disclaimer ?? "")).toContain("not financial advice");
  });

  test("tool call events include tool name/status", async () => {
    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: "Generate a report for 2330" }],
      provider: "mock",
      modelId: "mock-research",
    });

    const resultEvent = runtime.events.find((event) => event.type === "tool_call_result");
    expect(resultEvent?.payload?.toolName).toBeTruthy();
    expect(resultEvent?.payload?.status).toBeTruthy();
  });

  test("fallback happens when real provider unavailable", async () => {
    process.env.NEXT_PUBLIC_ENABLE_REAL_MODELS = "false";

    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: "Analyze 2330" }],
      provider: "openai",
      modelId: "gpt-4.1-mini",
      runtimeConfig: { mode: "api" },
    });

    expect(runtime.warning).toContain("unavailable");
    expect(runtime.status.fallbackActive).toBe(true);
  });

  test("max steps bounded", async () => {
    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: "signal report pipeline compare evidence 2330" }],
      provider: "mock",
      modelId: "mock-research",
      runtimeConfig: { maxToolSteps: 1 },
    });

    const toolResults = runtime.events.filter((event) => event.type === "tool_call_result");
    expect(toolResults.length).toBeLessThanOrEqual(1);
  });
});
