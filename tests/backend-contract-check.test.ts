import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";

describe("backend contract check script", () => {
  test("script runs and local fixtures pass", () => {
    execSync("node scripts/check-backend-contract.mjs", {
      cwd: "/Volumes/DEV_USB/Projects/tw-ai-research-workspace",
      stdio: "pipe",
    });

    const outPath = path.resolve(
      "/Volumes/DEV_USB/Projects/tw-ai-research-workspace",
      "artifacts/backend-contract-check.json",
    );
    expect(fs.existsSync(outPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(report.passed).toBe(true);
  });

  test("script exits 0 regardless of backend demo presence", () => {
    const output = execSync("node scripts/check-backend-contract.mjs", {
      cwd: "/Volumes/DEV_USB/Projects/tw-ai-research-workspace",
      stdio: "pipe",
    }).toString();

    expect(output.includes("check-backend-contract: OK")).toBe(true);
  });
});
