import { compareStrategies } from "@/lib/api/client";

export async function compareStrategiesTool(input: Record<string, unknown>) {
  return compareStrategies(input);
}
