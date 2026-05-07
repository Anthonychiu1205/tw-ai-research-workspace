export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
      <div className="font-medium text-foreground">{title}</div>
      <p className="mt-1">{detail}</p>
    </div>
  );
}
