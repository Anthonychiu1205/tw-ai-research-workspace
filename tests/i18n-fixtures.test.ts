import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = process.cwd();

const fixtures = [
  "fixtures/demo/research-card-2330.json",
  "fixtures/demo/signal-matrix-watchlist.json",
  "fixtures/demo/evidence-timeline-2330.json",
  "fixtures/demo/report-sections-2330.json",
  "fixtures/demo/strategy-comparison.json",
  "fixtures/demo/planner-trace-2330.json",
  "fixtures/demo/session-demo.json",
  "fixtures/mock-api/research-run.json",
  "fixtures/mock-api/report.json",
  "fixtures/mock-api/pipeline-result.json",
  "fixtures/mock-api/signal-evaluation.json",
  "fixtures/transcripts/analyze-2330.json",
  "fixtures/transcripts/generate-report-2330.json",
  "fixtures/transcripts/strategy-watchlist.json",
  "fixtures/transcripts/pipeline-trace-2330.json",
  "fixtures/transcripts/signal-evaluation-watchlist.json",
];

describe("i18n fixtures", () => {
  test("fixtures have mock metadata", () => {
    for (const file of fixtures) {
      const json = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), "utf-8"));
      const metadata = json.metadata;
      expect(metadata.provider).toBe("mock");
      expect(metadata.notFinancialAdvice).toBe(true);
      expect(metadata.noTradingExecution).toBe(true);
      if ("dataType" in metadata) {
        expect(metadata.dataType).toBe("synthetic_mock");
      }
    }
  });

  test("key fixtures have zh/en titles or summaries", () => {
    const keyFiles = fixtures.filter((file) => !file.includes("session-demo"));
    for (const file of keyFiles) {
      const json = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), "utf-8"));
      const hasBilingual =
        (typeof json.titleZh === "string" && typeof json.titleEn === "string") ||
        (typeof json.summaryZh === "string" && typeof json.summaryEn === "string");
      expect(hasBilingual).toBe(true);
    }
  });

  test("no unsafe investment wording", () => {
    const text = fixtures.map((file) => fs.readFileSync(path.resolve(ROOT, file), "utf-8").toLowerCase()).join("\n");
    const sellPositive = /(^|[^a-z])(sell recommendation)([^a-z]|$)/i.test(text) && !/no\s+sell recommendation|does not issue buy\/sell recommendation/.test(text);
    expect(text.includes("guaranteed returns")).toBe(false);
    expect(text.includes("buy recommendation")).toBe(false);
    expect(sellPositive).toBe(false);
  });
});
