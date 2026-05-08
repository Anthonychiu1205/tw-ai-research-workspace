import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("live backend smoke", () => {
  test("script exits 0 when backend unavailable without strict", () => {
    execSync("node scripts/check-live-backend.mjs", {
      cwd: process.cwd(),
      stdio: "pipe",
      env: { ...process.env, TW_AI_RESEARCH_API_BASE_URL: "http://127.0.0.1:1" },
    });
    const outPath = path.resolve(process.cwd(), "artifacts/live-backend-smoke.json");
    const report = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(report.reachable).toBe(false);
  });

  test("strict mode reports failure when backend unavailable", () => {
    let failed = false;
    try {
      execSync("node scripts/check-live-backend.mjs --strict", {
        cwd: process.cwd(),
        stdio: "pipe",
        env: { ...process.env, TW_AI_RESEARCH_API_BASE_URL: "http://127.0.0.1:1" },
      });
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
  });

  test("no dependency on real backend", () => {
    const outPath = path.resolve(process.cwd(), "artifacts/live-backend-smoke.json");
    expect(fs.existsSync(outPath)).toBe(true);
  });

  test("non-strict run-research mode still exits 0 when unavailable", () => {
    execSync("node scripts/check-live-backend.mjs --run-research", {
      cwd: process.cwd(),
      stdio: "pipe",
      env: { ...process.env, TW_AI_RESEARCH_API_BASE_URL: "http://127.0.0.1:1" },
    });
    const report = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/live-backend-smoke.json"), "utf-8"));
    expect(report.strict).toBe(false);
  });

  test("report notes non-trading boundary", () => {
    const report = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/live-backend-smoke.json"), "utf-8"));
    expect(String(report.note).toLowerCase()).toContain("never executes trading");
  });
});
