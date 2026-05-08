import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";

const root = "/Volumes/DEV_USB/Projects/tw-ai-research-workspace";
const bundlePath = path.resolve(root, "artifacts/workspace-demo-bundle.json");

describe("workspace demo bundle", () => {
  test("script runs", () => {
    execSync("node scripts/generate-workspace-demo-bundle.mjs", { cwd: root, stdio: "pipe" });
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
  });
});
