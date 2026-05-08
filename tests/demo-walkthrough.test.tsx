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
    expect(screen.getByText(/2330/i)).toBeInTheDocument();
    expect(screen.getByText(/planner trace|trace/i)).toBeInTheDocument();
    expect(screen.getByText(/share bundle|匯出/i)).toBeInTheDocument();
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
