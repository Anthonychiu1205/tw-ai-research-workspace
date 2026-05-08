import { describe, expect, test, vi } from "vitest";
import { getWorkspaceCommands } from "@/lib/commands/command-registry";

describe("command registry", () => {
  test("commands listed", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true });
    expect(commands.length).toBeGreaterThan(5);
  });

  test("no trading command", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true });
    expect(commands.some((command) => /trade|broker|order/i.test(command.label))).toBe(false);
  });

  test("Analyze 2330 command exists", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true });
    expect(commands.some((command) => command.label.includes("Analyze 2330"))).toBe(true);
  });

  test("switch mock mode command exists", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true });
    expect(commands.some((command) => command.id === "switch-mock-mode")).toBe(true);
  });

  test("unavailable command reason works", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: false });
    const target = commands.find((command) => command.id === "check-backend-health");
    expect(target?.unavailableReason).toBeTruthy();
  });

  test("command execution can create operation request", async () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true });
    const run = commands.find((command) => command.id === "analyze-2330");

    const enqueueOperation = vi.fn(async () => ({
      operationId: "op-1",
      kind: "run_research" as const,
      status: "succeeded" as const,
      summary: "ok",
      artifactIds: ["artifact-1"],
      warnings: [],
      source: "mock" as const,
    }));

    await run?.run({
      canUseApiMode: true,
      enqueueOperation,
      navigate: () => {},
      setRuntimeMode: () => {},
      checkBackendHealth: async () => {},
    });

    expect(enqueueOperation).toHaveBeenCalledOnce();
  });
});
