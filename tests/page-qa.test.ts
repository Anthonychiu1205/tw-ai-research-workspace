import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("page qa", () => {
  test("check-pages script passes", () => {
    execSync("node scripts/check-pages.mjs", { cwd: process.cwd(), stdio: "pipe" });
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/check-pages.json"), "utf-8"));
    expect(json.missing.length).toBe(0);
    expect(json.pageIssues.length).toBe(0);
    expect(json.apiIssues.length).toBe(0);
  });

  test("route inventory complete", () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/check-pages.json"), "utf-8"));
    expect(json.requiredRouteFiles).toContain("app/workspace/page.tsx");
    expect(json.requiredRouteFiles).toContain("app/api/chat/route.ts");
  });

  test("page files enumerated", () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/check-pages.json"), "utf-8"));
    expect(Array.isArray(json.pageFiles)).toBe(true);
    expect(json.pageFiles.some((file: string) => file.endsWith("app/workspace/page.tsx"))).toBe(true);
  });

  test("api route files enumerated", () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/check-pages.json"), "utf-8"));
    expect(Array.isArray(json.apiRouteFiles)).toBe(true);
    expect(json.apiRouteFiles.some((file: string) => file.endsWith("app/api/chat/route.ts"))).toBe(true);
  });
});
