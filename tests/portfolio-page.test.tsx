import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import PortfolioPage from "@/app/portfolio/page";

describe("portfolio page", () => {
  test("page renders", () => {
    render(<PortfolioPage />);
    expect(screen.getByTestId("portfolio-page")).toBeInTheDocument();
  });

  test("disclaimer visible", () => {
    render(<PortfolioPage />);
    expect(screen.getByText(/research simulation target view only/i)).toBeInTheDocument();
  });

  test("no trading wording", () => {
    render(<PortfolioPage />);
    expect(screen.queryByText(/buy recommendation|sell recommendation|guaranteed returns/i)).not.toBeInTheDocument();
  });
});
