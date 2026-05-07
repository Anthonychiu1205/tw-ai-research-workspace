export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="animate-pulse rounded-md border p-3 text-sm text-muted-foreground">{label}</div>;
}
