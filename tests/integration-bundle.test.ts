import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("integration bundle script", () => {
  test("script runs without backend", () => {
    execSync("TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:1 node scripts/generate-integration-bundle.mjs", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    expect(true).toBe(true);
  });

  test("artifact exists and fallbackReady is true", () => {
    const artifactPath = path.resolve(process.cwd(), "artifacts/integration-bundle.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const bundle = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(bundle.integration.fallbackReady).toBe(true);
    expect(typeof bundle.integration.backendReachable).toBe("boolean");
  });

  test("boundaries are present", () => {
    const bundle = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "artifacts/integration-bundle.json"), "utf-8"),
    );
    expect(bundle.boundaries.mockDefault).toBe(true);
    expect(bundle.boundaries.noTrading).toBe(true);
    expect(bundle.boundaries.noBroker).toBe(true);
    expect(bundle.boundaries.noDashboardSaaS).toBe(true);
    expect(bundle.boundaries.backendOptional).toBe(true);
  });

  test("docs generated", () => {
    const docPath = path.resolve(process.cwd(), "docs/integration_bundle.md");
    expect(fs.existsSync(docPath)).toBe(true);
    const content = fs.readFileSync(docPath, "utf-8");
    expect(content).toContain("Integration Bundle");
  });
});
