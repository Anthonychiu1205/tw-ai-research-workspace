export function SignalExplorer({
  distribution,
}: {
  distribution: { positive: number; neutral: number; negative: number };
}) {
  return (
    <div className="rounded-md border p-3 text-sm">
      <div>Positive: {distribution.positive}</div>
      <div>Neutral: {distribution.neutral}</div>
      <div>Negative: {distribution.negative}</div>
    </div>
  );
}
