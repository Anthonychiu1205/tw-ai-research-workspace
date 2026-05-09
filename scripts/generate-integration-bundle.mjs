import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const WORKSPACE_PATH = process.cwd();
const BACKEND_PATH = path.resolve(WORKSPACE_PATH, "../tw-ai-investment-research");
const BASE_URL = process.env.TW_AI_RESEARCH_API_BASE_URL || "http://127.0.0.1:8000";

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? WORKSPACE_PATH,
    encoding: "utf-8",
    stdio: "pipe",
    shell: false,
    env: options.env ?? process.env,
  });

  if (result.error) {
    return {
      ok: false,
      output: result.error.message,
    };
  }

  if (result.status !== 0) {
    return {
      ok: false,
      output: (result.stderr ?? result.stdout ?? "").toString().trim(),
    };
  }

  return {
    ok: true,
    output: (result.stdout ?? "").toString().trim(),
  };
}

function runNodeScript(scriptPath, args = [], env = {}) {
  return runCommand(process.execPath, [scriptPath, ...args], {
    cwd: WORKSPACE_PATH,
    env: {
      ...process.env,
      ...env,
    },
  });
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
  if (!fs.existsSync(repoPath)) {
    return {
      path: repoPath,
      branch: "unknown",
      commit: "unknown",
      statusClean: false,
      error: "repo_not_found",
    };
  }

  const branch = runCommand("git", ["branch", "--show-current"], { cwd: repoPath });
  const commit = runCommand("git", ["log", "--oneline", "-1"], { cwd: repoPath });
  const status = runCommand("git", ["status", "--short"], { cwd: repoPath });

  return {
    path: repoPath,
    branch: branch.ok ? String(branch.output).trim() || "unknown" : "unknown",
    commit: commit.ok ? String(commit.output).trim() || "unknown" : "unknown",
    statusClean: status.ok ? String(status.output).trim().length === 0 : false,
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
    runNodeScript("scripts/local-stack.mjs", ["doctor"]),
    runNodeScript("scripts/check-backend-compatibility.mjs"),
    runNodeScript("scripts/evaluate-workspace.mjs"),
    runNodeScript("scripts/check-live-backend-integration.mjs", [], { TW_AI_RESEARCH_API_BASE_URL: BASE_URL }),
    runNodeScript("scripts/check-workspace-api-mode.mjs", [], { TW_AI_RESEARCH_API_BASE_URL: BASE_URL }),
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
