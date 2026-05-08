import { describe, expect, test } from "vitest";
import { runAssistantRuntime } from "@/lib/ai/runtime";
import { getModelOptions } from "@/lib/config/models";

describe("mock runtime", () => {
  test("returns deterministic events", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    const output = await runAssistantRuntime({
      messages: [{ role: "user", content: "summarize 2330" }],
      modelId: "mock-research",
      provider: "mock",
    });

    expect(output.events.some((event) => event.type === "message_delta")).toBe(true);
    expect(output.events.some((event) => event.type === "final")).toBe(true);
  });

  test("model availability is env-gated", () => {
    process.env.NEXT_PUBLIC_ENABLE_REAL_MODELS = "false";
    process.env.OPENAI_API_KEY = "";
    const models = getModelOptions();
    const openai = models.find((m) => m.provider === "openai");
    expect(openai?.available).toBe(false);
  });
});
