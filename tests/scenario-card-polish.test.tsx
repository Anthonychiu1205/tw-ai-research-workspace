import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { ScenarioCard } from "@/components/scenarios/scenario-card";
import { getScenarioById } from "@/lib/scenarios/scenario-registry";

describe("scenario card polish", () => {
  test("renders expected output and mock-safe label", () => {
    const scenario = getScenarioById("analyze_2330");
    if (!scenario) throw new Error("missing scenario");

    render(
      <I18nProvider>
        <ScenarioCard scenario={scenario} onRun={() => {}} />
      </I18nProvider>,
    );

    expect(screen.getByText(/預期輸出|Expected output/i)).toBeInTheDocument();
    expect(screen.getByText(/mock-safe|mock 安全模式/i)).toBeInTheDocument();
  });
});
