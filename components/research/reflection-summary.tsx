export function ReflectionSummary({
  summary,
  warnings,
  critiques,
  missingEvidence,
  overclaimingRisk,
}: {
  summary: string;
  warnings?: string[];
  critiques?: string[];
  missingEvidence?: string[];
  overclaimingRisk?: string;
}) {
  return (
    <div className="space-y-2 rounded-md border p-3 text-sm text-muted-foreground" data-testid="reflection-summary">
      <div>{summary}</div>
      {warnings?.length ? <div className="text-yellow-300">warnings: {warnings.join("; ")}</div> : null}
      {critiques?.length ? <div>critiques: {critiques.join("; ")}</div> : null}
      {missingEvidence?.length ? <div>missing evidence: {missingEvidence.join(", ")}</div> : null}
      {overclaimingRisk ? <div>overclaiming risk: {overclaimingRisk}</div> : null}
      <div className="text-xs">bounded deterministic workflow, no uncontrolled autonomous loops.</div>
    </div>
  );
}
