import { getEnvConfig } from "@/lib/config/env";
import { WorkspaceApiError, serializeWorkspaceApiError, toWorkspaceApiError } from "@/lib/api/errors";

export type BackendProxyRequest = {
  path: string;
  method: "GET" | "POST";
  body?: unknown;
  query?: URLSearchParams;
  timeoutMs?: number;
};

export type BackendProxySuccess<T> = {
  ok: true;
  status: number;
  data: T;
  meta: {
    source: "api_proxy";
    baseUrl: string;
    path: string;
  };
};

export type BackendProxyFailure = {
  ok: false;
  status: number;
  error: ReturnType<typeof serializeWorkspaceApiError>;
  meta: {
    source: "api_proxy";
    baseUrl: string;
    path: string;
  };
};

export type BackendProxyResult<T> = BackendProxySuccess<T> | BackendProxyFailure;

export function getBackendProxyBaseUrl() {
  return getEnvConfig().apiBaseUrl;
}

function buildUrl(baseUrl: string, path: string, query?: URLSearchParams) {
  const url = new URL(path, baseUrl);
  if (query) {
    query.forEach((value, key) => url.searchParams.set(key, value));
  }
  return url.toString();
}

export async function runBackendProxy<T>(request: BackendProxyRequest): Promise<BackendProxyResult<T>> {
  const baseUrl = getBackendProxyBaseUrl();
  const timeoutMs = request.timeoutMs ?? 7000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const meta = {
    source: "api_proxy" as const,
    baseUrl,
    path: request.path,
  };

  try {
    const res = await fetch(buildUrl(baseUrl, request.path, request.query), {
      method: request.method,
      headers: {
        "content-type": "application/json",
      },
      body: request.method === "POST" ? JSON.stringify(request.body ?? {}) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const message = `Backend ${request.path} failed with ${res.status}`;
      const error = new WorkspaceApiError(message, "HTTP_ERROR", {
        status: res.status,
        retriable: res.status >= 500,
      });
      return {
        ok: false,
        status: res.status,
        error: serializeWorkspaceApiError(error),
        meta,
      };
    }

    try {
      const data = (await res.json()) as T;
      return {
        ok: true,
        status: res.status,
        data,
        meta,
      };
    } catch {
      const error = new WorkspaceApiError("Backend returned invalid JSON", "INVALID_RESPONSE");
      return {
        ok: false,
        status: 502,
        error: serializeWorkspaceApiError(error),
        meta,
      };
    }
  } catch (error) {
    const typed = toWorkspaceApiError(error);
    return {
      ok: false,
      status: typed.code === "TIMEOUT" ? 504 : 502,
      error: serializeWorkspaceApiError(typed),
      meta,
    };
  } finally {
    clearTimeout(timeout);
  }
}
