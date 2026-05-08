import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { WelcomePanel } from "@/components/onboarding/welcome-panel";
import { DemoJourney } from "@/components/onboarding/demo-journey";
import { QuickstartChecklist } from "@/components/onboarding/quickstart-checklist";
import { I18nProvider } from "@/lib/i18n/i18n-context";

function renderWithI18n(node: React.ReactNode) {
  return render(<I18nProvider>{node}</I18nProvider>);
}

describe("onboarding", () => {
  test("welcome panel renders", () => {
    renderWithI18n(
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
    renderWithI18n(
      <WelcomePanel
        onStart2330={() => {}}
        onCompareWatchlist={() => {}}
        onOpenTrace={() => {}}
        onConnectBackend={() => {}}
      />,
    );
    expect(screen.getByText(/非投資建議|not financial advice/i)).toBeInTheDocument();
  });

  test("demo journey steps render", () => {
    renderWithI18n(<DemoJourney />);
    expect(screen.getByText(/2330/i)).toBeInTheDocument();
    expect(screen.getByText(/share bundle|匯出/i)).toBeInTheDocument();
  });

  test("quickstart checklist renders", () => {
    renderWithI18n(<QuickstartChecklist />);
    expect(screen.getByText(/Mock|mock/i)).toBeInTheDocument();
  });
});
