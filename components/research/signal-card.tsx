import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>{label}</CardHeader>
      <CardContent>
        <div className="text-sm">{value}</div>
      </CardContent>
    </Card>
  );
}
