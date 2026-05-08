import { describe, expect, test } from "vitest";
import researchRun from "@/fixtures/mock-api/research-run.json";
import report from "@/fixtures/mock-api/report.json";
import pipeline from "@/fixtures/mock-api/pipeline-result.json";
import signalEval from "@/fixtures/mock-api/signal-evaluation.json";
import strategyComparison from "@/fixtures/demo/strategy-comparison.json";
import timeline from "@/fixtures/demo/evidence-timeline-2330.json";
import {
  adaptResearchRunToResearchCard,
  adaptResearchRunToSignalMatrix,
  adaptReportToSections,
  adaptPipelineToPlannerTrace,
  adaptSignalEvaluationToExplorer,
  adaptStrategyComparisonToTable,
  adaptEvidenceTimeline,
} from "@/lib/api/adapters";

describe("adapters", () => {
  test("adapts research card and matrix", () => {
    const card = adaptResearchRunToResearchCard(researchRun, {
      source: "mock_fallback",
      provider: "mock",
      synthetic: true,
      fallbackUsed: true,
      fallbackReason: "api down",
      notFinancialAdvice: true,
      noTradingExecution: true,
    });
    const matrix = adaptResearchRunToSignalMatrix(researchRun);
    expect(card.symbol).toBe("2330");
    expect(matrix.watchlist.length).toBeGreaterThan(0);
    expect(card.metadata.source).toBe("mock_fallback");
    expect(card.metadata.fallbackUsed).toBe(true);
  });

  test("adapts report and trace", () => {
    const sections = adaptReportToSections(report);
    const trace = adaptPipelineToPlannerTrace(pipeline);
    expect(sections.length).toBeGreaterThan(0);
    expect(trace.pipelineId).toContain("pipeline");
  });

  test("adapts signal and strategy", () => {
    const signal = adaptSignalEvaluationToExplorer(signalEval);
    const table = adaptStrategyComparisonToTable(strategyComparison);
    expect(signal.symbol).toBe("2330");
    expect(table.strategies.length).toBe(3);
  });

  test("adapts evidence timeline", () => {
    const adapted = adaptEvidenceTimeline(timeline);
    expect(adapted.points.length).toBeGreaterThan(0);
  });
});
