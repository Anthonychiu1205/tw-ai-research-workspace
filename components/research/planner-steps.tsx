export function PlannerSteps({ steps }: { steps: Array<{ title: string; status: string }> }) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      {steps.map((step) => (
        <div key={step.title} className="flex items-center justify-between text-sm">
          <span>{step.title}</span>
          <span className="text-xs text-muted-foreground">{step.status}</span>
        </div>
      ))}
    </div>
  );
}
