import fs from "node:fs";
import path from "node:path";
import { createId } from "@/lib/utils/ids";
import type { WorkspaceSession } from "@/lib/schemas/workspace";

export type ScenarioTranscript = {
  transcriptId: string;
  title: string;
  userPrompt: string;
  events: Array<{ type: string; payload: Record<string, unknown> }>;
  expectedArtifacts: string[];
  metadata: {
    provider: "mock";
    synthetic: true;
    notFinancialAdvice: true;
    noTradingExecution: true;
  };
};

const transcriptDir = path.resolve(process.cwd(), "fixtures/transcripts");

export function loadScenarioTranscript(id: string): ScenarioTranscript | null {
  const fullPath = path.join(transcriptDir, `${id}.json`);
  if (!fs.existsSync(fullPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as ScenarioTranscript;
  } catch {
    return null;
  }
}

export function validateScenarioTranscript(transcript: unknown) {
  if (!transcript || typeof transcript !== "object") {
    return { ok: false as const, error: "Transcript must be object" };
  }

  const value = transcript as Partial<ScenarioTranscript>;
  if (!value.transcriptId || !value.title || !value.userPrompt) {
    return { ok: false as const, error: "Missing transcript identity fields" };
  }

  if (!Array.isArray(value.events) || value.events.length === 0) {
    return { ok: false as const, error: "Transcript events must be non-empty array" };
  }

  if (!Array.isArray(value.expectedArtifacts) || value.expectedArtifacts.length === 0) {
    return { ok: false as const, error: "expectedArtifacts must be non-empty array" };
  }

  const metadata = value.metadata;
  if (!metadata || metadata.provider !== "mock" || metadata.synthetic !== true || metadata.notFinancialAdvice !== true || metadata.noTradingExecution !== true) {
    return { ok: false as const, error: "Transcript metadata is invalid" };
  }

  return { ok: true as const, value: value as ScenarioTranscript };
}

export function transcriptToSession(transcript: ScenarioTranscript): WorkspaceSession {
  return {
    id: createId("session"),
    title: `Transcript ${transcript.title}`,
    schemaVersion: "workspace-session.v0.2",
    runtimeMode: "mock",
    modelId: "mock-research",
    provider: "mock",
    messages: [
      {
        id: createId("msg"),
        role: "user",
        content: transcript.userPrompt,
        createdAt: new Date().toISOString(),
      },
      {
        id: createId("msg"),
        role: "assistant",
        content: transcript.events
          .map((event) => `${event.type}: ${JSON.stringify(event.payload)}`)
          .join("\n"),
        createdAt: new Date().toISOString(),
      },
    ],
    artifacts: [],
    updatedAt: new Date().toISOString(),
  };
}
