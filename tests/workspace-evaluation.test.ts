import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { evaluateWorkspace } from "@/lib/evaluation/workspace-evaluator";
import { evaluateSafetyInText } from "@/lib/evaluation/safety-evaluator";
import { evaluateChatEvents } from "@/lib/evaluation/chat-event-evaluator";
import { evaluateArtifacts } from "@/lib/evaluation/artifact-evaluator";

describe("workspace evaluation", () => {
  test("evaluator returns passed true", async () => {
    const report = await evaluateWorkspace(process.cwd());
    expect(report.passed).toBe(true);
  });

  test("report has checks", async () => {
    const report = await evaluateWorkspace(process.cwd());
    expect(report.checks.length).toBeGreaterThan(10);
  });

  test("safety evaluator catches fake unsafe phrase", () => {
    const checks = evaluateSafetyInText("This promises guaranteed returns", "temp");
    expect(checks.some((check) => check.passed === false)).toBe(true);
  });

  test("chat evaluator validates expected events", async () => {
    const checks = await evaluateChatEvents();
    expect(checks.some((check) => check.name.includes("final_event") && check.passed)).toBe(true);
  });

  test("script writes evaluation artifact", () => {
    execSync("node scripts/evaluate-workspace.mjs", { cwd: process.cwd(), stdio: "pipe" });
    const outPath = path.resolve(process.cwd(), "artifacts/workspace-evaluation.json");
    expect(fs.existsSync(outPath)).toBe(true);
  });

  test("artifact evaluator has checks", () => {
    const checks = evaluateArtifacts();
    expect(checks.length).toBeGreaterThan(0);
    expect(checks.every((check) => check.category === "artifacts")).toBe(true);
  });

  test("evaluation report summary is populated", async () => {
    const report = await evaluateWorkspace(process.cwd());
    expect(report.summary.length).toBeGreaterThan(0);
  });

  test("safety evaluator allows negative broker context", () => {
    const checks = evaluateSafetyInText("This workspace has no broker integration.", "negative_context");
    const brokerCheck = checks.find((check) => check.name.includes("broker_integration"));
    expect(brokerCheck?.passed).toBe(true);
  });
});
