import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, test } from "vitest";

const repo = process.cwd();
const localDemoFixture = path.resolve(repo, "fixtures/demo/research-card-2330.json");

function runNodeScript(scriptPath: string, args: string[] = [], cwd = repo) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf-8",
    stdio: "pipe",
    shell: false,
    env: {
      ...process.env,
      CI: process.env.CI ?? "true",
    },
  });
}

describe("backend contract check script", () => {
  test("metadata required and local fixtures pass", () => {
    const result = runNodeScript("scripts/check-backend-contract.mjs");
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);

    const outPath = path.resolve(repo, "artifacts/backend-contract-check.json");
    expect(fs.existsSync(outPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(report.passed).toBe(true);
    expect(report.errors.length).toBe(0);
  });

  test("dry-run sync works", () => {
    const result = runNodeScript("scripts/sync-demo-artifacts.mjs");
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("dry-run=true");
  });

  test("missing source repo exits 0", () => {
    const result = runNodeScript("scripts/check-backend-contract.mjs");
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(result.stdout.includes("check-backend-contract: OK")).toBe(true);
  });

  test("fixture missing required metadata fails helper", () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "backend-contract-"));
    fs.mkdirSync(path.join(tmpRoot, "fixtures", "demo"), { recursive: true });
    fs.mkdirSync(path.join(tmpRoot, "fixtures", "mock-api"), { recursive: true });
    const broken = JSON.parse(fs.readFileSync(localDemoFixture, "utf-8"));
    delete broken.metadata;
    fs.writeFileSync(
      path.join(tmpRoot, "fixtures", "demo", "research-card-2330.json"),
      JSON.stringify(broken, null, 2),
    );

    let failed = false;
    const scriptPath = path.join(repo, "scripts", "check-backend-contract.mjs");
    const result = runNodeScript(scriptPath, [], tmpRoot);
    if (result.status !== 0) {
      failed = true;
    }
    expect(failed).toBe(true);
  });
});
