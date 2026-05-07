import researchRunFixture from "@/fixtures/mock-api/research-run.json";
import reportFixture from "@/fixtures/mock-api/report.json";
import pipelineFixture from "@/fixtures/mock-api/pipeline-result.json";
import signalEvalFixture from "@/fixtures/mock-api/signal-evaluation.json";
import strategyComparisonFixture from "@/fixtures/demo/strategy-comparison.json";
import timelineFixture from "@/fixtures/demo/evidence-timeline-2330.json";
import signalMatrixFixture from "@/fixtures/demo/signal-matrix-watchlist.json";
import { getEnvConfig } from "@/lib/config/env";
import { toWorkspaceApiError, WorkspaceApiError } from "@/lib/api/errors";

type SafeResult<T> = {
  ok: true;
  data: T;
  warning?: string;
} | {
  ok: false;
  error: WorkspaceApiError;
  fallbackData?: T;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const env = getEnvConfig();
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new WorkspaceApiError(`API ${path} failed with ${res.status}`, "NETWORK");
  }

  return (await res.json()) as T;
}

function isMockMode() {
  return getEnvConfig().workspaceMode === "mock";
}

async function withFallback<T>(apiCall: () => Promise<T>, fallbackData: T): Promise<SafeResult<T>> {
  if (isMockMode()) {
    return { ok: true, data: fallbackData };
  }

  try {
    const data = await apiCall();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: toWorkspaceApiError(error),
      fallbackData,
    };
  }
}

export async function getHealth() {
  return withFallback(
    async () => fetchJson<{ status: string; provider: string }>("/health"),
    { status: "mock-ok", provider: "mock" },
  );
}

export async function runResearch(request: Record<string, unknown>) {
  return withFallback(
    async () => fetchJson("/research/run", { method: "POST", body: JSON.stringify(request) }),
    researchRunFixture,
  );
}

export async function getResearchRun(runId: string) {
  return withFallback(
    async () => fetchJson(`/research/run/${runId}`),
    researchRunFixture,
  );
}

export async function generateReport(request: Record<string, unknown>) {
  return withFallback(
    async () => fetchJson("/reports/generate", { method: "POST", body: JSON.stringify(request) }),
    reportFixture,
  );
}

export async function runPipeline(request: Record<string, unknown>) {
  return withFallback(
    async () => fetchJson("/pipeline/run", { method: "POST", body: JSON.stringify(request) }),
    pipelineFixture,
  );
}

export async function getPipeline(pipelineId: string) {
  return withFallback(
    async () => fetchJson(`/pipeline/${pipelineId}`),
    {
      ...pipelineFixture,
      pipelineId,
    },
  );
}

export async function runBacktest(request: Record<string, unknown>) {
  return withFallback(
    async () => fetchJson("/backtesting/run", { method: "POST", body: JSON.stringify(request) }),
    {
      metadata: researchRunFixture.metadata,
      status: "mock-disabled",
      note: "Backtest execution is backend-owned. Workspace returns mock-only preview.",
    },
  );
}

export async function compareStrategies(request: Record<string, unknown>) {
  return withFallback(
    async () => fetchJson("/strategies/compare", { method: "POST", body: JSON.stringify(request) }),
    strategyComparisonFixture,
  );
}

export async function evaluateSignals(request: Record<string, unknown>) {
  return withFallback(
    async () => fetchJson("/signals/evaluate", { method: "POST", body: JSON.stringify(request) }),
    signalEvalFixture,
  );
}

export async function getProviderConformance() {
  return withFallback(
    async () => fetchJson("/providers/conformance"),
    {
      metadata: researchRunFixture.metadata,
      providers: [
        { name: "mock", status: "available" },
        { name: "openai", status: "env-gated" },
        { name: "anthropic", status: "env-gated" },
      ],
    },
  );
}

export async function getSystemStatus() {
  return withFallback(
    async () => fetchJson("/system/status"),
    {
      metadata: researchRunFixture.metadata,
      backend: "optional",
      tooling: "workspace-local",
      timeline: timelineFixture,
      signalMatrix: signalMatrixFixture,
    },
  );
}
