import { beforeEach, describe, expect, test } from "vitest";
import { runPortfolioReview, runBacktestV2 } from "@/lib/api/client";
import { adaptPortfolioReview, adaptBacktestV2Summary } from "@/lib/api/adapters";

describe("portfolio api adapters", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "mock";
  });

  test("mock portfolio review", async () => {
    const result = await runPortfolioReview({ tickers: ["2330", "2317"] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.meta.source).toBe("mock");
    const parsed = adaptPortfolioReview(result.data, result.meta);
    expect(parsed.analysisId).toBeTruthy();
    expect(parsed.metadata.notFinancialAdvice).toBe(true);
  });

  test("mock backtest v2", async () => {
    const result = await runBacktestV2({ tickers: ["2330", "2317"] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const parsed = adaptBacktestV2Summary(result.data, result.meta);
    expect(parsed.mode).toBe("portfolio_manager");
    expect(parsed.metadata.noTradingExecution).toBe(true);
  });

  test("fallback metadata present", async () => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "api";
    process.env.NEXT_PUBLIC_API_BRIDGE_MODE = "direct";
    process.env.TW_AI_RESEARCH_API_BASE_URL = "http://127.0.0.1:65535";
    const result = await runPortfolioReview({ tickers: ["2330"] }, { timeoutMs: 20 });
    if (result.ok) {
      expect(result.meta.source === "api" || result.meta.source === "mock").toBe(true);
    } else {
      expect(result.meta.source).toBe("mock_fallback");
    }
  });
});
