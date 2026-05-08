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

  if (meta.notFinancialAdvice !== true) {
    return `${file}: notFinancialAdvice must be true`;
  }

  if (meta.noTradingExecution !== true) {
    return `${file}: noTradingExecution must be true`;
  }

  return null;
}

function validateDir(label, dir, strict = true) {
  const files = listJsonFiles(dir);
  const errors = [];
  const warnings = [];

  for (const name of files) {
    const full = path.join(dir, name);
    try {
      const json = JSON.parse(fs.readFileSync(full, "utf-8"));
      const issue = checkMetadata(json, `${label}/${name}`);
      if (issue && strict) {
        errors.push(issue);
      } else if (issue) {
        warnings.push(issue);
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
  : { label: "backend/demo", dir: backendDemoDir, files: [], errors: [], warnings: [], skipped: true };

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
