export function ArtifactJsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="max-h-72 overflow-auto rounded-md border bg-muted/30 p-2 text-[11px]" data-testid="artifact-json-viewer">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
