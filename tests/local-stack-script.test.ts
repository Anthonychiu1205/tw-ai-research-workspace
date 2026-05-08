import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

describe("local-stack script", () => {
  test("print-commands includes Terminal A/B/C", () => {
    const output = execSync("node scripts/local-stack.mjs print-commands", {
      cwd: root,
      encoding: "utf-8",
      stdio: "pipe",
    });
    expect(output).toContain("Terminal A");
    expect(output).toContain("Terminal B");
    expect(output).toContain("Terminal C");
    expect(output).toContain("uvicorn");
    expect(output).toContain("check-live-backend-integration.mjs --strict");
  });

  test("doctor exits 0 and writes artifact", () => {
    execSync("node scripts/local-stack.mjs doctor", { cwd: root, stdio: "pipe" });
    const artifactPath = path.resolve(root, "artifacts/local-stack-doctor.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(report.passed).toBe(true);
  });

  test("check-backend non-strict exits 0 when backend unavailable", () => {
    execSync("node scripts/local-stack.mjs check-backend --base-url http://127.0.0.1:1", {
      cwd: root,
      stdio: "pipe",
    });
    const artifactPath = path.resolve(root, "artifacts/local-stack-backend-check.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(report.reachable).toBe(false);
  });

  test("summary writes artifact", () => {
    execSync("node scripts/local-stack.mjs summary", { cwd: root, stdio: "pipe" });
    const artifactPath = path.resolve(root, "artifacts/local-stack-summary.json");
    expect(fs.existsSync(artifactPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(report.workspace.path).toContain("tw-ai-research-workspace");
    expect(report.backend.path).toContain("tw-ai-investment-research");
  });

  test("script does not mutate remotes or tags", () => {
    const beforeRemotes = execSync("git remote -v", { cwd: root, encoding: "utf-8" });
    const beforeTags = execSync("git tag --list", { cwd: root, encoding: "utf-8" });
    execSync("node scripts/local-stack.mjs summary", { cwd: root, stdio: "pipe" });
    const afterRemotes = execSync("git remote -v", { cwd: root, encoding: "utf-8" });
    const afterTags = execSync("git tag --list", { cwd: root, encoding: "utf-8" });
    expect(afterRemotes).toBe(beforeRemotes);
    expect(afterTags).toBe(beforeTags);
  });
});
