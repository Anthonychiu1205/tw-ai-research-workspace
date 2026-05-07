import { researchCardSchema, signalMatrixSchema } from "@/lib/schemas/research";
import { reportSectionSchema } from "@/lib/schemas/reports";
import { researchPipelineResultSchema } from "@/lib/schemas/traces";
import { signalEvaluationResultSchema } from "@/lib/schemas/signals";
import { strategyComparisonSchema } from "@/lib/schemas/strategies";

export function adaptResearchRunToResearchCard(input: any) {
  return researchCardSchema.parse({
    id: input.runId ?? "run-mock",
    symbol: input.symbol,
    name: input.name ?? `${input.symbol} Synthetic`,
    summary: input.findings?.[0] ?? "Synthetic research summary",
    score: input.score ?? 0,
    updatedAt: input.generatedAt,
    metadata: input.metadata,
  });
}

export function adaptResearchRunToSignalMatrix(input: any) {
  return signalMatrixSchema.parse({
    id: input.runId ?? "matrix-mock",
    watchlist: ["2330", "2317", "2454", "2308", "0050"],
    signals: [
      {
        agent: "valuation",
        direction: "positive",
        confidence: 0.68,
        rationale: "Synthetic valuation spread",
      },
      {
        agent: "risk",
        direction: "neutral",
        confidence: 0.55,
        rationale: "Synthetic risk control",
      },
    ],
    metadata: input.metadata,
  });
}

export function adaptReportToSections(input: any) {
  return (input.sections ?? []).map((section: any) =>
    reportSectionSchema.parse({
      id: section.id,
      title: section.title,
      content: section.content,
      evidenceIds: section.evidenceIds ?? [],
    }),
  );
}

export function adaptPipelineToPlannerTrace(input: any) {
  return researchPipelineResultSchema.parse(input);
}

export function adaptSignalEvaluationToExplorer(input: any) {
  return signalEvaluationResultSchema.parse(input);
}

export function adaptStrategyComparisonToTable(input: any) {
  return strategyComparisonSchema.parse(input);
}

export function adaptEvidenceTimeline(input: any) {
  return {
    id: input.id,
    symbol: input.symbol,
    points: input.points ?? [],
    metadata: input.metadata,
  };
}
