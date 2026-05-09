import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("workspace final audit", () => {
  test("script runs", () => {
    execSync("node scripts/workspace-final-audit.mjs", { stdio: "pipe" });
    expect(true).toBe(true);
  });

  test("artifact exists", () => {
    const outPath = path.resolve(process.cwd(), "artifacts/workspace-final-audit.json");
    expect(fs.existsSync(outPath)).toBe(true);
  });

  test("passed true", () => {
    const outPath = path.resolve(process.cwd(), "artifacts/workspace-final-audit.json");
    const json = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(json.passed).toBe(true);
  });

  test("does not depend on rg", () => {
    const scriptPath = path.resolve(process.cwd(), "scripts/workspace-final-audit.mjs");
    const source = fs.readFileSync(scriptPath, "utf-8");
    expect(source.includes("rg --files")).toBe(false);
    expect(source.includes("execSync(\"rg")).toBe(false);
  });
});
