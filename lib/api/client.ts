import researchRunFixture from "@/fixtures/mock-api/research-run.json";
import reportFixture from "@/fixtures/mock-api/report.json";
import pipelineFixture from "@/fixtures/mock-api/pipeline-result.json";
import signalEvalFixture from "@/fixtures/mock-api/signal-evaluation.json";
import strategyComparisonFixture from "@/fixtures/demo/strategy-comparison.json";
import timelineFixture from "@/fixtures/demo/evidence-timeline-2330.json";
import signalMatrixFixture from "@/fixtures/demo/signal-matrix-watchlist.json";
import { getEnvConfig } from "@/lib/config/env";
import { normalizeRuntimeConfig } from "@/lib/config/runtime";
import { toWorkspaceApiError, WorkspaceApiError } from "@/lib/api/errors";
import type { WorkspaceRuntimeConfig } from "@/lib/schemas/workspace";

type BridgeMode = "mock" | "proxy" | "direct";

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

function resolveTransport(runtime: WorkspaceRuntimeConfig): BridgeMode {
  if (runtime.mode === "mock") return "mock";
  return runtime.apiBridgeMode;
}

function resolveUrl(path: string, runtime: WorkspaceRuntimeConfig, transport: BridgeMode) {
  if (transport === "proxy") {
    return path;
  }
  return `${runtime.apiBaseUrl}${path}`;
}

async function fetchJson<T>(
  path: string,
  runtime: WorkspaceRuntimeConfig,
  transport: BridgeMode,
  init?: RequestInit,
  timeoutMs = 5000,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(resolveUrl(path, runtime, transport), {
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
  } finally {
    clearTimeout(timeout);
  }
}

function getRuntimeOptions(options?: ClientOptions) {
  const env = getEnvConfig();
  const runtime = normalizeRuntimeConfig({
    mode: env.workspaceMode,
    apiBaseUrl: env.apiBaseUrl,
    apiBridgeMode: env.apiBridgeMode,
    selectedProvider: env.aiProvider,
    selectedModel: env.defaultModel,
    fallbackToMock: true,
    ...(options?.runtimeOverrides ?? {}),
  });
  return { runtime, timeoutMs: options?.timeoutMs ?? 5000 };
}

async function withFallback<T>(
  apiCall: (runtime: WorkspaceRuntimeConfig, transport: BridgeMode, timeoutMs: number) => Promise<T>,
  fallbackData: T,
  options?: ClientOptions,
): Promise<SafeResult<T>> {
  const { runtime, timeoutMs } = getRuntimeOptions(options);
  const transport = resolveTransport(runtime);

  if (transport === "mock") {
    return {
      ok: true,
      data: fallbackData,
      meta: createMeta({ source: "mock", provider: "mock", synthetic: true }),
    };
  }

  try {
    const data = await apiCall(runtime, transport, timeoutMs);
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
  const transport = resolveTransport(runtime);

  if (transport === "mock") {
    return {
      reachable: false,
      status: "mock-mode",
      appTitle: "TW AI Research Backend (optional)",
      checkedAt: nowIso(),
    };
  }

  try {
    const data = await fetchJson<any>(transport === "proxy" ? "/api/backend/health" : "/health", runtime, transport, undefined, timeoutMs);

    if (transport === "proxy") {
      const status = String(data?.status ?? "ok");
      const reachable =
        typeof data?.reachable === "boolean" ? Boolean(data.reachable) : status !== "unreachable";
      return {
        reachable,
        status,
        appTitle: String(data?.appTitle ?? "TW AI Research Backend"),
        error: data?.error ? String(data.error) : undefined,
        checkedAt: nowIso(),
      };
    }

    return {
      reachable: true,
      status: String(data?.status ?? "ok"),
      appTitle: String(data?.appTitle ?? "TW AI Research Backend"),
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
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(transport === "proxy" ? "/api/backend/health" : "/health", runtime, transport, undefined, timeoutMs),
    { status: "mock-ok", provider: "mock" },
    options,
  );
}

export async function runResearch(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/research" : "/v1/research-runs",
        runtime,
        transport,
        { method: "POST", body: JSON.stringify(request) },
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    researchRunFixture,
    options,
  );
}

export async function getResearchRun(runId: string, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/research" : `/v1/research-runs/${runId}`,
        runtime,
        transport,
        transport === "proxy" ? { method: "POST", body: JSON.stringify({ runId }) } : undefined,
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    researchRunFixture,
    options,
  );
}

export async function generateReport(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/reports" : "/v1/reports/research",
        runtime,
        transport,
        { method: "POST", body: JSON.stringify(request) },
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    reportFixture,
    options,
  );
}

export async function runPipeline(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/pipelines" : "/v1/research-pipelines",
        runtime,
        transport,
        { method: "POST", body: JSON.stringify(request) },
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    pipelineFixture,
    options,
  );
}

export async function getPipeline(pipelineId: string, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/pipelines" : `/v1/research-pipelines/${pipelineId}`,
        runtime,
        transport,
        transport === "proxy" ? { method: "POST", body: JSON.stringify({ pipelineId }) } : undefined,
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    {
      ...pipelineFixture,
      pipelineId,
    },
    options,
  );
}

export async function runBacktest(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/backtests" : "/v1/backtests",
        runtime,
        transport,
        { method: "POST", body: JSON.stringify(request) },
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
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
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/strategies" : "/v1/strategies/compare",
        runtime,
        transport,
        { method: "POST", body: JSON.stringify(request) },
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    strategyComparisonFixture,
    options,
  );
}

export async function evaluateSignals(request: Record<string, unknown>, options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/signals" : "/v1/evaluations/signals",
        runtime,
        transport,
        { method: "POST", body: JSON.stringify(request) },
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
    signalEvalFixture,
    options,
  );
}

export async function getProviderConformance(options?: ClientOptions) {
  return withFallback(
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/conformance" : "/v1/provider/conformance",
        runtime,
        transport,
        undefined,
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
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
    async (runtime, transport, timeoutMs) =>
      fetchJson<any>(
        transport === "proxy" ? "/api/backend/system" : "/v1/system/storage",
        runtime,
        transport,
        undefined,
        timeoutMs,
      ).then((res) => (transport === "proxy" ? (res.data ?? res) : res)),
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
