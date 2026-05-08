import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/workspace-demo-bundle.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, filePath), "utf-8"));
}

const sessionsFixture = readJson("fixtures/demo/session-demo.json");
const researchCard = readJson("fixtures/demo/research-card-2330.json");
const signalMatrix = readJson("fixtures/demo/signal-matrix-watchlist.json");
const evidenceTimeline = readJson("fixtures/demo/evidence-timeline-2330.json");
const reportSections = readJson("fixtures/demo/report-sections-2330.json");
const plannerTrace = readJson("fixtures/demo/planner-trace-2330.json");
const strategyComparison = readJson("fixtures/demo/strategy-comparison.json");

const bundle = {
  metadata: {
    provider: "mock",
    dataType: "synthetic_mock",
    notFinancialAdvice: true,
    noTradingExecution: true,
    generatedAt: new Date().toISOString(),
  },
  runtimeSettings: {
    mode: "mock",
    apiBridgeMode: "mock",
    apiBaseUrl: "http://localhost:8000",
    selectedProvider: "mock",
    selectedModel: "mock-research",
    fallbackToMock: true,
    showToolCalls: true,
    showTokenUsage: true,
    maxToolSteps: 3,
  },
  sessions: sessionsFixture.sessions,
  artifacts: sessionsFixture.artifacts,
  researchCard,
  signalMatrix,
  evidenceTimeline,
  reportSections,
  plannerTrace,
  strategyComparison,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2));
console.log(`generate-workspace-demo-bundle: wrote ${outPath}`);
