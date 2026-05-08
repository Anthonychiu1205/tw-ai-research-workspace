import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/mock-boundary-check.json");

const requiredPhraseGroups = [
  ["mock", "模擬"],
  ["synthetic", "synthetic"],
  ["not financial advice", "非投資建議"],
  ["no trading", "不提供交易", "不執行交易"],
  ["backend optional", "backend-optional", "後端可選", "backend 可選"],
];

const forbiddenClaims = [
  "real trading",
  "auto trading",
  "guaranteed returns",
  "risk-free",
];

const files = ["README.md", "docs/runtime.md", "docs/workspace-ux.md", "fixtures/demo/research-card-2330.json"];
const textBlob = files.map((file) => fs.readFileSync(path.resolve(root, file), "utf-8").toLowerCase()).join("\n");

const missingRequired = requiredPhraseGroups
  .filter((group) => !group.some((phrase) => textBlob.includes(phrase)))
  .map((group) => group.join(" | "));
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
