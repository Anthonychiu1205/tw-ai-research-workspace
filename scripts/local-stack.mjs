import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const WORKSPACE_PATH = process.cwd();
const BACKEND_PATH = path.resolve(WORKSPACE_PATH, "../tw-ai-investment-research");
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

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: "utf-8",
    stdio: "pipe",
    shell: false,
    env: options.env ?? process.env,
  });

  if (result.error) {
    return {
      ok: false,
      code: null,
      stdout: "",
      stderr: result.error.message,
    };
  }

  return {
    ok: result.status === 0,
    code: result.status,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
  };
}

function runGit(args, cwd = process.cwd()) {
  return runCommand("git", args, { cwd });
}

function getGitInfo(cwd) {
  if (!fs.existsSync(cwd)) {
    return {
      path: cwd,
      branch: "unknown",
      latestCommit: "unknown",
      statusClean: false,
      statusShort: "",
      remotes: [],
      tags: [],
      error: "repo_not_found",
    };
  }

  const branchResult = runGit(["branch", "--show-current"], cwd);
  const commitResult = runGit(["log", "--oneline", "-1"], cwd);
  const statusResult = runGit(["status", "--short"], cwd);
  const remotesResult = runGit(["remote", "-v"], cwd);
  const tagsResult = runGit(["tag", "--list"], cwd);

  const errors = [branchResult, commitResult, statusResult, remotesResult, tagsResult]
    .filter((result) => !result.ok)
    .map((result) => result.stderr)
    .filter(Boolean);

  const statusShort = statusResult.ok ? statusResult.stdout : "";

  return {
    path: cwd,
    branch: branchResult.ok ? branchResult.stdout || "unknown" : "unknown",
    latestCommit: commitResult.ok ? commitResult.stdout || "unknown" : "unknown",
    statusClean: statusResult.ok ? statusShort.length === 0 : false,
    statusShort,
    remotes: remotesResult.ok && remotesResult.stdout ? remotesResult.stdout.split("\n").filter(Boolean) : [],
    tags: tagsResult.ok && tagsResult.stdout ? tagsResult.stdout.split("\n").filter(Boolean) : [],
    ...(errors.length > 0 ? { error: errors.join("; ") } : {}),
  };
}

function terminalCommands(baseUrl) {
  return {
    terminalA: [
      `cd ${BACKEND_PATH}`,
      "python3 -m uvicorn apps.api.main:app --host 127.0.0.1 --port 8000",
    ],
    terminalB: [
      `cd ${WORKSPACE_PATH}`,
      `TW_AI_RESEARCH_API_BASE_URL=${baseUrl} node scripts/check-live-backend-integration.mjs --strict`,
      `TW_AI_RESEARCH_API_BASE_URL=${baseUrl} node scripts/check-workspace-api-mode.mjs --strict`,
    ],
    terminalC: [
      `cd ${WORKSPACE_PATH}`,
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

function runNodeScript(scriptPath, args = [], options = {}) {
  return runCommand(process.execPath, [scriptPath, ...args], {
    cwd: options.cwd ?? WORKSPACE_PATH,
    env: {
      ...process.env,
      ...(options.env ?? {}),
    },
  });
}

function runIntegrationChecks(baseUrl, strict, asJson) {
  const liveResult = runNodeScript(
    "scripts/check-live-backend-integration.mjs",
    strict ? ["--strict"] : [],
    { env: { TW_AI_RESEARCH_API_BASE_URL: baseUrl } },
  );
  const apiModeResult = runNodeScript(
    "scripts/check-workspace-api-mode.mjs",
    strict ? ["--strict"] : [],
    { env: { TW_AI_RESEARCH_API_BASE_URL: baseUrl } },
  );

  const liveReport = safeReadJson(path.resolve(WORKSPACE_PATH, "artifacts/live-backend-integration-report.json"));
  const apiModeReport = safeReadJson(path.resolve(WORKSPACE_PATH, "artifacts/workspace-api-mode-report.json"));
  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    strict,
    liveBackendIntegration: liveReport,
    workspaceApiMode: apiModeReport,
    passed:
      Boolean(liveResult.ok && apiModeResult.ok) &&
      Boolean((liveReport?.passed ?? !strict) && (apiModeReport?.passed ?? !strict)),
    note: "Integration checks are local-stack readiness checks only. No trading or broker execution.",
    scriptStatus: {
      liveBackendIntegration: {
        ok: liveResult.ok,
        code: liveResult.code,
      },
      workspaceApiMode: {
        ok: apiModeResult.ok,
        code: apiModeResult.code,
      },
    },
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
  const warnings = [];
  const checks = [];

  const workspaceRequiredChecks = [
    { name: "workspace_path_exists", passed: fs.existsSync(WORKSPACE_PATH), message: WORKSPACE_PATH },
    { name: "workspace_package_json", passed: exists("package.json"), message: "package.json" },
    { name: "workspace_app_dir", passed: exists("app"), message: "app/" },
    {
      name: "workspace_live_integration_script",
      passed: exists("scripts/check-live-backend-integration.mjs"),
      message: "scripts/check-live-backend-integration.mjs",
    },
    {
      name: "workspace_api_mode_script",
      passed: exists("scripts/check-workspace-api-mode.mjs"),
      message: "scripts/check-workspace-api-mode.mjs",
    },
  ];

  for (const check of workspaceRequiredChecks) {
    checks.push({
      scope: "workspace",
      ...check,
      severity: "required",
    });
  }

  const npmVersionResult = runCommand("npm", ["--version"], { cwd: WORKSPACE_PATH });
  checks.push({
    scope: "workspace",
    name: "node_available",
    passed: Boolean(process.version),
    message: process.version,
    severity: "required",
  });
  checks.push({
    scope: "workspace",
    name: "npm_available",
    passed: npmVersionResult.ok,
    message: npmVersionResult.ok ? npmVersionResult.stdout : npmVersionResult.stderr,
    severity: "required",
  });

  const backendOptionalChecks = [
    { name: "backend_repo_exists", passed: fs.existsSync(BACKEND_PATH), message: BACKEND_PATH },
    {
      name: "backend_smoke_script",
      passed: fs.existsSync(path.resolve(BACKEND_PATH, "scripts/smoke_test.sh")),
      message: "scripts/smoke_test.sh",
    },
    {
      name: "backend_release_check_script",
      passed: fs.existsSync(path.resolve(BACKEND_PATH, "scripts/release_check.py")),
      message: "scripts/release_check.py",
    },
    {
      name: "backend_local_api_surface_script",
      passed: fs.existsSync(path.resolve(BACKEND_PATH, "scripts/check_local_api_surface.py")),
      message: "scripts/check_local_api_surface.py",
    },
  ];

  for (const check of backendOptionalChecks) {
    checks.push({
      scope: "backend_sibling",
      ...check,
      severity: "optional",
    });
    if (!check.passed) {
      warnings.push(`[backend_sibling] ${check.name} missing (${check.message})`);
    }
  }

  const requiredPassed = checks
    .filter((check) => check.severity === "required")
    .every((check) => check.passed);

  const report = {
    checkedAt: new Date().toISOString(),
    passed: requiredPassed,
    warnings,
    checks,
    warning: "Backend sibling repository is optional for CI doctor checks.",
  };

  const outPath = writeArtifact("local-stack-doctor.json", report);
  if (asJson) {
    console.log(JSON.stringify({ ...report, outPath }, null, 2));
  } else {
    console.log(`local-stack doctor: ${requiredPassed ? "OK" : "FAILED"} (${outPath})`);
  }

  if (!requiredPassed) process.exit(1);
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
