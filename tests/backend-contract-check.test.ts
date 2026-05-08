import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { describe, expect, test } from "vitest";

const repo = "/Volumes/DEV_USB/Projects/tw-ai-research-workspace";
const localDemoFixture = path.resolve(repo, "fixtures/demo/research-card-2330.json");

describe("backend contract check script", () => {
  test("metadata required and local fixtures pass", () => {
    execSync("node scripts/check-backend-contract.mjs", { cwd: repo, stdio: "pipe" });

    const outPath = path.resolve(repo, "artifacts/backend-contract-check.json");
    expect(fs.existsSync(outPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(report.passed).toBe(true);
    expect(report.errors.length).toBe(0);
  });

  test("dry-run sync works", () => {
    const output = execSync("node scripts/sync-demo-artifacts.mjs", { cwd: repo, stdio: "pipe" }).toString();
    expect(output).toContain("dry-run=true");
  });

  test("missing source repo exits 0", () => {
    const output = execSync("node scripts/check-backend-contract.mjs", { cwd: repo, stdio: "pipe" }).toString();
    expect(output.includes("check-backend-contract: OK")).toBe(true);
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
    try {
      execSync(`node ${path.join(repo, "scripts", "check-backend-contract.mjs")}`, { cwd: tmpRoot, stdio: "pipe" });
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
  });
});
