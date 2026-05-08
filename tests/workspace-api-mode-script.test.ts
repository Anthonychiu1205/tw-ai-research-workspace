import { exec, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { startMockBackendServer } from "@/lib/testing/mock-backend-server";

function execAsync(cmd: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    exec(cmd, { cwd }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

describe("check-workspace-api-mode script", () => {
  test("exits 0 when backend unavailable without strict", () => {
    execSync("node scripts/check-workspace-api-mode.mjs --base-url http://127.0.0.1:1 --bridge-mode direct", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    const report = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/workspace-api-mode-report.json"), "utf-8"));
    expect(report.reachable).toBe(false);
    expect(report.passed).toBe(true);
  });

  test("passes with mocked backend and validates adapter checks", async () => {
    const server = await startMockBackendServer();
    try {
      await execAsync(
        `node scripts/check-workspace-api-mode.mjs --base-url ${server.baseUrl} --bridge-mode direct --strict`,
        process.cwd(),
      );
      const report = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/workspace-api-mode-report.json"), "utf-8"));
      expect(report.reachable).toBe(true);
      expect(report.passed).toBe(true);
      const checkNames = report.checks.map((item: any) => item.name);
      expect(checkNames).toContain("runResearch.adapter");
      expect(checkNames).toContain("runPortfolioReview.adapter");
      expect(checkNames).toContain("runBacktestV2.adapter");
    } finally {
      await server.close();
    }
  });
});
