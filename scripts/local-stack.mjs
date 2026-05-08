import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const WORKSPACE_PATH = process.cwd();
const BACKEND_PATH = "/Volumes/DEV_USB/Projects/tw-ai-investment-research";
const PYTHON_PATH = "/Users/ant/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const DEFAULT_BASE_URL = process.env.TW_AI_RESEARCH_API_BASE_URL || "http://127.0.0.1:8000";

function parseArgs(argv) {
  const parsed = {
    command: argv[0] ?? "summary",
    strict: false,
    baseUrl: DEFAULT_BASE_URL,
    json: false,
  };

  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--strict") parsed.strict = true;
    else if (arg === "--json") parsed.json = true;
    else if (arg === "--base-url" && argv[i + 1]) {
      parsed.baseUrl = argv[i + 1];
      i += 1;
    }
  }

  return parsed;
}

function ensureArtifactsDir() {
  fs.mkdirSync(path.resolve(WORKSPACE_PATH, "artifacts"), { recursive: true });
}

function writeArtifact(filename, payload) {
  ensureArtifactsDir();
  const outPath = path.resolve(WORKSPACE_PATH, "artifacts", filename);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  return outPath;
}

function runGit(cwd, args) {
  return execSync(`git ${args}`, { cwd, encoding: "utf-8" }).trim();
}

function getGitInfo(cwd) {
  const branch = runGit(cwd, "branch --show-current");
  const commit = runGit(cwd, "log --oneline -1");
  const status = runGit(cwd, "status --short");
  const remotes = runGit(cwd, "remote -v");
  const tags = runGit(cwd, "tag --list");

  return {
    path: cwd,
    branch,
    latestCommit: commit,
    statusClean: status.length === 0,
    statusShort: status,
    remotes: remotes ? remotes.split("\n").filter(Boolean) : [],
    tags: tags ? tags.split("\n").filter(Boolean) : [],
  };
}

function terminalCommands(baseUrl) {
  return {
    terminalA: [
      "cd /Volumes/DEV_USB/Projects/tw-ai-investment-research",
      `PYTHON=${PYTHON_PATH}`,
      "$PYTHON -m uvicorn apps.api.main:app --host 127.0.0.1 --port 8000",
    ],
    terminalB: [
      "cd /Volumes/DEV_USB/Projects/tw-ai-research-workspace",
      `TW_AI_RESEARCH_API_BASE_URL=${baseUrl} node scripts/check-live-backend-integration.mjs --strict`,
      `TW_AI_RESEARCH_API_BASE_URL=${baseUrl} node scripts/check-workspace-api-mode.mjs --strict`,
    ],
    terminalC: [
      "cd /Volumes/DEV_USB/Projects/tw-ai-research-workspace",
      "NEXT_PUBLIC_WORKSPACE_MODE=api \\",
      "NEXT_PUBLIC_API_BRIDGE_MODE=proxy \\",
      `TW_AI_RESEARCH_API_BASE_URL=${baseUrl} \\`,
      "npm run dev",
    ],
  };
}

function printCommands(baseUrl, asJson) {
  const commands = terminalCommands(baseUrl);
  if (asJson) {
    console.log(JSON.stringify(commands, null, 2));
    return;
  }
  console.log("Terminal A — backend");
  console.log(commands.terminalA.join("\n"));
  console.log("");
  console.log("Terminal B — integration checks");
  console.log(commands.terminalB.join("\n"));
  console.log("");
  console.log("Terminal C — workspace");
  console.log(commands.terminalC.join("\n"));
}

async function checkBackend(baseUrl, strict, asJson) {
  const started = Date.now();
  let report;
  try {
    const response = await fetch(`${baseUrl}/health`);
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    report = {
      checkedAt: new Date().toISOString(),
      baseUrl,
      strict,
      reachable: response.ok,
      status: response.status,
      latencyMs: Date.now() - started,
      appTitle: payload?.appTitle ?? payload?.title ?? "unknown",
      warning: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    report = {
      checkedAt: new Date().toISOString(),
      baseUrl,
      strict,
      reachable: false,
      status: 0,
      latencyMs: Date.now() - started,
      appTitle: "unavailable",
      warning: error instanceof Error ? error.message : "network_error",
    };
  }

  const outPath = writeArtifact("local-stack-backend-check.json", report);
  if (asJson) {
    console.log(JSON.stringify({ ...report, outPath }, null, 2));
  } else if (report.reachable) {
    console.log(`local-stack check-backend: reachable (${baseUrl})`);
  } else {
    console.log(`local-stack check-backend: unreachable (${baseUrl})`);
  }

  if (!report.reachable && strict) process.exit(1);
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function runIntegrationChecks(baseUrl, strict, asJson) {
  const strictFlag = strict ? " --strict" : "";
  try {
    execSync(`TW_AI_RESEARCH_API_BASE_URL=${baseUrl} node scripts/check-live-backend-integration.mjs${strictFlag}`, {
      cwd: WORKSPACE_PATH,
      stdio: "pipe",
    });
  } catch (error) {
    if (strict) throw error;
  }

  try {
    execSync(`TW_AI_RESEARCH_API_BASE_URL=${baseUrl} node scripts/check-workspace-api-mode.mjs${strictFlag}`, {
      cwd: WORKSPACE_PATH,
      stdio: "pipe",
    });
  } catch (error) {
    if (strict) throw error;
  }

  const liveReport = safeReadJson(path.resolve(WORKSPACE_PATH, "artifacts/live-backend-integration-report.json"));
  const apiModeReport = safeReadJson(path.resolve(WORKSPACE_PATH, "artifacts/workspace-api-mode-report.json"));
  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    strict,
    liveBackendIntegration: liveReport,
    workspaceApiMode: apiModeReport,
    passed: Boolean((liveReport?.passed ?? !strict) && (apiModeReport?.passed ?? !strict)),
    note: "Integration checks are local-stack readiness checks only. No trading or broker execution.",
  };
  const outPath = writeArtifact("local-stack-integration-report.json", report);
  if (asJson) {
    console.log(JSON.stringify({ ...report, outPath }, null, 2));
  } else {
    console.log(`local-stack check-integration: ${report.passed ? "OK" : "FAILED"} (${outPath})`);
  }

  if (!report.passed) process.exit(1);
}

function exists(filePath) {
  return fs.existsSync(path.resolve(WORKSPACE_PATH, filePath));
}

function runDoctor(asJson) {
  const checks = {
    repos: {
      backendExists: fs.existsSync(BACKEND_PATH),
      workspaceExists: fs.existsSync(WORKSPACE_PATH),
    },
    runtimes: {
      nodeAvailable: Boolean(process.version),
      npmVersion: execSync("npm --version", { cwd: WORKSPACE_PATH, encoding: "utf-8" }).trim(),
      pythonRuntimeExists: fs.existsSync(PYTHON_PATH),
    },
    backendScripts: {
      smoke: fs.existsSync(path.resolve(BACKEND_PATH, "scripts/smoke_test.sh")),
      releaseCheck: fs.existsSync(path.resolve(BACKEND_PATH, "scripts/release_check.py")),
      localApiSurface: fs.existsSync(path.resolve(BACKEND_PATH, "scripts/check_local_api_surface.py")),
    },
    workspaceScripts: {
      liveIntegration: exists("scripts/check-live-backend-integration.mjs"),
      apiMode: exists("scripts/check-workspace-api-mode.mjs"),
      smoke: exists("scripts/smoke-test.mjs"),
      finalAudit: exists("scripts/workspace-final-audit.mjs"),
    },
  };

  const passed =
    Object.values(checks.repos).every(Boolean) &&
    checks.runtimes.nodeAvailable &&
    checks.runtimes.pythonRuntimeExists &&
    Object.values(checks.backendScripts).every(Boolean) &&
    Object.values(checks.workspaceScripts).every(Boolean);

  const report = {
    checkedAt: new Date().toISOString(),
    passed,
    checks,
    warning: "Backend service does not need to be running for doctor checks.",
  };

  const outPath = writeArtifact("local-stack-doctor.json", report);
  if (asJson) {
    console.log(JSON.stringify({ ...report, outPath }, null, 2));
  } else {
    console.log(`local-stack doctor: ${passed ? "OK" : "FAILED"} (${outPath})`);
  }

  if (!passed) process.exit(1);
}

function runSummary(asJson) {
  const backend = getGitInfo(BACKEND_PATH);
  const workspace = getGitInfo(WORKSPACE_PATH);

  const report = {
    generatedAt: new Date().toISOString(),
    backend,
    workspace,
    publishStatus: {
      noPushPerformed: true,
      noTagCreatedByScript: true,
      noRemoteMutationByScript: true,
      manualOnly: true,
    },
  };

  const outPath = writeArtifact("local-stack-summary.json", report);
  if (asJson) {
    console.log(JSON.stringify({ ...report, outPath }, null, 2));
    return;
  }

  console.log(`workspace: ${workspace.branch} @ ${workspace.latestCommit}`);
  console.log(`backend: ${backend.branch} @ ${backend.latestCommit}`);
  console.log(`workspace remotes: ${workspace.remotes.length}`);
  console.log(`backend remotes: ${backend.remotes.length}`);
  console.log(`local-stack summary written: ${outPath}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args.command;

  if (command === "print-commands") {
    printCommands(args.baseUrl, args.json);
    return;
  }
  if (command === "check-backend") {
    await checkBackend(args.baseUrl, args.strict, args.json);
    return;
  }
  if (command === "check-integration") {
    runIntegrationChecks(args.baseUrl, args.strict, args.json);
    return;
  }
  if (command === "doctor") {
    runDoctor(args.json);
    return;
  }
  if (command === "summary") {
    runSummary(args.json);
    return;
  }

  console.error(`Unknown local-stack command: ${command}`);
  process.exit(1);
}

void main();
