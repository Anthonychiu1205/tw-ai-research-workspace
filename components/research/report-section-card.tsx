import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReportSectionCard({ title, content }: { title: string; content: string }) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
