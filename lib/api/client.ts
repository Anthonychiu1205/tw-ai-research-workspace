import researchRunFixture from "@/fixtures/mock-api/research-run.json";
import reportFixture from "@/fixtures/mock-api/report.json";
import pipelineFixture from "@/fixtures/mock-api/pipeline-result.json";
import signalEvalFixture from "@/fixtures/mock-api/signal-evaluation.json";
import strategyComparisonFixture from "@/fixtures/demo/strategy-comparison.json";
import timelineFixture from "@/fixtures/demo/evidence-timeline-2330.json";
import signalMatrixFixture from "@/fixtures/demo/signal-matrix-watchlist.json";
import { getEnvConfig } from "@/lib/config/env";
import { normalizeRuntimeConfig } from "@/lib/config/runtime";
import type { WorkspaceRuntimeConfig } from "@/lib/schemas/workspace";
import { toWorkspaceApiError, WorkspaceApiError } from "@/lib/api/errors";

export type FrontendSafeMeta = {
  source: "mock" | "api" | "mock_fallback";
  provider: "mock" | "openai" | "anthropic" | "local" | "api";
  synthetic: boolean;
  fallbackUsed: boolean;
  fallbackReason?: string;
  notFinancialAdvice: true;
  noTradingExecution: true;
};

export type BackendHealthResult = {
  reachable: boolean;
  status: string;
  appTitle: string;
  error?: string;
  checkedAt: string;
};

type SafeResult<T> =
  | {
      ok: true;
      data: T;
      meta: FrontendSafeMeta;
      warning?: string;
    }
  | {
      ok: false;
      error: WorkspaceApiError;
      fallbackData?: T;
      meta: FrontendSafeMeta;
    };

type ClientOptions = {
  timeoutMs?: number;
  runtimeOverrides?: Partial<WorkspaceRuntimeConfig>;
};

function nowIso() {
  return new Date().toISOString();
}

function createMeta(input: Partial<FrontendSafeMeta> = {}): FrontendSafeMeta {
  return {
    source: input.source ?? "mock",
    provider: input.provider ?? "mock",
    synthetic: input.synthetic ?? true,
    fallbackUsed: input.fallbackUsed ?? false,
    fallbackReason: input.fallbackReason,
    notFinancialAdvice: true,
    noTradingExecution: true,
  };
}

async function fetchJson<T>(baseUrl: string, path: string, init?: RequestInit, timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) {
      throw new WorkspaceApiError(`API ${path} failed with ${res.status}`, "HTTP_ERROR", {
        status: res.status,
        retriable: res.status >= 500,
      });
    }

    try {
      return (await res.json()) as T;
    } catch {
      throw new WorkspaceApiError(`API ${path} returned invalid JSON`, "INVALID_RESPONSE");
    }
  } catch (error) {
    throw toWorkspaceApiError(error);
  } finally {
    clearTimeout(timeout);
  }
}

function getRuntimeOptions(options?: ClientOptions) {
  const env = getEnvConfig();
  const runtime = normalizeRuntimeConfig({
    mode: env.workspaceMode,
    apiBaseUrl: env.apiBaseUrl,
    selectedProvider: env.aiProvider,
    selectedModel: env.defaultModel,
    fallbackToMock: true,
    ...(options?.runtimeOverrides ?? {}),
  });
  return { runtime, timeoutMs: options?.timeoutMs ?? 5000 };
}

async function withFallback<T>(
  apiCall: (runtime: WorkspaceRuntimeConfig, timeoutMs: number) => Promise<T>,
  fallbackData: T,
  options?: ClientOptions,
): Promise<SafeResult<T>> {
  const { runtime, timeoutMs } = getRuntimeOptions(options);

  if (runtime.mode === "mock") {
    return {
      ok: true,
      data: fallbackData,
      meta: createMeta({ source: "mock", provider: "mock", synthetic: true }),
    };
  }

  try {
    const data = await apiCall(runtime, timeoutMs);
    return {
      ok: true,
      data,
      meta: createMeta({ source: "api", provider: "api", synthetic: false }),
    };
  } catch (error) {
    const typedError = toWorkspaceApiError(error);
    if (runtime.fallbackToMock) {
      return {
        ok: false,
        error: typedError,
        fallbackData,
        meta: createMeta({
          source: "mock_fallback",
          provider: "mock",
          synthetic: true,
          fallbackUsed: true,
          fallbackReason: typedError.message,
        }),
      };
    }

    return {
      ok: false,
      error: typedError,
      meta: createMeta({ source: "api", provider: "api", synthetic: false }),
    };
  }
}

export async function checkBackendHealth(options?: ClientOptions): Promise<BackendHealthResult> {
  const { runtime, timeoutMs } = getRuntimeOptions(options);

  if (runtime.mode === "mock") {
    return {
      reachable: false,
      status: "mock-mode",
      appTitle: "TW AI Research Backend (optional)",
      checkedAt: nowIso(),
    };
  }

  try {
    const data = await fetchJson<{ status?: string; appTitle?: string }>(runtime.apiBaseUrl, "/health", undefined, timeoutMs);
    return {
      reachable: true,
      status: data.status ?? "ok",
      appTitle: data.appTitle ?? "TW AI Research Backend",
      checkedAt: nowIso(),
    };
  } catch (error) {
    const typedError = toWorkspaceApiError(error);
    return {
      reachable: false,
      status: "unreachable",
      appTitle: "TW AI Research Backend",
      error: typedError.message,
      checkedAt: nowIso(),
    };
  }
}

export async function getHealth(options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson<{ status: string; provider: string }>(runtime.apiBaseUrl, "/health", undefined, timeoutMs),
    { status: "mock-ok", provider: "mock" },
    options,
  );
}

export async function runResearch(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson(runtime.apiBaseUrl, "/research/run", { method: "POST", body: JSON.stringify(request) }, timeoutMs),
    researchRunFixture,
    options,
  );
}

export async function getResearchRun(runId: string, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) => fetchJson(runtime.apiBaseUrl, `/research/run/${runId}`, undefined, timeoutMs),
    researchRunFixture,
    options,
  );
}

export async function generateReport(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson(runtime.apiBaseUrl, "/reports/generate", { method: "POST", body: JSON.stringify(request) }, timeoutMs),
    reportFixture,
    options,
  );
}

export async function runPipeline(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson(runtime.apiBaseUrl, "/pipeline/run", { method: "POST", body: JSON.stringify(request) }, timeoutMs),
    pipelineFixture,
    options,
  );
}

export async function getPipeline(pipelineId: string, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) => fetchJson(runtime.apiBaseUrl, `/pipeline/${pipelineId}`, undefined, timeoutMs),
    {
      ...pipelineFixture,
      pipelineId,
    },
    options,
  );
}

export async function runBacktest(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson(runtime.apiBaseUrl, "/backtesting/run", { method: "POST", body: JSON.stringify(request) }, timeoutMs),
    {
      metadata: researchRunFixture.metadata,
      status: "mock-disabled",
      note: "Backtest execution is backend-owned. Workspace returns mock-only preview.",
    },
    options,
  );
}

export async function compareStrategies(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson(runtime.apiBaseUrl, "/strategies/compare", { method: "POST", body: JSON.stringify(request) }, timeoutMs),
    strategyComparisonFixture,
    options,
  );
}

export async function evaluateSignals(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) =>
      fetchJson(runtime.apiBaseUrl, "/signals/evaluate", { method: "POST", body: JSON.stringify(request) }, timeoutMs),
    signalEvalFixture,
    options,
  );
}

export async function getProviderConformance(options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) => fetchJson(runtime.apiBaseUrl, "/providers/conformance", undefined, timeoutMs),
    {
      metadata: researchRunFixture.metadata,
      providers: [
        { name: "mock", status: "available" },
        { name: "openai", status: "env-gated" },
        { name: "anthropic", status: "env-gated" },
      ],
    },
    options,
  );
}

export async function getSystemStatus(options?: ClientOptions) {
  return withFallback(
    async (runtime, timeoutMs) => fetchJson(runtime.apiBaseUrl, "/system/status", undefined, timeoutMs),
    {
      metadata: researchRunFixture.metadata,
      backend: "optional",
      tooling: "workspace-local",
      timeline: timelineFixture,
      signalMatrix: signalMatrixFixture,
    },
    options,
  );
}
