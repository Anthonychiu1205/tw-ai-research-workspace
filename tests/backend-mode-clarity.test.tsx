import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";

describe("backend mode clarity", () => {
  test("shows backend state and base url", () => {
    render(
      <I18nProvider>
        <BackendConnectionCard
          state={{
            mode: "api",
            apiBaseUrl: "http://127.0.0.1:8000",
            reachable: false,
            fallbackActive: true,
            fallbackReason: "backend unreachable",
          }}
        />
      </I18nProvider>,
    );

    expect(screen.getByTestId("backend-connection-card")).toBeInTheDocument();
    expect(screen.getByText(/127.0.0.1:8000/i)).toBeInTheDocument();
    expect(screen.getAllByText(/fallback|備援/i).length).toBeGreaterThan(0);
  });
});
