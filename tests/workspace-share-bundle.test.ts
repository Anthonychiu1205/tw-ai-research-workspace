import { describe, expect, test } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  computeBundleChecksum,
  createWorkspaceShareBundle,
  exportWorkspaceShareBundle,
  importWorkspaceShareBundle,
  validateWorkspaceShareBundle,
} from "@/lib/workspace/export-import";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

function sampleState() {
  return {
    sessions: [
      {
        id: "s1",
        title: "session",
        schemaVersion: "workspace-session.v0.2" as const,
        runtimeMode: "mock" as const,
        modelId: "mock-research",
        provider: "mock" as const,
        messages: [],
        artifacts: [],
        updatedAt: "2026-05-08T00:00:00.000Z",
      },
    ],
    artifacts: [
      {
        id: "a1",
        type: "report" as const,
        kind: "report" as const,
        title: "synthetic report",
        createdAt: "2026-05-08T00:00:00.000Z",
        source: "mock" as const,
        synthetic: true,
        notFinancialAdvice: true as const,
        noTradingExecution: true as const,
        evidenceIds: ["ev-1"],
        relatedArtifactIds: [],
        pinned: false,
      },
    ],
    runtimeSettings: getDefaultRuntimeSettings(),
  };
}

describe("workspace share bundle", () => {
  test("generate-share-bundle script runs", () => {
    execSync("node scripts/generate-share-bundle.mjs", { cwd: process.cwd(), stdio: "pipe" });
    const bundlePath = path.resolve(process.cwd(), "artifacts/workspace-share-bundle.json");
    expect(fs.existsSync(bundlePath)).toBe(true);
  });

  test("create bundle", () => {
    const state = sampleState();
    const bundle = createWorkspaceShareBundle({ ...state, scenariosCompleted: ["analyze_2330"] });
    expect(bundle.schemaVersion).toBe("workspace-share-bundle.v0.5");
    expect(bundle.notFinancialAdvice).toBe(true);
  });

  test("validate bundle", () => {
    const state = sampleState();
    const bundle = createWorkspaceShareBundle({ ...state, scenariosCompleted: ["analyze_2330"] });
    const valid = validateWorkspaceShareBundle(bundle);
    expect(valid.ok).toBe(true);
  });

  test("checksum stable", () => {
    const base = {
      schemaVersion: "workspace-share-bundle.v0.5" as const,
      bundleId: "fixed",
      createdAt: "2026-05-08T00:00:00.000Z",
      source: "mock" as const,
      synthetic: true,
      notFinancialAdvice: true as const,
      noTradingExecution: true as const,
      sessions: sampleState().sessions,
      artifacts: sampleState().artifacts,
      runtimeSettings: sampleState().runtimeSettings,
      scenariosCompleted: ["analyze_2330"],
    };
    expect(computeBundleChecksum(base)).toBe(computeBundleChecksum(base));
  });

  test("import/export roundtrip", () => {
    const raw = exportWorkspaceShareBundle({ ...sampleState(), scenariosCompleted: ["analyze_2330"] });
    const parsed = importWorkspaceShareBundle(raw);
    expect(parsed.ok).toBe(true);
  });

  test("metadata present", () => {
    const bundle = createWorkspaceShareBundle({ ...sampleState(), scenariosCompleted: [] });
    expect(bundle.synthetic).toBe(true);
    expect(bundle.noTradingExecution).toBe(true);
  });

  test("generated bundle includes portfolio/backtest v2 artifacts", () => {
    const bundlePath = path.resolve(process.cwd(), "artifacts/workspace-share-bundle.json");
    const json = JSON.parse(fs.readFileSync(bundlePath, "utf-8"));
    const artifactTypes = (json.artifacts ?? []).map((item: any) => item.type ?? item.kind);
    expect(artifactTypes).toContain("portfolio_review");
    expect(artifactTypes).toContain("rebalance_plan");
    expect(artifactTypes).toContain("backtest_v2_summary");
  });

  test("corrupted bundle rejected", () => {
    const bundle = createWorkspaceShareBundle({ ...sampleState(), scenariosCompleted: [] });
    const bad = { ...bundle, checksum: "tampered" };
    const parsed = validateWorkspaceShareBundle(bad);
    expect(parsed.ok).toBe(false);
  });
});
