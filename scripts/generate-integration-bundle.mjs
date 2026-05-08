import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const WORKSPACE_PATH = process.cwd();
const BACKEND_PATH = "/Volumes/DEV_USB/Projects/tw-ai-investment-research";
const BASE_URL = process.env.TW_AI_RESEARCH_API_BASE_URL || "http://127.0.0.1:8000";

function run(command, cwd = WORKSPACE_PATH) {
  return execSync(command, { cwd, encoding: "utf-8", stdio: "pipe" }).trim();
}

function safeRun(command, cwd = WORKSPACE_PATH) {
  try {
    return { ok: true, output: run(command, cwd) };
  } catch (error) {
    return {
      ok: false,
      output: error instanceof Error ? error.message : "command_failed",
    };
  }
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function getGitInfo(repoPath) {
  const branch = safeRun("git branch --show-current", repoPath).output || "unknown";
  const commit = safeRun("git log --oneline -1", repoPath).output || "unknown";
  const status = safeRun("git status --short", repoPath).output || "";
  return {
    path: repoPath,
    branch: String(branch).trim(),
    commit: String(commit).trim(),
    statusClean: String(status).trim().length === 0,
  };
}

function ensureArtifactsAndDocs() {
  fs.mkdirSync(path.resolve(WORKSPACE_PATH, "artifacts"), { recursive: true });
  fs.mkdirSync(path.resolve(WORKSPACE_PATH, "docs"), { recursive: true });
}

function writeBundleDoc(targetPath, bundle) {
  const lines = [
    "# Integration Bundle",
    "",
    `Generated at: ${bundle.generatedAt}`,
    "",
    "## Backend",
    `- path: ${bundle.backend.path}`,
    `- branch: ${bundle.backend.branch}`,
    `- commit: ${bundle.backend.commit}`,
    `- clean: ${bundle.backend.statusClean}`,
    "",
    "## Workspace",
    `- path: ${bundle.workspace.path}`,
    `- branch: ${bundle.workspace.branch}`,
    `- commit: ${bundle.workspace.commit}`,
    `- clean: ${bundle.workspace.statusClean}`,
    "",
    "## Integration",
    `- backendReachable: ${bundle.integration.backendReachable}`,
    `- strictReady: ${bundle.integration.strictReady}`,
    `- fallbackReady: ${bundle.integration.fallbackReady}`,
    "",
    "## Capabilities",
    `- research: ${bundle.capabilities.research}`,
    `- reports: ${bundle.capabilities.reports}`,
    `- pipelines: ${bundle.capabilities.pipelines}`,
    `- portfolio: ${bundle.capabilities.portfolio}`,
    `- backtestingV2: ${bundle.capabilities.backtestingV2}`,
    `- strategyComparison: ${bundle.capabilities.strategyComparison}`,
    `- signalEvaluation: ${bundle.capabilities.signalEvaluation}`,
    "",
    "## Boundaries",
    `- mockDefault: ${bundle.boundaries.mockDefault}`,
    `- noTrading: ${bundle.boundaries.noTrading}`,
    `- noBroker: ${bundle.boundaries.noBroker}`,
    `- noDashboardSaaS: ${bundle.boundaries.noDashboardSaaS}`,
    `- backendOptional: ${bundle.boundaries.backendOptional}`,
  ];
  fs.writeFileSync(targetPath, `${lines.join("\n")}\n`);
}

function deriveCapabilities(liveReport) {
  const endpoints = new Set((liveReport?.checks ?? []).map((item) => item.endpoint));
  return {
    research: endpoints.has("/v1/research-runs"),
    reports: endpoints.has("/v1/reports/research"),
    pipelines: endpoints.has("/v1/research-pipelines"),
    portfolio: endpoints.has("/v1/portfolio/review"),
    backtestingV2: endpoints.has("/v1/backtests"),
    strategyComparison: endpoints.has("/v1/strategies/compare"),
    signalEvaluation: endpoints.has("/v1/evaluations/signals"),
  };
}

function main() {
  ensureArtifactsAndDocs();

  const backend = getGitInfo(BACKEND_PATH);
  const workspace = getGitInfo(WORKSPACE_PATH);

  const steps = [
    safeRun("node scripts/local-stack.mjs doctor"),
    safeRun("node scripts/check-backend-compatibility.mjs"),
    safeRun("node scripts/evaluate-workspace.mjs"),
    safeRun(`TW_AI_RESEARCH_API_BASE_URL=${BASE_URL} node scripts/check-live-backend-integration.mjs`),
    safeRun(`TW_AI_RESEARCH_API_BASE_URL=${BASE_URL} node scripts/check-workspace-api-mode.mjs`),
  ];

  const doctor = readJsonIfExists(path.resolve(WORKSPACE_PATH, "artifacts/local-stack-doctor.json"));
  const compatibility = readJsonIfExists(path.resolve(WORKSPACE_PATH, "artifacts/backend-compatibility-report.json"));
  const evaluation = readJsonIfExists(path.resolve(WORKSPACE_PATH, "artifacts/workspace-evaluation.json"));
  const liveReport = readJsonIfExists(path.resolve(WORKSPACE_PATH, "artifacts/live-backend-integration-report.json"));
  const apiModeReport = readJsonIfExists(path.resolve(WORKSPACE_PATH, "artifacts/workspace-api-mode-report.json"));

  const backendReachable = Boolean(liveReport?.reachable);
  const strictReady = Boolean(backendReachable && liveReport?.passed && apiModeReport?.passed);
  const fallbackReady = backendReachable ? Boolean(apiModeReport?.passed && liveReport?.passed) : true;

  const bundle = {
    generatedAt: new Date().toISOString(),
    backend,
    workspace,
    integration: {
      backendReachable,
      strictReady,
      fallbackReady,
      reports: {
        doctor: doctor ? "available" : "missing",
        compatibility: compatibility ? "available" : "missing",
        evaluation: evaluation ? "available" : "missing",
        liveBackendIntegration: liveReport ? "available" : "missing",
        workspaceApiMode: apiModeReport ? "available" : "missing",
      },
      stepResults: steps.map((step, index) => ({
        step: index + 1,
        ok: step.ok,
      })),
    },
    capabilities: deriveCapabilities(liveReport),
    boundaries: {
      mockDefault: true,
      noTrading: true,
      noBroker: true,
      noDashboardSaaS: true,
      backendOptional: true,
    },
  };

  const artifactPath = path.resolve(WORKSPACE_PATH, "artifacts/integration-bundle.json");
  fs.writeFileSync(artifactPath, JSON.stringify(bundle, null, 2));

  const docPath = path.resolve(WORKSPACE_PATH, "docs/integration_bundle.md");
  writeBundleDoc(docPath, bundle);

  console.log(`generate-integration-bundle: wrote ${artifactPath}`);
  console.log(`generate-integration-bundle: wrote ${docPath}`);
}

main();
