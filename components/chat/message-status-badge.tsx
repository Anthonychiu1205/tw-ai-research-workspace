import { Badge } from "@/components/ui/badge";

export function MessageStatusBadge({ status }: { status: "streaming" | "complete" | "error" }) {
  const label = status === "streaming" ? "streaming" : status === "error" ? "error" : "complete";
  return <Badge>{label}</Badge>;
}
