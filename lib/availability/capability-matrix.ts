import type { CapabilityContext, CapabilityStatus } from "@/lib/availability/availability-types";
import { evaluateCapability, listCapabilityRules } from "@/lib/availability/availability-rules";

export function buildCapabilityMatrix(ctx: CapabilityContext): CapabilityStatus[] {
  return listCapabilityRules().map((rule) => evaluateCapability(ctx, rule.id));
}
