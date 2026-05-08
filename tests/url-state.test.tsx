import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import WorkspacePage from "@/app/workspace/page";
import { parseWorkspaceUrlState, serializeWorkspaceUrlState } from "@/lib/utils/url-state";

describe("url state", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok", appTitle: "backend", reachable: true }),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("parse URL state", () => {
    const state = parseWorkspaceUrlState("?ticker=2330&artifact=a1&session=s1&view=report");
    expect(state.ticker).toBe("2330");
    expect(state.artifact).toBe("a1");
    expect(state.session).toBe("s1");
    expect(state.view).toBe("report");
  });

  test("serialize URL state", () => {
    const q = serializeWorkspaceUrlState({ ticker: "2330", view: "chat" });
    expect(q).toContain("ticker=2330");
    expect(q).toContain("view=chat");
  });

  test("invalid view fallback", () => {
    const state = parseWorkspaceUrlState("?view=invalid");
    expect(state.view).toBe("chat");
  });

  test("workspace page handles query params", async () => {
    window.history.replaceState(null, "", "/workspace?ticker=2330&artifact=missing&session=s1&view=trace");
    render(<WorkspacePage /> as any);
    await waitFor(() => {
      expect(screen.getByTestId("workspace-page-grid")).toBeInTheDocument();
    });
  });
});
