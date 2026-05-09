import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

function runCommand(command: string, args: string[], options: { cwd?: string } = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf-8",
    stdio: "pipe",
    shell: false,
    env: {
      ...process.env,
      CI: process.env.CI ?? "true",
    },
  });
}

function runNodeScript(scriptPath: string, args: string[] = []) {
  return runCommand(process.execPath, [scriptPath, ...args], { cwd: root });
}

function assertCommandOk(result: ReturnType<typeof runCommand>) {
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(0);
}

describe("local-stack script", () => {
  test("print-commands includes Terminal A/B/C", () => {
    const result = runNodeScript("scripts/local-stack.mjs", ["print-commands"]);
    assertCommandOk(result);
    const output = result.stdout;
    expect(output).toContain("Terminal A");
    expect(output).toContain("Terminal B");
    expect(output).toContain("Terminal C");
    expect(output).toContain("uvicorn");
    expect(output).toContain("check-live-backend-integration.mjs --strict");
  });

  test("doctor exits 0 and writes artifact", () => {
    const result = runNodeScript("scripts/local-stack.mjs", ["doctor"]);
    assertCommandOk(result);
    const artifactPath = path.resolve(root, "artifacts/local-stack-doctor.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(report.passed).toBe(true);
  });

  test("check-backend non-strict exits 0 when backend unavailable", () => {
    const result = runNodeScript("scripts/local-stack.mjs", ["check-backend", "--base-url", "http://127.0.0.1:1"]);
    assertCommandOk(result);
    const artifactPath = path.resolve(root, "artifacts/local-stack-backend-check.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(report.reachable).toBe(false);
  });

  test("summary writes artifact", () => {
    const result = runNodeScript("scripts/local-stack.mjs", ["summary"]);
    assertCommandOk(result);
    const artifactPath = path.resolve(root, "artifacts/local-stack-summary.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(report.workspace.path).toContain("tw-ai-research-workspace");
    expect(report.backend.path).toContain("tw-ai-investment-research");
  });

  test("script does not mutate remotes or tags", () => {
    const beforeRemotes = runCommand("git", ["remote", "-v"], { cwd: root });
    const beforeTags = runCommand("git", ["tag", "--list"], { cwd: root });
    assertCommandOk(beforeRemotes);
    assertCommandOk(beforeTags);
    const summaryResult = runNodeScript("scripts/local-stack.mjs", ["summary"]);
    assertCommandOk(summaryResult);
    const afterRemotes = runCommand("git", ["remote", "-v"], { cwd: root });
    const afterTags = runCommand("git", ["tag", "--list"], { cwd: root });
    assertCommandOk(afterRemotes);
    assertCommandOk(afterTags);
    expect(afterRemotes.stdout).toBe(beforeRemotes.stdout);
    expect(afterTags.stdout).toBe(beforeTags.stdout);
  });
});
