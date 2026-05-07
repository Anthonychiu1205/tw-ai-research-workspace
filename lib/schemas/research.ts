import { z } from "zod";
import { mockMetaSchema } from "@/lib/schemas/common";

export const agentSignalSchema = z.object({
  agent: z.string(),
  direction: z.enum(["positive", "neutral", "negative"]),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export const researchCardSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  summary: z.string(),
  score: z.number(),
  updatedAt: z.string(),
  metadata: mockMetaSchema,
});

export const signalMatrixSchema = z.object({
  id: z.string(),
  watchlist: z.array(z.string()),
  signals: z.array(agentSignalSchema),
  metadata: mockMetaSchema,
});

export const agentConsensusPanelSchema = z.object({
  id: z.string(),
  consensus: z.enum(["bullish", "balanced", "bearish"]),
  confidence: z.number().min(0).max(1),
  highlights: z.array(z.string()),
  metadata: mockMetaSchema,
});

export const researchRunSchema = z.object({
  runId: z.string(),
  symbol: z.string(),
  status: z.enum(["queued", "running", "completed", "failed"]),
  findings: z.array(z.string()),
  score: z.number(),
  generatedAt: z.string(),
  metadata: mockMetaSchema,
});

export const researchResultSchema = z.object({
  card: researchCardSchema,
  matrix: signalMatrixSchema,
  consensus: agentConsensusPanelSchema,
});

export type AgentSignal = z.infer<typeof agentSignalSchema>;
export type ResearchCard = z.infer<typeof researchCardSchema>;
export type SignalMatrix = z.infer<typeof signalMatrixSchema>;
export type AgentConsensusPanel = z.infer<typeof agentConsensusPanelSchema>;
export type ResearchRun = z.infer<typeof researchRunSchema>;
export type ResearchResult = z.infer<typeof researchResultSchema>;
