import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { startMockBackendServer } from "@/lib/testing/mock-backend-server";

describe("backend harness", () => {
  test("mock backend starts and stops", async () => {
    const server = await startMockBackendServer();
    expect(server.port).toBeGreaterThan(0);
    await server.close();
  });

  test("health endpoint works", async () => {
    const server = await startMockBackendServer();
    try {
      const res = await fetch(`${server.baseUrl}/health`);
      const json = await res.json();
      expect(res.ok).toBe(true);
      expect(json.status).toBe("ok");
    } finally {
      await server.close();
    }
  });

  test("research endpoint works", async () => {
    const server = await startMockBackendServer();
    try {
      const res = await fetch(`${server.baseUrl}/v1/research-runs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ symbol: "2330" }),
      });
      const json = await res.json();
      expect(res.ok).toBe(true);
      expect(json.metadata.provider).toBe("mock");
    } finally {
      await server.close();
    }
  });

  test("bridge check script passes", () => {
    execSync("node scripts/check-api-bridge-with-harness.mjs", { cwd: process.cwd(), stdio: "pipe" });
    const reportPath = path.resolve(process.cwd(), "artifacts/backend-harness-report.json");
    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    expect(report.passed).toBe(true);
  });

  test("no real backend required", () => {
    execSync("node scripts/run-backend-harness.mjs", { cwd: process.cwd(), stdio: "pipe" });
    const reportPath = path.resolve(process.cwd(), "artifacts/backend-harness-run.json");
    expect(fs.existsSync(reportPath)).toBe(true);
  });

  test("system endpoints work", async () => {
    const server = await startMockBackendServer();
    try {
      const provider = await fetch(`${server.baseUrl}/v1/system/provider`);
      const storage = await fetch(`${server.baseUrl}/v1/system/storage`);
      expect(provider.ok).toBe(true);
      expect(storage.ok).toBe(true);
    } finally {
      await server.close();
    }
  });

  test("conformance endpoint includes metadata", async () => {
    const server = await startMockBackendServer();
    try {
      const res = await fetch(`${server.baseUrl}/v1/provider/conformance`);
      const json = await res.json();
      expect(res.ok).toBe(true);
      expect(json.metadata.notFinancialAdvice).toBe(true);
    } finally {
      await server.close();
    }
  });

  test("harness records route hits", async () => {
    const server = await startMockBackendServer();
    try {
      await fetch(`${server.baseUrl}/health`);
      const hits = server.getHits();
      expect(hits.length).toBeGreaterThan(0);
    } finally {
      await server.close();
    }
  });
});
