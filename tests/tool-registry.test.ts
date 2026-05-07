import { describe, expect, test } from "vitest";
import { getToolByName, workspaceTools } from "@/lib/ai/tool-registry";

describe("tool registry", () => {
  test("tools listed", () => {
    expect(workspaceTools.length).toBe(8);
  });

  test("schemas validate inputs", () => {
    const tool = getToolByName("runResearch");
    expect(tool).toBeTruthy();
    const parsed = tool?.inputSchema.safeParse({ symbol: "2330" });
    expect(parsed?.success).toBe(true);
  });

  test("mock execution returns tool result", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    const tool = getToolByName("generateReport");
    const result = await tool?.execute({ symbol: "2330" });
    expect(result?.status).toBe("success");
  });

  test("unknown tool handled", () => {
    expect(getToolByName("unknown-tool")).toBeUndefined();
  });
});
