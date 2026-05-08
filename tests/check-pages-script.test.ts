import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("check pages script", () => {
  test("script runs", () => {
    execSync("node scripts/check-pages.mjs", { cwd: process.cwd(), stdio: "pipe" });
    expect(true).toBe(true);
  });

  test("artifact exists", () => {
    const outPath = path.resolve(process.cwd(), "artifacts/check-pages.json");
    expect(fs.existsSync(outPath)).toBe(true);
  });

  test("required route files are tracked", () => {
    const outPath = path.resolve(process.cwd(), "artifacts/check-pages.json");
    const json = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(json.requiredRouteFiles.length).toBeGreaterThan(0);
    expect(json.missing.length).toBe(0);
  });
});
