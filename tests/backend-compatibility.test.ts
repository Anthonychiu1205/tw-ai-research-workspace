import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { buildBackendCompatibilityReport } from "@/lib/backend-contracts/compatibility";
import { checkRequiredRoutes, extractRoutesFromOpenApi, extractRoutesFromRouteArtifact } from "@/lib/backend-contracts/route-parity";
import { checkArtifactMetadata } from "@/lib/backend-contracts/artifact-compatibility";

describe("backend compatibility", () => {
  test("absent backend artifacts -> warning/pass", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ws-compat-"));
    fs.mkdirSync(path.join(tempRoot, "fixtures", "mock-api"), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, "fixtures", "demo"), { recursive: true });
    const report = buildBackendCompatibilityReport(tempRoot);
    expect(report.passed).toBe(true);
  });

  test("fixture openapi with required routes -> pass", () => {
    const openapi = {
      paths: {
        "/health": {},
        "/v1/research-runs": {},
        "/v1/reports/research": {},
        "/v1/research-pipelines": {},
        "/v1/backtests": {},
        "/v1/strategies/compare": {},
        "/v1/evaluations/signals": {},
        "/v1/system/storage": {},
        "/v1/system/provider": {},
      },
    };
    const routes = extractRoutesFromOpenApi(openapi);
    const parity = checkRequiredRoutes(routes);
    expect(parity.passed).toBe(true);
  });

  test("missing required route detected", () => {
    const parity = checkRequiredRoutes(["/health", "/v1/research-runs"]);
    expect(parity.passed).toBe(false);
    expect(parity.missing.length).toBeGreaterThan(0);
  });

  test("metadata check works", () => {
    const result = checkArtifactMetadata("demo.json", {
      metadata: {
        provider: "mock",
        dataType: "synthetic_mock",
        notFinancialAdvice: true,
        noTradingExecution: true,
      },
    });
    expect(result.passed).toBe(true);
  });

  test("route artifact extraction works", () => {
    const routes = extractRoutesFromRouteArtifact({
      routes: [{ path: "/health" }, { path: "/v1/research-runs" }],
    });
    expect(routes).toContain("/health");
    expect(routes).toContain("/v1/research-runs");
  });

  test("metadata check fails for invalid meta", () => {
    const result = checkArtifactMetadata("bad.json", { metadata: { provider: "api" } });
    expect(result.passed).toBe(false);
  });
});
