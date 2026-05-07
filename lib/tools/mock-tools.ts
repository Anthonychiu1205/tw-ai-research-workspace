import researchRunFixture from "@/fixtures/mock-api/research-run.json";
import reportFixture from "@/fixtures/mock-api/report.json";
import pipelineFixture from "@/fixtures/mock-api/pipeline-result.json";
import signalEvalFixture from "@/fixtures/mock-api/signal-evaluation.json";
import strategyComparisonFixture from "@/fixtures/demo/strategy-comparison.json";
import timelineFixture from "@/fixtures/demo/evidence-timeline-2330.json";
import signalMatrixFixture from "@/fixtures/demo/signal-matrix-watchlist.json";

export const mockToolData = {
  runResearch: researchRunFixture,
  generateReport: reportFixture,
  runPipeline: pipelineFixture,
  compareStrategies: strategyComparisonFixture,
  evaluateSignals: signalEvalFixture,
  getEvidenceTimeline: timelineFixture,
  getSignalMatrix: signalMatrixFixture,
  getAgentConsensus: {
    id: "consensus-2330",
    consensus: "balanced",
    confidence: 0.62,
    highlights: ["Synthetic consensus", "No execution"],
    metadata: researchRunFixture.metadata,
  },
};
