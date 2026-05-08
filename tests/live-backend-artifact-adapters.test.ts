import { describe, expect, test } from "vitest";
import portfolioReviewFixture from "@/fixtures/mock-api/portfolio-review.json";
import backtestV2Fixture from "@/fixtures/mock-api/backtest-v2.json";
import researchRunFixture from "@/fixtures/mock-api/research-run.json";
import pipelineFixture from "@/fixtures/mock-api/pipeline-result.json";
import reportFixture from "@/fixtures/mock-api/report.json";
import strategyFixture from "@/fixtures/demo/strategy-comparison.json";
import signalFixture from "@/fixtures/mock-api/signal-evaluation.json";
import {
  adaptResearchRunToResearchCard,
  adaptReportToSections,
  adaptPipelineToPlannerTrace,
  adaptPortfolioReview,
  adaptBacktestV2Summary,
  adaptStrategyComparisonToTable,
  adaptSignalEvaluationToExplorer,
} from "@/lib/api/adapters";

describe("live backend artifact adapters", () => {
  const apiMeta = {
    source: "api" as const,
    provider: "api" as const,
    synthetic: false,
    fallbackUsed: false,
    notFinancialAdvice: true as const,
    noTradingExecution: true as const,
  };

  test("portfolio review adapts with safe metadata", () => {
    const adapted = adaptPortfolioReview(portfolioReviewFixture, apiMeta);
    expect(adapted.metadata.source).toBe("api");
    expect(adapted.metadata.notFinancialAdvice).toBe(true);
    expect(adapted.metadata.noTradingExecution).toBe(true);
  });

  test("backtest v2 adapts with safe metadata", () => {
    const adapted = adaptBacktestV2Summary(backtestV2Fixture, apiMeta);
    expect(adapted.metadata.source).toBe("api");
    expect(adapted.metadata.notFinancialAdvice).toBe(true);
    expect(adapted.metadata.noTradingExecution).toBe(true);
  });

  test("core adapters still parse live-shaped payloads", () => {
    const card = adaptResearchRunToResearchCard(researchRunFixture, apiMeta);
    const sections = adaptReportToSections(reportFixture);
    const trace = adaptPipelineToPlannerTrace(pipelineFixture, apiMeta);
    const strategy = adaptStrategyComparisonToTable(strategyFixture, apiMeta);
    const signals = adaptSignalEvaluationToExplorer(signalFixture, apiMeta);

    expect(card.metadata.source).toBe("api");
    expect(sections.length).toBeGreaterThan(0);
    expect(trace.metadata.source).toBe("api");
    expect(strategy.metadata.source).toBe("api");
    expect(signals.metadata.source).toBe("api");
  });
});
