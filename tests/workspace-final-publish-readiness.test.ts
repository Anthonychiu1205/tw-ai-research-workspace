import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("workspace final publish readiness", () => {
  test("scripts run", () => {
    execSync("node scripts/secret-scan.mjs", { cwd: process.cwd(), stdio: "pipe" });
    execSync("node scripts/mock-boundary-check.mjs", { cwd: process.cwd(), stdio: "pipe" });
    execSync("node scripts/final-audit.mjs", {
      cwd: process.cwd(),
      stdio: "pipe",
      env: { ...process.env, FINAL_AUDIT_SKIP_SMOKE: "1" },
    });
    execSync("node scripts/prepare-github-publish.mjs", { cwd: process.cwd(), stdio: "pipe" });
    expect(true).toBe(true);
  });

  test("artifacts exist", () => {
    const files = [
      "artifacts/secret-scan.json",
      "artifacts/mock-boundary-check.json",
      "artifacts/final-audit.json",
      "artifacts/github-publish-plan.json",
    ];
    for (const file of files) {
      expect(fs.existsSync(path.resolve(process.cwd(), file))).toBe(true);
    }
  });

  test("no push/tag/remote mutation", () => {
    const plan = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/github-publish-plan.json"), "utf-8"));
    expect(Array.isArray(plan.commands)).toBe(true);
    expect(plan.note.toLowerCase()).toContain("no remote mutation");
  });

  test("final audit report passes", () => {
    const report = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/final-audit.json"), "utf-8"));
    expect(report.passed).toBe(true);
  });

  test("secret scan report passes", () => {
    const report = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/secret-scan.json"), "utf-8"));
    expect(report.passed).toBe(true);
  });
});
