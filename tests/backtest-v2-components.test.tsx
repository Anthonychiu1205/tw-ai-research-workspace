import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import backtestSummaryDemo from "@/fixtures/demo/backtest-v2-summary.json";
import { BacktestV2SummaryView } from "@/components/backtesting/backtest-v2-summary";

describe("backtest v2 components", () => {
  test("renders metrics", () => {
    render(<BacktestV2SummaryView summary={backtestSummaryDemo as any} />);
    expect(screen.getByText(/total return/i)).toBeInTheDocument();
  });

  test("renders benchmark", () => {
    render(<BacktestV2SummaryView summary={backtestSummaryDemo as any} />);
    expect(screen.getByTestId("benchmark-metrics-panel")).toBeInTheDocument();
  });

  test("renders assumptions", () => {
    render(<BacktestV2SummaryView summary={backtestSummaryDemo as any} />);
    expect(screen.getByText(/assumptions/i)).toBeInTheDocument();
  });

  test("no financial advice wording", () => {
    render(<BacktestV2SummaryView summary={backtestSummaryDemo as any} />);
    expect(screen.queryByText(/buy recommendation|sell recommendation|guaranteed returns/i)).not.toBeInTheDocument();
  });
});
