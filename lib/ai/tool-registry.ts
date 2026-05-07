import { z } from "zod";
import { workspaceToolResultSchema, type WorkspaceToolResult } from "@/lib/schemas/tools";
import { runResearch, generateReport, runPipeline, compareStrategies, evaluateSignals } from "@/lib/api/client";
import { mockToolData } from "@/lib/tools/mock-tools";
import { nowIso } from "@/lib/utils/dates";

const symbolInputSchema = z.object({ symbol: z.string().default("2330") });

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  execute: (input: any) => Promise<WorkspaceToolResult>;
};

async function toToolResult(
  toolName: string,
  startedAt: string,
  operation: () => Promise<{ ok: boolean; data?: any; fallbackData?: any; error?: Error }>,
): Promise<WorkspaceToolResult> {
  const start = Date.now();
  const base = {
    toolName,
    startedAt,
    completedAt: nowIso(),
    latencyMs: Date.now() - start,
    evidenceIds: [] as string[],
    warnings: [] as string[],
  };

  const result = await operation();
  if (result.ok) {
    return workspaceToolResultSchema.parse({
      ...base,
      status: "success",
      summary: `${toolName} completed with mock-safe output`,
      data: result.data,
    });
  }

  return workspaceToolResultSchema.parse({
    ...base,
    status: "warning",
    summary: `${toolName} failed API call and used fallback`,
    data: result.fallbackData ?? null,
    warnings: [result.error?.message ?? "fallback to mock"],
  });
}

export const workspaceTools: ToolDefinition[] = [
  {
    name: "runResearch",
    description: "Run research pipeline summary for Taiwan symbol",
    inputSchema: symbolInputSchema,
    execute: async (input) => {
      const startedAt = nowIso();
      return toToolResult("runResearch", startedAt, () => runResearch(input));
    },
  },
  {
    name: "generateReport",
    description: "Generate synthetic report sections",
    inputSchema: symbolInputSchema,
    execute: async (input) => {
      const startedAt = nowIso();
      return toToolResult("generateReport", startedAt, () => generateReport(input));
    },
  },
  {
    name: "runPipeline",
    description: "Run planner/executor/reflection synthetic pipeline",
    inputSchema: symbolInputSchema,
    execute: async (input) => {
      const startedAt = nowIso();
      return toToolResult("runPipeline", startedAt, () => runPipeline(input));
    },
  },
  {
    name: "compareStrategies",
    description: "Compare synthetic strategies with no trading execution",
    inputSchema: symbolInputSchema,
    execute: async (input) => {
      const startedAt = nowIso();
      return toToolResult("compareStrategies", startedAt, () => compareStrategies(input));
    },
  },
  {
    name: "evaluateSignals",
    description: "Evaluate agent signal distribution",
    inputSchema: symbolInputSchema,
    execute: async (input) => {
      const startedAt = nowIso();
      return toToolResult("evaluateSignals", startedAt, () => evaluateSignals(input));
    },
  },
  {
    name: "getEvidenceTimeline",
    description: "Get synthetic evidence timeline",
    inputSchema: symbolInputSchema,
    execute: async () =>
      workspaceToolResultSchema.parse({
        toolName: "getEvidenceTimeline",
        status: "success",
        startedAt: nowIso(),
        completedAt: nowIso(),
        latencyMs: 15,
        summary: "Loaded synthetic evidence timeline",
        data: mockToolData.getEvidenceTimeline,
        evidenceIds: ["ev-1", "ev-2"],
        warnings: [],
      }),
  },
  {
    name: "getSignalMatrix",
    description: "Get synthetic signal matrix",
    inputSchema: symbolInputSchema,
    execute: async () =>
      workspaceToolResultSchema.parse({
        toolName: "getSignalMatrix",
        status: "success",
        startedAt: nowIso(),
        completedAt: nowIso(),
        latencyMs: 15,
        summary: "Loaded synthetic signal matrix",
        data: mockToolData.getSignalMatrix,
        evidenceIds: [],
        warnings: [],
      }),
  },
  {
    name: "getAgentConsensus",
    description: "Get synthetic multi-agent consensus",
    inputSchema: symbolInputSchema,
    execute: async () =>
      workspaceToolResultSchema.parse({
        toolName: "getAgentConsensus",
        status: "success",
        startedAt: nowIso(),
        completedAt: nowIso(),
        latencyMs: 15,
        summary: "Loaded synthetic consensus panel",
        data: mockToolData.getAgentConsensus,
        evidenceIds: [],
        warnings: [],
      }),
  },
];

export function getToolByName(name: string) {
  return workspaceTools.find((tool) => tool.name === name);
}
