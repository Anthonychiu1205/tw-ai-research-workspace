import fs from "node:fs";
import path from "node:path";

const localDemoDir = path.resolve(process.cwd(), "fixtures/demo");
const localMockApiDir = path.resolve(process.cwd(), "fixtures/mock-api");
const backendDemoDir = path.resolve(process.cwd(), "../tw-ai-investment-research/artifacts/demo");
const outFile = path.resolve(process.cwd(), "artifacts/backend-contract-check.json");

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith(".json")).sort();
}

function checkMetadata(json, file) {
  if (!json || typeof json !== "object") {
    return `${file}: not an object`;
  }

  if (!("metadata" in json)) {
    return `${file}: missing metadata`;
  }

  const meta = json.metadata;
  if (!meta || typeof meta !== "object") {
    return `${file}: invalid metadata object`;
  }

  if (meta.provider !== "mock") {
    return `${file}: metadata.provider must be mock`;
  }

  if (meta.dataType !== "synthetic_mock") {
    return `${file}: metadata.dataType must be synthetic_mock`;
  }

  if (meta.notFinancialAdvice !== true) {
    return `${file}: notFinancialAdvice must be true`;
  }

  if (meta.noTradingExecution !== true) {
    return `${file}: noTradingExecution must be true`;
  }

  return null;
}

function hasFields(obj, keys) {
  return keys.every((key) => Object.prototype.hasOwnProperty.call(obj, key));
}

function validateContractByFileName(fileName, json, label) {
  const issues = [];

  if (fileName.includes("report") && !hasFields(json, ["sections"])) {
    issues.push(`${label}/${fileName}: report must include sections`);
  }

  if (fileName.includes("pipeline") || fileName.includes("trace")) {
    if (!hasFields(json, ["plan", "execution", "reflection"])) {
      issues.push(`${label}/${fileName}: trace must include plan/execution/reflection`);
    }
  }

  if (fileName.includes("signal-matrix")) {
    if (!hasFields(json, ["watchlist", "signals"])) {
      issues.push(`${label}/${fileName}: signal matrix must include watchlist/signals`);
    }
  }

  if (fileName.includes("strategy")) {
    if (!hasFields(json, ["strategies"])) {
      issues.push(`${label}/${fileName}: strategy comparison must include strategies`);
    }
  }

  if (fileName.includes("portfolio-review")) {
    if (!hasFields(json, ["targetWeights", "rebalancePlan", "cashWeight"])) {
      issues.push(`${label}/${fileName}: portfolio review must include targetWeights/rebalancePlan/cashWeight`);
    }
  }

  if (fileName.includes("backtest-v2")) {
    if (!hasFields(json, ["portfolioMetrics", "benchmarkMetrics", "exposure"])) {
      issues.push(`${label}/${fileName}: backtest v2 must include portfolioMetrics/benchmarkMetrics/exposure`);
    }
  }

  if (fileName === "session-demo.json") {
    const allowed = new Set([
      "research_card",
      "report",
      "pipeline_trace",
      "strategy_comparison",
      "signal_evaluation",
      "evidence_timeline",
      "backtest_summary",
      "portfolio_review",
      "rebalance_plan",
      "backtest_v2_summary",
    ]);

    const artifacts = Array.isArray(json.artifacts) ? json.artifacts : [];
    for (const artifact of artifacts) {
      const type = artifact.type ?? artifact.kind;
      if (type && !allowed.has(type)) {
        issues.push(`${label}/${fileName}: unknown artifact type ${type}`);
      }
    }
  }

  return issues;
}

function validateDir(label, dir, strict = true) {
  const files = listJsonFiles(dir);
  const errors = [];
  const warnings = [];

  for (const name of files) {
    const full = path.join(dir, name);
    try {
      const json = JSON.parse(fs.readFileSync(full, "utf-8"));
      const metaIssue = checkMetadata(json, `${label}/${name}`);
      if (metaIssue && strict) {
        errors.push(metaIssue);
      } else if (metaIssue) {
        warnings.push(metaIssue);
      }

      const issues = validateContractByFileName(name, json, label);
      if (strict) {
        errors.push(...issues);
      } else {
        warnings.push(...issues);
      }
    } catch (error) {
      if (strict) {
        errors.push(`${label}/${name}: ${(error && error.message) || "invalid json"}`);
      } else {
        warnings.push(`${label}/${name}: ${(error && error.message) || "invalid json"}`);
      }
    }
  }

  return { label, dir, files, errors, warnings };
}

const localDemo = validateDir("fixtures/demo", localDemoDir, true);
const localMockApi = validateDir("fixtures/mock-api", localMockApiDir, true);
const backendDemo = fs.existsSync(backendDemoDir)
  ? validateDir("backend/demo", backendDemoDir, false)
  : {
      label: "backend/demo",
      dir: backendDemoDir,
      files: [],
      errors: [],
      warnings: ["backend demo artifacts not found (optional)"],
      skipped: true,
    };

const errors = [...localDemo.errors, ...localMockApi.errors];

const report = {
  checkedAt: new Date().toISOString(),
  localDemo,
  localMockApi,
  backendDemo,
  passed: errors.length === 0,
  errors,
  warnings: [...localDemo.warnings, ...localMockApi.warnings, ...backendDemo.warnings],
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

if (errors.length > 0) {
  console.error(`check-backend-contract: failed with ${errors.length} issue(s)`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (backendDemo.skipped) {
  console.log("check-backend-contract: OK (backend demo dir missing, local fixtures validated)");
} else {
  console.log("check-backend-contract: OK (local and backend demo artifacts validated)");
}
