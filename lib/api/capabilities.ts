import { backendRouteDefinitions, type BackendCapabilityCategory } from "@/lib/api/backend-routes";
import { checkBackendHealth } from "@/lib/api/client";
import type { RuntimeSettings } from "@/lib/schemas/workspace";

export type BackendCapability = {
  id: string;
  label: string;
  available: boolean;
  endpoint: string;
  method: "GET" | "POST";
  category: BackendCapabilityCategory;
  lastCheckedAt?: string;
  error?: string;
};

export type BackendCapabilitiesReport = {
  reachable: boolean;
  baseUrl: string;
  checkedAt: string;
  capabilities: BackendCapability[];
  missing: string[];
  warnings: string[];
  mode: "mock" | "api";
  fallbackActive: boolean;
};

function nowIso() {
  return new Date().toISOString();
}

export async function discoverBackendCapabilities(settings: RuntimeSettings): Promise<BackendCapabilitiesReport> {
  if (settings.mode === "mock") {
    return {
      reachable: false,
      baseUrl: settings.apiBaseUrl,
      checkedAt: nowIso(),
      capabilities: backendRouteDefinitions.map((route) => ({
        id: route.id,
        label: route.label,
        available: true,
        endpoint: route.workspaceProxyPath,
        method: route.method,
        category: route.category,
      })),
      missing: [],
      warnings: ["Mock mode active; capabilities reflect local bridge map."],
      mode: "mock",
      fallbackActive: false,
    };
  }

  const health = await checkBackendHealth({
    runtimeOverrides: {
      mode: "api",
      apiBaseUrl: settings.apiBaseUrl,
      apiBridgeMode: settings.apiBridgeMode,
      fallbackToMock: settings.fallbackToMock,
    },
  });

  const capabilities = backendRouteDefinitions.map((route) => ({
    id: route.id,
    label: route.label,
    available: health.reachable,
    endpoint: route.workspaceProxyPath,
    method: route.method,
    category: route.category,
    lastCheckedAt: health.checkedAt,
    error: health.reachable ? undefined : health.error,
  }));

  return {
    reachable: health.reachable,
    baseUrl: settings.apiBaseUrl,
    checkedAt: health.checkedAt,
    capabilities,
    missing: capabilities.filter((item) => !item.available).map((item) => item.id),
    warnings: health.reachable ? [] : [health.error ?? "Backend unreachable, fallback to mock active."],
    mode: "api",
    fallbackActive: !health.reachable && settings.fallbackToMock,
  };
}
