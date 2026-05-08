import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { WelcomePanel } from "@/components/onboarding/welcome-panel";
import { DemoJourney } from "@/components/onboarding/demo-journey";
import { QuickstartChecklist } from "@/components/onboarding/quickstart-checklist";

describe("onboarding", () => {
  test("welcome panel renders", () => {
    render(
      <WelcomePanel
        onStart2330={() => {}}
        onCompareWatchlist={() => {}}
        onOpenTrace={() => {}}
        onConnectBackend={() => {}}
      />,
    );
    expect(screen.getByTestId("welcome-panel")).toBeInTheDocument();
  });

  test("no financial advice text visible", () => {
    render(
      <WelcomePanel
        onStart2330={() => {}}
        onCompareWatchlist={() => {}}
        onOpenTrace={() => {}}
        onConnectBackend={() => {}}
      />,
    );
    expect(screen.getByText(/not financial advice/i)).toBeInTheDocument();
  });

  test("demo journey steps render", () => {
    render(<DemoJourney />);
    expect(screen.getByText(/Ask chat to analyze 2330/i)).toBeInTheDocument();
    expect(screen.getByText(/Export workspace share bundle/i)).toBeInTheDocument();
  });

  test("quickstart checklist renders", () => {
    render(<QuickstartChecklist />);
    expect(screen.getByText(/Mock mode is ready by default/i)).toBeInTheDocument();
  });
});
