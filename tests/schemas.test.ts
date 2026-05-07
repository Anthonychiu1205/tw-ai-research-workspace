import { describe, expect, test } from "vitest";
import researchCard from "@/fixtures/demo/research-card-2330.json";
import signalMatrix from "@/fixtures/demo/signal-matrix-watchlist.json";
import evidenceTimeline from "@/fixtures/demo/evidence-timeline-2330.json";
import reportSections from "@/fixtures/demo/report-sections-2330.json";
import strategyComparison from "@/fixtures/demo/strategy-comparison.json";
import plannerTrace from "@/fixtures/demo/planner-trace-2330.json";
import sessionDemo from "@/fixtures/demo/session-demo.json";
import researchRun from "@/fixtures/mock-api/research-run.json";
import report from "@/fixtures/mock-api/report.json";
import pipeline from "@/fixtures/mock-api/pipeline-result.json";
import signalEval from "@/fixtures/mock-api/signal-evaluation.json";
import { researchCardSchema, signalMatrixSchema, researchRunSchema } from "@/lib/schemas/research";
import { researchReportSchema } from "@/lib/schemas/reports";
import { researchPipelineResultSchema } from "@/lib/schemas/traces";
import { strategyComparisonSchema } from "@/lib/schemas/strategies";
import { signalEvaluationResultSchema } from "@/lib/schemas/signals";
import { workspaceSessionSchema } from "@/lib/schemas/workspace";

describe("schemas + fixtures", () => {
  test("research fixtures parse", () => {
    expect(() => researchCardSchema.parse(researchCard)).not.toThrow();
    expect(() => signalMatrixSchema.parse(signalMatrix)).not.toThrow();
    expect(() => researchRunSchema.parse(researchRun)).not.toThrow();
  });

  test("report and trace fixtures parse", () => {
    expect(() => researchReportSchema.parse(report)).not.toThrow();
    expect(() => researchPipelineResultSchema.parse(pipeline)).not.toThrow();
    expect(() => researchPipelineResultSchema.parse(plannerTrace)).not.toThrow();
  });

  test("strategy and signal fixtures parse", () => {
    expect(() => strategyComparisonSchema.parse(strategyComparison)).not.toThrow();
    expect(() => signalEvaluationResultSchema.parse(signalEval)).not.toThrow();
  });

  test("session fixtures parse", () => {
    for (const session of sessionDemo.sessions) {
      expect(() => workspaceSessionSchema.parse(session)).not.toThrow();
    }
  });

  test("all demo fixtures carry synthetic metadata", () => {
    for (const fixture of [
      researchCard,
      signalMatrix,
      evidenceTimeline,
      reportSections,
      strategyComparison,
      plannerTrace,
      researchRun,
      report,
      pipeline,
      signalEval,
      sessionDemo,
    ]) {
      expect((fixture as any).metadata.provider).toBe("mock");
      expect((fixture as any).metadata.dataType).toBe("synthetic_mock");
      expect((fixture as any).metadata.notFinancialAdvice).toBe(true);
      expect((fixture as any).metadata.noTradingExecution).toBe(true);
    }
  });
});
