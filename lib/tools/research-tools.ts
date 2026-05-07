import { runResearch, evaluateSignals } from "@/lib/api/client";

export async function runResearchTool(input: Record<string, unknown>) {
  return runResearch(input);
}

export async function evaluateSignalsTool(input: Record<string, unknown>) {
  return evaluateSignals(input);
}
