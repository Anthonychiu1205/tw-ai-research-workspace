import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BackendLiveModeGuide } from "@/components/workspace/backend-live-mode-guide";

describe("backend live mode guide", () => {
  test("guide renders", () => {
    render(<BackendLiveModeGuide apiBaseUrl="http://localhost:8000" fallbackActive={false} />);
    expect(screen.getByTestId("backend-live-mode-guide")).toBeInTheDocument();
  });

  test("shows API URL", () => {
    render(<BackendLiveModeGuide apiBaseUrl="http://localhost:8000" fallbackActive={false} />);
    expect(screen.getByText(/http:\/\/localhost:8000/i)).toBeInTheDocument();
  });

  test("fallback warning", () => {
    render(<BackendLiveModeGuide apiBaseUrl="http://localhost:8000" fallbackActive />);
    expect(screen.getByText(/Fallback is active/i)).toBeInTheDocument();
  });

  test("no trading/broker claim", () => {
    render(<BackendLiveModeGuide apiBaseUrl="http://localhost:8000" fallbackActive={false} />);
    expect(screen.getByText(/No broker integration. No trading execution./i)).toBeInTheDocument();
  });
});
