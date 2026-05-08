const steps = [
  "Ask chat to analyze 2330",
  "Inspect evidence timeline and IDs",
  "Open report artifact sections",
  "Inspect planner/executor trace",
  "Compare strategy outputs",
  "Export workspace share bundle",
];

export function DemoJourney() {
  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="demo-journey">
      <div className="text-sm font-medium">Demo Journey</div>
      <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
