import { z } from "zod";
import { workspaceToolResultSchema, type WorkspaceToolResult } from "@/lib/schemas/tools";
import {
  runResearch,
  generateReport,
  runPipeline,
  runPortfolioReview,
  runBacktestV2,
  compareStrategies,
  evaluateSignals,
} from "@/lib/api/client";
import { mockToolData } from "@/lib/tools/mock-tools";

const symbolInputSchema = z.object({ symbol: z.string().default("2330") });

export type ToolCategory = "research" | "report" | "pipeline" | "strategy" | "signal" | "evidence" | "portfolio" | "backtest";

export type ToolDefinition = {
  name: string;
  label: string;
  description: string;
  category: ToolCategory;
  inputSchema: z.ZodTypeAny;
  outputKind: string;
  producesArtifacts: boolean;
  execute: (input: any) => Promise<WorkspaceToolResult>;
};

function nowIso() {
  return new Date().toISOString();
}

async function toToolResult(
  toolName: string,
  operation: () => Promise<{ ok: boolean; data?: any; fallbackData?: any; error?: Error; meta?: any }>,
): Promise<WorkspaceToolResult> {
  const startedAt = nowIso();
  const startMs = Date.now();
  const result = await operation();
  const completedAt = nowIso();
  const latencyMs = Date.now() - startMs;

  if (result.ok) {
    return workspaceToolResultSchema.parse({
      toolName,
      status: "succeeded",
      startedAt,
      completedAt,
      latencyMs,
      summary: `${toolName} completed`,
      data: result.data,
      evidenceIds: [],
      warnings: [],
      source: result.meta?.source ?? "mock",
      fallbackUsed: result.meta?.fallbackUsed ?? false,
    });
  }

  return workspaceToolResultSchema.parse({
    toolName,
    status: "failed",
    startedAt,
    completedAt,
    latencyMs,
    summary: `${toolName} API failed, fallback used`,
    data: result.fallbackData ?? null,
    evidenceIds: [],
    warnings: [result.error?.message ?? "fallback to mock"],
    source: result.meta?.source ?? "mock_fallback",
    fallbackUsed: true,
  });
}

export const workspaceTools: ToolDefinition[] = [
  {
    name: "runResearch",
    label: "Run Research",
    description: "Run research pipeline summary for Taiwan symbol",
    category: "research",
    inputSchema: symbolInputSchema,
    outputKind: "research_card",
    producesArtifacts: true,
    execute: async (input) => toToolResult("runResearch", () => runResearch(input)),
  },
  {
    name: "generateReport",
    label: "Generate Report",
    description: "Generate synthetic report sections",
    category: "report",
    inputSchema: symbolInputSchema,
    outputKind: "report",
    producesArtifacts: true,
    execute: async (input) => toToolResult("generateReport", () => generateReport(input)),
  },
  {
    name: "runPipeline",
    label: "Run Pipeline",
    description: "Run planner/executor/reflection synthetic pipeline",
    category: "pipeline",
    inputSchema: symbolInputSchema,
    outputKind: "pipeline_trace",
    producesArtifacts: true,
    execute: async (input) => toToolResult("runPipeline", () => runPipeline(input)),
  },
  {
    name: "compareStrategies",
    label: "Compare Strategies",
    description: "Compare synthetic strategies with no trading execution",
    category: "strategy",
    inputSchema: symbolInputSchema,
    outputKind: "strategy_comparison",
    producesArtifacts: true,
    execute: async (input) => toToolResult("compareStrategies", () => compareStrategies(input)),
  },
  {
    name: "runPortfolioReview",
    label: "Run Portfolio Review",
    description: "Create synthetic portfolio allocation and rebalance target plan",
    category: "portfolio",
    inputSchema: symbolInputSchema,
    outputKind: "portfolio_review",
    producesArtifacts: true,
    execute: async (input) => toToolResult("runPortfolioReview", () => runPortfolioReview(input)),
  },
  {
    name: "runBacktestV2",
    label: "Run Backtest v2",
    description: "Run synthetic portfolio-managed backtest summary",
    category: "backtest",
    inputSchema: symbolInputSchema,
    outputKind: "backtest_v2_summary",
    producesArtifacts: true,
    execute: async (input) => toToolResult("runBacktestV2", () => runBacktestV2(input)),
  },
  {
    name: "evaluateSignals",
    label: "Evaluate Signals",
    description: "Evaluate agent signal distribution",
    category: "signal",
    inputSchema: symbolInputSchema,
    outputKind: "signal_evaluation",
    producesArtifacts: true,
    execute: async (input) => toToolResult("evaluateSignals", () => evaluateSignals(input)),
  },
  {
    name: "getEvidenceTimeline",
    label: "Evidence Timeline",
    description: "Get synthetic evidence timeline",
    category: "evidence",
    inputSchema: symbolInputSchema,
    outputKind: "evidence_timeline",
    producesArtifacts: true,
    execute: async () =>
      workspaceToolResultSchema.parse({
        toolName: "getEvidenceTimeline",
        status: "succeeded",
        startedAt: nowIso(),
        completedAt: nowIso(),
        latencyMs: 15,
        summary: "Loaded synthetic evidence timeline",
        data: mockToolData.getEvidenceTimeline,
        evidenceIds: ["ev-1", "ev-2"],
        warnings: [],
        source: "mock",
        fallbackUsed: false,
      }),
  },
  {
    name: "getSignalMatrix",
    label: "Signal Matrix",
    description: "Get synthetic signal matrix",
    category: "signal",
    inputSchema: symbolInputSchema,
    outputKind: "signal_matrix",
    producesArtifacts: false,
    execute: async () =>
      workspaceToolResultSchema.parse({
        toolName: "getSignalMatrix",
        status: "succeeded",
        startedAt: nowIso(),
        completedAt: nowIso(),
        latencyMs: 15,
        summary: "Loaded synthetic signal matrix",
        data: mockToolData.getSignalMatrix,
        evidenceIds: [],
        warnings: [],
        source: "mock",
        fallbackUsed: false,
      }),
  },
  {
    name: "getAgentConsensus",
    label: "Agent Consensus",
    description: "Get synthetic multi-agent consensus",
    category: "research",
    inputSchema: symbolInputSchema,
    outputKind: "agent_consensus",
    producesArtifacts: false,
    execute: async () =>
      workspaceToolResultSchema.parse({
        toolName: "getAgentConsensus",
        status: "succeeded",
        startedAt: nowIso(),
        completedAt: nowIso(),
        latencyMs: 15,
        summary: "Loaded synthetic consensus panel",
        data: mockToolData.getAgentConsensus,
        evidenceIds: [],
        warnings: [],
        source: "mock",
        fallbackUsed: false,
      }),
  },
];

export function getToolByName(name: string) {
  return workspaceTools.find((tool) => tool.name === name);
}
