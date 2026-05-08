import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("routes export", () => {
  test("script runs", () => {
    execSync("node scripts/export-routes.mjs", { cwd: process.cwd(), stdio: "pipe" });
    expect(fs.existsSync(path.resolve(process.cwd(), "artifacts/routes.json"))).toBe(true);
  });

  test("workspace/report/strategy/trace routes present", () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/routes.json"), "utf-8"));
    const routes = json.routes.map((item: any) => item.route);
    expect(routes).toContain("/workspace");
    expect(routes).toContain("/portfolio");
    expect(routes).toContain("/reports");
    expect(routes).toContain("/strategies");
    expect(routes).toContain("/traces");
  });

  test("api chat/backend routes present", () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/routes.json"), "utf-8"));
    const routes = json.routes.map((item: any) => item.route);
    expect(routes).toContain("/api/chat");
    expect(routes).toContain("/api/backend/health");
    expect(routes).toContain("/api/backend/portfolio");
  });

  test("routes doc exists", () => {
    expect(fs.existsSync(path.resolve(process.cwd(), "docs/routes.md"))).toBe(true);
  });

  test("route entries include page and api types", () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/routes.json"), "utf-8"));
    const types = new Set(json.routes.map((item: any) => item.type));
    expect(types.has("page")).toBe(true);
    expect(types.has("api")).toBe(true);
  });
});
