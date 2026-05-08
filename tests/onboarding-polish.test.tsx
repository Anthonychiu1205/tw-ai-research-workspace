import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { WelcomePanel } from "@/components/onboarding/welcome-panel";
import { DemoJourney } from "@/components/onboarding/demo-journey";

function renderWithI18n(node: React.ReactNode) {
  return render(<I18nProvider>{node}</I18nProvider>);
}

describe("onboarding polish", () => {
  test("welcome panel shows product-oriented copy", () => {
    renderWithI18n(
      <WelcomePanel
        onStart2330={() => {}}
        onCompareWatchlist={() => {}}
        onOpenTrace={() => {}}
        onConnectBackend={() => {}}
      />,
    );

    expect(screen.getByText(/可追溯|traceable/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /2330/i })).toBeInTheDocument();
  });

  test("demo journey includes share bundle step", () => {
    renderWithI18n(<DemoJourney />);
    expect(screen.getByText(/share bundle|匯出/i)).toBeInTheDocument();
  });
});
