import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import HomePage from "@/app/page";
import { I18nProvider } from "@/lib/i18n/i18n-context";

describe("product entry", () => {
  test("landing renders product description", () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>,
    );
    expect(screen.getByRole("heading", { name: /台股 AI 研究工作區/i })).toBeInTheDocument();
    expect(screen.getAllByText(/對話式|Conversational/i).length).toBeGreaterThan(0);
  });

  test("non-advice statement is visible", () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>,
    );
    expect(screen.getAllByText(/非投資建議|not financial advice/i).length).toBeGreaterThan(0);
  });
});
