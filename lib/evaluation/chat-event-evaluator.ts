import { runAssistantRuntime } from "@/lib/ai/runtime";
import type { WorkspaceEvaluationCheck } from "@/lib/evaluation/workspace-evaluation-types";

const prompts = [
  { id: "analyze", prompt: "analyze 2330", expectTool: "runResearch" },
  { id: "report", prompt: "generate report for 2330", expectTool: "generateReport" },
  { id: "strategy", prompt: "compare strategy watchlist", expectTool: "compareStrategies" },
  { id: "pipeline", prompt: "show pipeline trace", expectTool: "runPipeline" },
  { id: "signal", prompt: "evaluate signals", expectTool: "evaluateSignals" },
];

export async function evaluateChatEvents(): Promise<WorkspaceEvaluationCheck[]> {
  const checks: WorkspaceEvaluationCheck[] = [];

  for (const prompt of prompts) {
    const runtime = await runAssistantRuntime({
      messages: [{ role: "user", content: prompt.prompt }],
      modelId: "mock-research",
      provider: "mock",
      runtimeConfig: { mode: "mock", maxToolSteps: 4, streamToolCalls: true },
    });

    const hasFinal = runtime.events.some((event) => event.type === "final");
    const hasTokenUsage = runtime.events.some((event) => event.type === "token_usage");
    const hasToolResult = runtime.events.some(
      (event) => event.type === "tool_call_result" && String(event.payload.toolName ?? "") === prompt.expectTool,
    );
    const final = runtime.events.find((event) => event.type === "final");
    const hasDisclaimer = String(final?.payload?.disclaimer ?? "").toLowerCase().includes("not financial advice");

    checks.push({
      name: `chat_${prompt.id}_final_event`,
      category: "chat_stream",
      passed: hasFinal,
      severity: "error",
      details: `prompt=${prompt.prompt}`,
    });

    checks.push({
      name: `chat_${prompt.id}_token_usage`,
      category: "chat_stream",
      passed: hasTokenUsage,
      severity: "warning",
      details: `prompt=${prompt.prompt}`,
    });

    checks.push({
      name: `chat_${prompt.id}_tool_result`,
      category: "tools",
      passed: hasToolResult,
      severity: "error",
      details: `expectedTool=${prompt.expectTool}`,
    });

    checks.push({
      name: `chat_${prompt.id}_disclaimer`,
      category: "safety",
      passed: hasDisclaimer,
      severity: "error",
      details: "Final event must include non-advice disclaimer",
    });
  }

  return checks;
}
