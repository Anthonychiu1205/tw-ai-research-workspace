import { runPipeline } from "@/lib/api/client";

export async function runPipelineTool(input: Record<string, unknown>) {
  return runPipeline(input);
}
