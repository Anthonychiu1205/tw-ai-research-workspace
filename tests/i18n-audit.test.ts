import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";

describe("i18n audit script", () => {
  test("script runs and report passes", () => {
    execSync("node scripts/check-i18n.mjs", { cwd: process.cwd(), stdio: "pipe" });

    const reportPath = path.resolve(process.cwd(), "artifacts/i18n-check.json");
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    expect(report.passed).toBe(true);
  });
});
