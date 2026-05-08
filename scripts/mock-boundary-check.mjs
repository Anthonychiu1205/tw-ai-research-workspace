import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/mock-boundary-check.json");

const requiredPhrases = [
  "mock",
  "synthetic",
  "not financial advice",
  "no trading",
  "backend optional",
];

const forbiddenClaims = [
  "real trading",
  "auto trading",
  "guaranteed returns",
  "risk-free",
];

const files = ["README.md", "docs/runtime.md", "docs/workspace-ux.md", "fixtures/demo/research-card-2330.json"];
const textBlob = files.map((file) => fs.readFileSync(path.resolve(root, file), "utf-8").toLowerCase()).join("\n");

const missingRequired = requiredPhrases.filter((phrase) => !textBlob.includes(phrase));
const forbiddenHits = forbiddenClaims.filter((phrase) => textBlob.includes(phrase));

const passed = missingRequired.length === 0 && forbiddenHits.length === 0;
const report = {
  checkedAt: new Date().toISOString(),
  passed,
  missingRequired,
  forbiddenHits,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!passed) {
  console.error("mock-boundary-check: failed");
  process.exit(1);
}

console.log("mock-boundary-check: OK");
