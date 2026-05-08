import { normalizeRuntimeConfig, buildRuntimeStatus } from "@/lib/config/runtime";
import { getProviderAvailabilityByName } from "@/lib/ai/providers";
import { createMockResearchStream, mockTokenUsage, type MockMessage } from "@/lib/ai/mock-provider";
import { createTokenUsageSummary, type WorkspaceStreamEvent } from "@/lib/ai/stream-utils";
import { getToolByName } from "@/lib/ai/tool-registry";
import type { WorkspaceToolResult } from "@/lib/schemas/tools";
import type { WorkspaceRuntimeConfig } from "@/lib/schemas/workspace";
import type { Locale } from "@/lib/i18n/types";

function nowIso() {
  return new Date().toISOString();
}

function extractTicker(text: string) {
  const match = text.match(/\b\d{4}\b/);
  return match?.[0] ?? "2330";
}

export function selectToolsFromPrompt(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const names: string[] = [];

  if (lower.includes("analyze") || lower.includes("分析") || lower.includes("2330")) names.push("runResearch");
  if (lower.includes("report") || lower.includes("報告")) names.push("generateReport");
  if (lower.includes("pipeline") || lower.includes("trace") || lower.includes("planner") || lower.includes("軌跡")) names.push("runPipeline");
  if (lower.includes("compare") || lower.includes("strategy") || lower.includes("策略")) names.push("compareStrategies");
  if (lower.includes("signal") || lower.includes("訊號")) names.push("evaluateSignals", "getSignalMatrix");
  if (lower.includes("evidence") || lower.includes("timeline") || lower.includes("證據")) names.push("getEvidenceTimeline");
  if (names.length === 0) names.push("runResearch", "getAgentConsensus");

  return Array.from(new Set(names));
}

export function normalizeToolCallResult(result: WorkspaceToolResult) {
  return {
    toolName: result.toolName,
    status: result.status,
    summary: result.summary,
    latencyMs: result.latencyMs,
    evidenceIds: result.evidenceIds,
    warnings: result.warnings,
    source: result.source,
    fallbackUsed: result.fallbackUsed,
    data: result.data,
    dataPreview:
      result.data && typeof result.data === "object"
        ? Object.keys(result.data as Record<string, unknown>).slice(0, 4)
        : [],
  };
}

export async function runAssistantRuntime(input: {
  messages: MockMessage[];
  modelId: string;
  provider: "mock" | "openai" | "anthropic" | "local";
  locale?: Locale;
  runtimeConfig?: Partial<WorkspaceRuntimeConfig>;
}) {
  const config = normalizeRuntimeConfig({
    selectedProvider: input.provider,
    selectedModel: input.modelId,
    ...(input.runtimeConfig ?? {}),
  });

  const providerState = getProviderAvailabilityByName(input.provider);
  const prompt = [...input.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const ticker = extractTicker(prompt);

  const events: WorkspaceStreamEvent[] = [];
  const messageId = `assistant-${Date.now()}`;
  const locale = input.locale ?? "zh-TW";
  const runningText = locale === "zh-TW" ? "執行中" : "Running";
  const boundedNote =
    locale === "zh-TW" ? "使用具步數上限的 deterministic 工作流。" : "Deterministic workspace workflow with bounded tool steps.";

  if (!providerState.available && input.provider !== "mock") {
    events.push({
      type: "trace_update",
      id: `${messageId}-provider-fallback`,
      timestamp: nowIso(),
      payload: {
        warning: `Provider ${input.provider} unavailable (${providerState.reason ?? "env-gated"}); using mock runtime`,
      },
    });
  }

  const selectedTools = selectToolsFromPrompt(prompt).slice(0, config.maxToolSteps);

  events.push({
    type: "trace_update",
    id: `${messageId}-trace-start`,
    timestamp: nowIso(),
    payload: {
      phase: "planning",
      selectedTools,
      boundedSteps: config.maxToolSteps,
      note: boundedNote,
    },
  });

  if (config.streamToolCalls) {
    for (const toolName of selectedTools) {
      const tool = getToolByName(toolName);
      if (!tool) {
        continue;
      }

      events.push({
        type: "tool_call_start",
        id: `${messageId}-${toolName}-start`,
        timestamp: nowIso(),
        payload: { toolName, category: tool.category, label: tool.label, args: { symbol: ticker } },
      });

      events.push({
        type: "tool_call_delta",
        id: `${messageId}-${toolName}-delta`,
        timestamp: nowIso(),
        payload: { toolName, status: "running", summary: `${runningText} ${toolName}` },
      });

      const parsedInput = tool.inputSchema.safeParse({ symbol: ticker });
      const result = parsedInput.success
        ? await tool.execute(parsedInput.data)
        : {
            toolName,
            status: "failed",
            startedAt: nowIso(),
            completedAt: nowIso(),
            latencyMs: 0,
            summary: "Invalid tool input",
            data: null,
            evidenceIds: [],
            warnings: ["Invalid tool input"],
            source: "mock_fallback",
            fallbackUsed: true,
          };

      events.push({
        type: "tool_call_result",
        id: `${messageId}-${toolName}-result`,
        timestamp: nowIso(),
        payload: {
          ...normalizeToolCallResult(result as WorkspaceToolResult),
          summary: (result as WorkspaceToolResult).summary,
          status: (result as WorkspaceToolResult).status,
        },
      });
    }
  }

  events.push(...createMockResearchStream({ messageId, messages: input.messages, locale }));

  const usage = mockTokenUsage();
  events.push({
    type: "token_usage",
    id: `${messageId}-usage`,
    timestamp: nowIso(),
    payload: createTokenUsageSummary(usage),
  });

  events.push({
    type: "final",
    id: `${messageId}-final`,
    timestamp: nowIso(),
    payload: {
      disclaimer:
        locale === "zh-TW"
          ? "本工作區輸出為 synthetic 資料，非投資建議；不執行任何交易。"
          : "Synthetic workspace output, not financial advice. No trading execution.",
      maxToolSteps: config.maxToolSteps,
      noFinancialAdvice: true,
      tokenUsage: createTokenUsageSummary(usage),
    },
  });

  const status = buildRuntimeStatus({
    mode: config.mode,
    backendReachable: config.mode === "mock",
    providerAvailable: providerState.available,
    providerUnavailableReason: providerState.reason,
    fallbackActive: config.mode === "mock" || !providerState.available,
  });

  return {
    mode: config.mode,
    events,
    usage,
    status,
    warning: providerState.available ? undefined : `Provider ${input.provider} unavailable`,
  };
}
