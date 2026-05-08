import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";

describe("demo bundle polish", () => {
  test("workspace demo and share bundle contain product metadata", () => {
    execSync("node scripts/generate-workspace-demo-bundle.mjs", { cwd: process.cwd(), stdio: "pipe" });
    execSync("node scripts/generate-share-bundle.mjs", { cwd: process.cwd(), stdio: "pipe" });

    const demoBundle = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "artifacts/workspace-demo-bundle.json"), "utf-8"),
    );
    const shareBundle = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "artifacts/workspace-share-bundle.json"), "utf-8"),
    );

    expect(demoBundle.metadata.appName).toBe("tw-ai-research-workspace");
    expect(demoBundle.metadata.notFinancialAdvice).toBe(true);
    expect(Array.isArray(demoBundle.metadata.recommendedDemoFlow)).toBe(true);

    expect(shareBundle.appName).toBe("tw-ai-research-workspace");
    expect(shareBundle.noTradingExecution).toBe(true);
    expect(Array.isArray(shareBundle.generatedArtifacts)).toBe(true);
  });
});
