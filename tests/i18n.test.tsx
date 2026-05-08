import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { useI18n } from "@/lib/i18n/use-i18n";
import { LanguageSwitcher } from "@/components/app-shell/language-switcher";

function Probe() {
  const { locale, t } = useI18n();
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="title">{t("app.title")}</div>
      <div data-testid="missing">{t("missing.key")}</div>
    </div>
  );
}

describe("i18n", () => {
  test("default locale is zh-TW", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("zh-TW");
    expect(screen.getByTestId("title")).toHaveTextContent("台股 AI 研究工作區");
  });

  test("can switch to en-US and persists locale", () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
        <Probe />
      </I18nProvider>,
    );

    fireEvent.change(screen.getByLabelText(/語言|Language/), {
      target: { value: "en-US" },
    });

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");
    expect(window.localStorage.getItem("tw-ai-research-workspace.locale")).toBe("en-US");
  });

  test("missing key fallback works", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    expect(screen.getByTestId("missing")).toHaveTextContent("missing.key");
  });

  test("LanguageSwitcher renders both options", () => {
    render(
      <I18nProvider>
        <LanguageSwitcher />
      </I18nProvider>,
    );

    expect(screen.getByRole("option", { name: "繁體中文" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument();
  });
});
