import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import portfolioReviewDemo from "@/fixtures/demo/portfolio-review-2330-watchlist.json";
import { PortfolioReviewPanel } from "@/components/portfolio/portfolio-review-panel";

describe("portfolio components", () => {
  test("renders target weights", () => {
    render(<PortfolioReviewPanel review={portfolioReviewDemo as any} />);
    expect(screen.getByTestId("position-targets-table")).toBeInTheDocument();
  });

  test("renders risk flags", () => {
    render(<PortfolioReviewPanel review={portfolioReviewDemo as any} />);
    expect(screen.getByTestId("portfolio-risk-summary")).toBeInTheDocument();
  });

  test("non-execution disclaimer wording", () => {
    render(<PortfolioReviewPanel review={portfolioReviewDemo as any} />);
    expect(screen.getByText(/does not place orders or execute trades/i)).toBeInTheDocument();
    expect(screen.queryByText(/buy recommendation|sell recommendation|guaranteed returns/i)).not.toBeInTheDocument();
  });

  test("mock metadata visible in fixture", () => {
    expect((portfolioReviewDemo as any).metadata.provider).toBe("mock");
    expect((portfolioReviewDemo as any).metadata.notFinancialAdvice).toBe(true);
  });
});
