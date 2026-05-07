import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EvidenceCard({ item }: { item: { title: string; detail: string } }) {
  return (
    <Card>
      <CardHeader>{item.title}</CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.detail}</p>
      </CardContent>
    </Card>
  );
}
