export function ExecutorTrace({ calls }: { calls: Array<{ toolName: string; status: string }> }) {
  return (
    <div className="space-y-2 rounded-md border p-3 text-sm">
      {calls.map((call) => (
        <div key={call.toolName} className="flex justify-between">
          <span>{call.toolName}</span>
          <span className="text-xs text-muted-foreground">{call.status}</span>
        </div>
      ))}
    </div>
  );
}
