import researchRunFixture from "@/fixtures/mock-api/research-run.json";
import reportFixture from "@/fixtures/mock-api/report.json";
import pipelineFixture from "@/fixtures/mock-api/pipeline-result.json";
import signalEvaluationFixture from "@/fixtures/mock-api/signal-evaluation.json";
import strategyFixture from "@/fixtures/demo/strategy-comparison.json";
import type { HarnessMockMeta } from "@/lib/testing/backend-harness-types";

export const harnessMeta: HarnessMockMeta = {
  provider: "mock",
  dataType: "synthetic_mock",
  notFinancialAdvice: true,
  noTradingExecution: true,
};

export function withHarnessMeta<T extends Record<string, unknown>>(payload: T) {
  return {
    ...payload,
    metadata: {
      ...(payload.metadata as Record<string, unknown> | undefined),
      ...harnessMeta,
    },
  };
}

export const mockBackendResponses = {
  health: {
    status: "ok",
    appTitle: "TW AI Research Mock Backend Harness",
    metadata: harnessMeta,
  },
  researchRun: withHarnessMeta(researchRunFixture as Record<string, unknown>),
  report: withHarnessMeta(reportFixture as Record<string, unknown>),
  pipeline: withHarnessMeta(pipelineFixture as Record<string, unknown>),
  backtest: {
    metadata: harnessMeta,
    status: "mock_backtest_preview",
    summary: "Synthetic backtest preview from harness",
  },
  strategies: withHarnessMeta(strategyFixture as Record<string, unknown>),
  signals: withHarnessMeta(signalEvaluationFixture as Record<string, unknown>),
  systemStorage: {
    status: "ok",
    storage: {
      provider: "local",
      mode: "mock",
      writable: true,
    },
    metadata: harnessMeta,
  },
  systemProvider: {
    status: "ok",
    provider: {
      name: "mock-harness",
      model: "mock-research",
    },
    metadata: harnessMeta,
  },
  conformance: {
    status: "ok",
    checks: [
      {
        id: "mock_conformance",
        passed: true,
        detail: "Synthetic harness conformance check",
      },
    ],
    metadata: harnessMeta,
  },
};
