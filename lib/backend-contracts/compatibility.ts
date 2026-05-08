import fs from "node:fs";
import path from "node:path";
import { checkAdapterCompatibility, checkArtifactMetadata } from "@/lib/backend-contracts/artifact-compatibility";
import { checkRequiredRoutes, extractRoutesFromOpenApi, extractRoutesFromRouteArtifact } from "@/lib/backend-contracts/route-parity";

export type BackendCompatibilityReport = {
  checkedAt: string;
  backendArtifactsPresent: boolean;
  passed: boolean;
  warnings: string[];
  routeParity: {
    passed: boolean;
    missing: string[];
    matched: string[];
    openapiRoutes: string[];
    routeArtifactRoutes: string[];
  };
  metadataChecks: Array<{ file: string; passed: boolean; issues: string[] }>;
  adapterCompatibility: {
    passed: boolean;
    issues: string[];
  };
};

function readJsonIfExists(filePath: string): unknown | undefined {
  if (!fs.existsSync(filePath)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return undefined;
  }
}

export function buildBackendCompatibilityReport(rootDir: string): BackendCompatibilityReport {
  const backendArtifactsDir = path.resolve(rootDir, "../tw-ai-investment-research/artifacts");
  const openapiPath = path.join(backendArtifactsDir, "openapi.json");
  const routesPath = path.join(backendArtifactsDir, "api_routes.json");
  const demoDir = path.join(backendArtifactsDir, "demo");

  const warnings: string[] = [];
  const backendArtifactsPresent = fs.existsSync(backendArtifactsDir);

  if (!backendArtifactsPresent) {
    warnings.push("backend artifacts directory missing (optional)");
  }

  const openapi = readJsonIfExists(openapiPath);
  const routeArtifact = readJsonIfExists(routesPath);

  const openapiRoutes = extractRoutesFromOpenApi(openapi);
  const routeArtifactRoutes = extractRoutesFromRouteArtifact(routeArtifact);

  const routeParity = checkRequiredRoutes([...openapiRoutes, ...routeArtifactRoutes]);
  if (!openapi && !routeArtifact) {
    warnings.push("openapi/routes artifacts missing (optional)");
  }

  const metadataChecks: Array<{ file: string; passed: boolean; issues: string[] }> = [];
  if (fs.existsSync(demoDir)) {
    const files = fs.readdirSync(demoDir).filter((name) => name.endsWith(".json")).sort();
    for (const file of files) {
      const full = path.join(demoDir, file);
      const json = readJsonIfExists(full);
      metadataChecks.push(checkArtifactMetadata(file, json));
    }
  } else {
    warnings.push("backend demo directory missing (optional)");
  }

  const workspaceMockApiDir = path.resolve(rootDir, "fixtures/mock-api");
  const workspaceDemoDir = path.resolve(rootDir, "fixtures/demo");
  const adapterCompatibility = checkAdapterCompatibility({
    report: readJsonIfExists(path.join(workspaceMockApiDir, "report.json")),
    pipeline: readJsonIfExists(path.join(workspaceMockApiDir, "pipeline-result.json")),
    signal: readJsonIfExists(path.join(workspaceMockApiDir, "signal-evaluation.json")),
    strategy: readJsonIfExists(path.join(workspaceDemoDir, "strategy-comparison.json")),
  });

  const errors: string[] = [];
  if (backendArtifactsPresent) {
    if (!routeParity.passed) {
      errors.push(`missing required backend routes: ${routeParity.missing.join(",")}`);
    }

    const metadataFailures = metadataChecks.filter((item) => !item.passed);
    if (metadataFailures.length > 0) {
      errors.push(`metadata failures: ${metadataFailures.length}`);
    }
  }

  if (!adapterCompatibility.passed) {
    errors.push(...adapterCompatibility.issues);
  }

  return {
    checkedAt: new Date().toISOString(),
    backendArtifactsPresent,
    passed: errors.length === 0,
    warnings,
    routeParity: {
      passed: routeParity.passed,
      missing: [...routeParity.missing],
      matched: [...routeParity.matched],
      openapiRoutes,
      routeArtifactRoutes,
    },
    metadataChecks,
    adapterCompatibility,
  };
}
