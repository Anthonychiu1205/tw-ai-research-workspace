import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, test } from "vitest";

const root = process.cwd();
const bundlePath = path.resolve(root, "artifacts/workspace-demo-bundle.json");

function runNodeScript(scriptPath: string, args: string[] = []) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: root,
    encoding: "utf-8",
    stdio: "pipe",
    shell: false,
    env: {
      ...process.env,
      CI: process.env.CI ?? "true",
    },
  });
}

describe("workspace demo bundle", () => {
  test("script runs", () => {
    const result = runNodeScript("scripts/generate-workspace-demo-bundle.mjs");
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(fs.existsSync(bundlePath)).toBe(true);
  });

  test("bundle exists", () => {
    expect(fs.existsSync(bundlePath)).toBe(true);
  });

  test("metadata valid", () => {
    const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf-8"));
    expect(bundle.metadata.provider).toBe("mock");
    expect(bundle.metadata.dataType).toBe("synthetic_mock");
    expect(bundle.metadata.notFinancialAdvice).toBe(true);
    expect(bundle.metadata.noTradingExecution).toBe(true);
  });

  test("contains required sections", () => {
    const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf-8"));
    expect(bundle.sessions).toBeTruthy();
    expect(bundle.artifacts).toBeTruthy();
    expect(bundle.researchCard).toBeTruthy();
    expect(bundle.signalMatrix).toBeTruthy();
    expect(bundle.evidenceTimeline).toBeTruthy();
    expect(bundle.reportSections).toBeTruthy();
    expect(bundle.plannerTrace).toBeTruthy();
    expect(bundle.strategyComparison).toBeTruthy();
    expect(bundle.portfolioReview).toBeTruthy();
    expect(bundle.backtestV2Summary).toBeTruthy();
  });
});
