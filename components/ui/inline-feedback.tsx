import { StatusBadge } from "@/components/ui/status-badge";

export type InlineFeedbackTone = "neutral" | "success" | "warning" | "danger" | "backend" | "mock";

export function InlineFeedback({
  tone = "neutral",
  message,
  detail,
}: {
  tone?: InlineFeedbackTone;
  message: string;
  detail?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
      <div className="flex items-start gap-2">
        <StatusBadge tone={tone}>{message}</StatusBadge>
      </div>
      {detail ? <div className="mt-1 text-muted-foreground">{detail}</div> : null}
    </div>
  );
}
