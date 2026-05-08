import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { getWorkspaceCommands } from "@/lib/commands/command-registry";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";

describe("i18n operations/commands/artifacts", () => {
  test("operation labels switch locale", () => {
    const store = createArtifactStore();
    render(
      <I18nProvider>
        <ResearchOperationPanel artifactStore={store} />
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "執行研究" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "產生研究報告" })).toBeInTheDocument();
  });

  test("command labels switch locale", () => {
    const zh = getWorkspaceCommands({ canUseApiMode: false, locale: "zh-TW" });
    const en = getWorkspaceCommands({ canUseApiMode: false, locale: "en-US" });
    expect(zh.some((cmd) => cmd.label === "分析 2330")).toBe(true);
    expect(en.some((cmd) => cmd.label === "Analyze 2330")).toBe(true);
  });

  test("artifact labels switch locale", () => {
    const store = createArtifactStore();
    const artifact = store.create({
      type: "research_card",
      title: "2330",
      source: "mock",
      synthetic: true,
      summary: "synthetic",
    });

    render(
      <I18nProvider>
        <ArtifactBrowser artifacts={[artifact]} selectedArtifactId={null} />
      </I18nProvider>,
    );

    expect(screen.getAllByText("研究卡片").length).toBeGreaterThan(0);
  });

  test("no trading command exists", () => {
    const commands = getWorkspaceCommands({ canUseApiMode: true, locale: "en-US" });
    const blob = commands.map((cmd) => `${cmd.label} ${cmd.description}`).join(" ").toLowerCase();
    expect(blob.includes("trade")).toBe(false);
    expect(blob.includes("order")).toBe(false);
    expect(blob.includes("broker")).toBe(false);
  });
});
