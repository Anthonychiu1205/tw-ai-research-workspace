import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { loadScenarioTranscript, transcriptToSession, validateScenarioTranscript } from "@/lib/scenarios/transcripts";

const transcriptIds = [
  "analyze-2330",
  "generate-report-2330",
  "strategy-watchlist",
  "pipeline-trace-2330",
  "signal-evaluation-watchlist",
];

describe("scenario transcripts", () => {
  test("all transcripts validate", () => {
    for (const id of transcriptIds) {
      const transcript = loadScenarioTranscript(id);
      expect(transcript).toBeTruthy();
      const valid = validateScenarioTranscript(transcript);
      expect(valid.ok).toBe(true);
    }
  });

  test("transcript to session works", () => {
    const transcript = loadScenarioTranscript("analyze-2330");
    const valid = validateScenarioTranscript(transcript);
    if (!valid.ok) throw new Error(valid.error);
    const session = transcriptToSession(valid.value);
    expect(session.schemaVersion).toBe("workspace-session.v0.2");
    expect(session.messages.length).toBeGreaterThan(0);
  });

  test("no unsafe wording", () => {
    for (const id of transcriptIds) {
      const raw = fs.readFileSync(path.resolve(process.cwd(), `fixtures/transcripts/${id}.json`), "utf-8").toLowerCase();
      expect(raw).not.toContain("guaranteed returns");
      expect(raw).not.toContain("place order");
    }
  });

  test("expected artifacts present", () => {
    for (const id of transcriptIds) {
      const transcript = loadScenarioTranscript(id);
      const valid = validateScenarioTranscript(transcript);
      expect(valid.ok).toBe(true);
      if (valid.ok) {
        expect(valid.value.expectedArtifacts.length).toBeGreaterThan(0);
      }
    }
  });

  test("transcript metadata safety flags present", () => {
    const transcript = loadScenarioTranscript("generate-report-2330");
    const valid = validateScenarioTranscript(transcript);
    expect(valid.ok).toBe(true);
    if (valid.ok) {
      expect(valid.value.metadata.notFinancialAdvice).toBe(true);
      expect(valid.value.metadata.noTradingExecution).toBe(true);
    }
  });

  test("events include final event", () => {
    for (const id of transcriptIds) {
      const transcript = loadScenarioTranscript(id);
      const valid = validateScenarioTranscript(transcript);
      expect(valid.ok).toBe(true);
      if (valid.ok) {
        expect(valid.value.events.some((event) => event.type === "final")).toBe(true);
      }
    }
  });
});
