import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, beforeEach } from "vitest";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { getWorkspaceCommands } from "@/lib/commands/command-registry";

function submitByLabel(pattern: RegExp) {
  const input = screen.getByLabelText(pattern);
  const form = input.closest("form");
  if (!form) throw new Error("missing form");
  const button = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (!button) throw new Error("missing submit");
  fireEvent.click(button);
}

describe("portfolio operations", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_WORKSPACE_MODE = "mock";
  });

  test("operation creates portfolio artifact", async () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);

    submitByLabel(/run portfolio review|執行投組檢視/i);

    await waitFor(() => {
      expect(artifactStore.listAll().some((item) => item.type === "portfolio_review")).toBe(true);
    });
  });

  test("backtest v2 operation creates artifact", async () => {
    const artifactStore = createArtifactStore([]);
    render(<ResearchOperationPanel artifactStore={artifactStore} />);

    submitByLabel(/run backtest v2|執行回測 v2/i);

    await waitFor(() => {
      expect(artifactStore.listAll().some((item) => item.type === "backtest_v2_summary")).toBe(true);
    });
  });

  test("command exists", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true, locale: "en-US" });
    expect(commands.some((item) => item.label === "Review portfolio for watchlist")).toBe(true);
  });

  test("no trading command", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true, locale: "en-US" });
    expect(commands.some((item) => /trade|order|broker/i.test(item.label))).toBe(false);
  });
});
