export function AgentConsensusView({
  consensus,
}: {
  consensus: { consensus: string; confidence: number; highlights: string[] };
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm">Consensus: {consensus.consensus}</div>
      <div className="text-xs text-muted-foreground">Confidence: {(consensus.confidence * 100).toFixed(1)}%</div>
      <ul className="mt-2 list-disc pl-4 text-xs text-muted-foreground">
        {consensus.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
