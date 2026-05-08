import { beforeEach, describe, expect, test } from "vitest";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { runScenario } from "@/lib/scenarios/scenario-runner";

describe("scenario runner", () => {
  beforeEach(() => {
    window.localStorage.clear();
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
  });

  test("analyze_2330 scenario creates research artifact", async () => {
    const store = createArtifactStore([]);
    const result = await runScenario({ scenarioId: "analyze_2330", artifactStore: store });
    expect(result.status).toBe("succeeded");
    const created = result.createdArtifactIds.map((id) => store.get(id)).filter(Boolean);
    expect(created.some((item) => item?.type === "research_card")).toBe(true);
  });

  test("generate_2330_report scenario creates report artifact", async () => {
    const store = createArtifactStore([]);
    const result = await runScenario({ scenarioId: "generate_2330_report", artifactStore: store });
    expect(result.status).toBe("succeeded");
    const created = result.createdArtifactIds.map((id) => store.get(id)).filter(Boolean);
    expect(created.some((item) => item?.type === "report")).toBe(true);
  });

  test("strategy comparison scenario creates comparison artifact", async () => {
    const store = createArtifactStore([]);
    const result = await runScenario({ scenarioId: "compare_ai_server_watchlist", artifactStore: store });
    expect(result.status).toBe("succeeded");
    const created = result.createdArtifactIds.map((id) => store.get(id)).filter(Boolean);
    expect(created.some((item) => item?.type === "strategy_comparison")).toBe(true);
  });

  test("scenario works without backend", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    const store = createArtifactStore([]);
    const result = await runScenario({ scenarioId: "inspect_planner_trace", artifactStore: store });
    expect(result.status).toBe("succeeded");
  });

  test("no financial advice wording in scenario output", async () => {
    const store = createArtifactStore([]);
    const messages: string[] = [];
    await runScenario({
      scenarioId: "evaluate_phase2_signals",
      artifactStore: store,
      onMessage: (message) => messages.push(message),
    });
    const combined = messages.join(" ").toLowerCase();
    expect(combined).toContain("not financial advice");
    expect(combined).not.toContain("buy recommendation");
    expect(combined).not.toContain("sell recommendation");
  });
});
