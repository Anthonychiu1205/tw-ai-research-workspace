import { StatusBadge } from "@/components/ui/status-badge";

export type ActionStatus = "idle" | "running" | "succeeded" | "failed" | "fallback";

const toneMap: Record<ActionStatus, "neutral" | "trace" | "success" | "danger" | "warning"> = {
  idle: "neutral",
  running: "trace",
  succeeded: "success",
  failed: "danger",
  fallback: "warning",
};

export function ActionStatusPill({ status, label }: { status: ActionStatus; label: string }) {
  return <StatusBadge tone={toneMap[status]}>{label}</StatusBadge>;
}
