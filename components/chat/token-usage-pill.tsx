import { Badge } from "@/components/ui/badge";

export function TokenUsagePill({ usage }: { usage?: Record<string, unknown> | null }) {
  if (!usage) return null;
  const total = typeof usage.totalTokens === "number" ? usage.totalTokens : undefined;
  return <Badge>{total ? `tokens: ${total}` : `tokens: ${JSON.stringify(usage)}`}</Badge>;
}
