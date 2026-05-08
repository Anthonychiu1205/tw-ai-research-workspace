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

describe("check-live-backend-integration script", () => {
  test("exits 0 when backend unavailable in non-strict mode", () => {
    execSync("node scripts/check-live-backend-integration.mjs --base-url http://127.0.0.1:1", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    const report = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "artifacts/live-backend-integration-report.json"), "utf-8"),
    );
    expect(report.reachable).toBe(false);
    expect(report.passed).toBe(true);
  });

  test("strict mode fails when backend unavailable", () => {
    let failed = false;
    try {
      execSync("node scripts/check-live-backend-integration.mjs --base-url http://127.0.0.1:1 --strict", {
        cwd: process.cwd(),
        stdio: "pipe",
      });
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
  });

  test("passes core endpoint checks against mocked backend", async () => {
    const server = await startMockBackendServer();
    try {
      await execAsync(`node scripts/check-live-backend-integration.mjs --base-url ${server.baseUrl} --strict`, process.cwd());
      const report = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), "artifacts/live-backend-integration-report.json"), "utf-8"),
      );
      expect(report.reachable).toBe(true);
      expect(report.passed).toBe(true);
      expect(Array.isArray(report.checks)).toBe(true);
      expect(report.checks.some((item: any) => item.endpoint === "/v1/portfolio/review" && item.ok)).toBe(true);
      expect(report.checks.some((item: any) => item.endpoint === "/v1/backtests" && item.ok)).toBe(true);
    } finally {
      await server.close();
    }
  });
});
