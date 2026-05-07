import { generateReport } from "@/lib/api/client";

export async function generateReportTool(input: Record<string, unknown>) {
  return generateReport(input);
}
