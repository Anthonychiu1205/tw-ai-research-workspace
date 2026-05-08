import { describe, expect, test } from "vitest";
import { POST as chatPost } from "@/app/api/chat/route";

async function readEvents(prompt: string) {
  const req = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      provider: "mock",
      modelId: "mock-research",
      runtimeMode: "mock",
      streamToolCalls: true,
      maxToolSteps: 4,
    }),
  });

  const res = await chatPost(req);
  const text = await res.text();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

describe("chat stream protocol", () => {
  test("route/runtime returns parseable JSONL events", async () => {
    const events = await readEvents("hello workspace");
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty("type");
  });

  test("event ordering includes final", async () => {
    const events = await readEvents("hello workspace");
    expect(events.some((event) => event.type === "final")).toBe(true);
    expect(events[events.length - 1].type).toBe("final");
  });

  test("analyze prompt includes runResearch", async () => {
    const events = await readEvents("analyze 2330");
    const tools = events.filter((event) => event.type === "tool_call_start").map((event) => event.payload.toolName);
    expect(tools).toContain("runResearch");
  });

  test("report prompt includes generateReport", async () => {
    const events = await readEvents("generate report");
    const tools = events.filter((event) => event.type === "tool_call_start").map((event) => event.payload.toolName);
    expect(tools).toContain("generateReport");
  });

  test("token usage event exists", async () => {
    const events = await readEvents("hello workspace");
    expect(events.some((event) => event.type === "token_usage")).toBe(true);
  });

  test("disclaimer in final", async () => {
    const events = await readEvents("hello workspace");
    const final = events.find((event) => event.type === "final");
    expect(String(final?.payload?.disclaimer ?? "").toLowerCase()).toContain("not financial advice");
  });

  test("no trading event exists", async () => {
    const events = await readEvents("analyze 2330");
    const toolNames = events
      .filter((event) => event.type === "tool_call_start")
      .map((event) => String(event.payload.toolName ?? "").toLowerCase());
    expect(toolNames.some((name) => name.includes("trade") || name.includes("broker") || name.includes("order"))).toBe(false);
  });
});
