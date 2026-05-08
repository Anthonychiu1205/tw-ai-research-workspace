import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { DemoWalkthroughPanel } from "@/components/workspace/demo-walkthrough-panel";

describe("demo walkthrough panel", () => {
  test("panel renders", () => {
    render(
      <I18nProvider>
        <DemoWalkthroughPanel />
      </I18nProvider>,
    );
    expect(screen.getByTestId("demo-walkthrough-panel")).toBeInTheDocument();
  });

  test("all checklist steps visible", () => {
    render(
      <I18nProvider>
        <DemoWalkthroughPanel />
      </I18nProvider>,
    );
    expect(screen.getByText("Open workspace")).toBeInTheDocument();
    expect(screen.getByText("Run Analyze 2330 scenario")).toBeInTheDocument();
    expect(screen.getByText("Run portfolio review")).toBeInTheDocument();
    expect(screen.getByText("Run backtest v2")).toBeInTheDocument();
    expect(screen.getByText("Export share bundle")).toBeInTheDocument();
  });

  test("non-advice disclaimer visible", () => {
    render(
      <I18nProvider>
        <DemoWalkthroughPanel />
      </I18nProvider>,
    );
    expect(screen.getByText(/非投資建議|not financial advice/i)).toBeInTheDocument();
  });

  test("no trading or broker action wording", () => {
    render(
      <I18nProvider>
        <DemoWalkthroughPanel />
      </I18nProvider>,
    );
    expect(screen.queryByText(/place order|execute trade|buy recommendation|sell recommendation/i)).not.toBeInTheDocument();
  });
});
