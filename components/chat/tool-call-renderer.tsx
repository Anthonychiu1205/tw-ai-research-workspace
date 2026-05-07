import { Card, CardContent } from "@/components/ui/card";

export function ToolCallRenderer({ event }: { event: { toolName: string; summary: string } }) {
  return (
    <Card>
      <CardContent>
        <div className="text-xs text-muted-foreground">tool: {event.toolName}</div>
        <div className="text-sm">{event.summary}</div>
      </CardContent>
    </Card>
  );
}
