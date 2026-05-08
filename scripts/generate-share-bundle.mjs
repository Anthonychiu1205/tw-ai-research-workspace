import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/workspace-share-bundle.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, filePath), "utf-8"));
}

function stableSerialize(input) {
  if (Array.isArray(input)) {
    return `[${input.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (!input || typeof input !== "object") {
    return JSON.stringify(input);
  }

  const entries = Object.entries(input).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableSerialize(v)}`).join(",")}}`;
}

function computeBundleChecksum(input) {
  const value = stableSerialize(input);
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return `bundle_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

const sessionDemo = readJson("fixtures/demo/session-demo.json");
const scenariosCompleted = [
  "analyze_2330",
  "generate_2330_report",
  "compare_ai_server_watchlist",
  "inspect_planner_trace",
  "evaluate_phase2_signals",
  "explore_strategy_presets",
];

const sessions = (sessionDemo.sessions ?? []).map((session) => ({
  schemaVersion: "workspace-session.v0.2",
  runtimeMode: "mock",
  modelId: "mock-research",
  provider: "mock",
  messages: [],
  artifacts: [],
  ...session,
}));

const runtimeSettings = {
  mode: "mock",
  apiBaseUrl: "http://localhost:8000",
  apiBridgeMode: "mock",
  selectedProvider: "mock",
  selectedModel: "mock-research",
  fallbackToMock: true,
  showToolCalls: true,
  showTokenUsage: true,
  maxToolSteps: 3,
};

const base = {
  schemaVersion: "workspace-share-bundle.v0.5",
  bundleId: `wsb_${Date.now().toString(36)}`,
  createdAt: new Date().toISOString(),
  source: "mock",
  synthetic: true,
  notFinancialAdvice: true,
  noTradingExecution: true,
  sessions,
  artifacts: sessionDemo.artifacts ?? [],
  runtimeSettings,
  scenariosCompleted,
};

const share = {
  ...base,
  checksum: computeBundleChecksum(base),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(share, null, 2));
console.log(`generate-share-bundle: wrote ${outPath}`);
