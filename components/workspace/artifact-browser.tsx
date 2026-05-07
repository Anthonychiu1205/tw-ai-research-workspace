export function ArtifactBrowser({ artifacts }: { artifacts: Array<{ id: string; title: string; kind: string }> }) {
  return (
    <div className="space-y-2">
      {artifacts.map((artifact) => (
        <div key={artifact.id} className="rounded-md border p-2 text-sm">
          <div>{artifact.title}</div>
          <div className="text-xs text-muted-foreground">{artifact.kind}</div>
        </div>
      ))}
    </div>
  );
}
