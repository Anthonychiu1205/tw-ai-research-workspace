import fs from "node:fs";
import path from "node:path";

const schemaSummary = {
  generatedAt: new Date().toISOString(),
  schemas: {
    research: ["ResearchCard", "SignalMatrix", "AgentSignal", "AgentConsensusPanel", "ResearchRun", "ResearchResult"],
    reports: ["ResearchReport", "ReportSection", "ReportQuality", "LLMTrace"],
    traces: ["ResearchPlan", "ResearchStep", "ToolCallTrace", "ExecutionTrace", "ReflectionResult", "ResearchPipelineResult"],
    strategies: ["StrategyComparison", "StrategyResult"],
    signals: ["SignalEvaluationResult", "SignalDistribution", "FactorCoverage", "AgentContribution"],
    tools: ["WorkspaceToolCall", "WorkspaceToolResult", "ToolStatus"],
    workspace: [
      "WorkspaceSession",
      "WorkspaceArtifact",
      "WorkspaceRuntimeMode",
      "ModelProvider",
      "WorkspaceMessage",
      "WorkspaceRuntimeConfig",
      "WorkspaceRuntimeStatus",
      "WorkspaceContextState"
    ],
    bundles: [
      "WorkspaceBackup(workspace-backup.v0.3)",
      "WorkspaceShareBundle(workspace-share-bundle.v0.5)"
    ]
  }
};

const outDir = path.join(process.cwd(), "artifacts");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, "workspace-schemas.json");
fs.writeFileSync(outPath, JSON.stringify(schemaSummary, null, 2));
console.log(`export-workspace-schema: wrote ${outPath}`);
