export type BackendCapabilityCategory =
  | "research"
  | "reports"
  | "pipelines"
  | "backtests"
  | "strategies"
  | "evaluations"
  | "system";

export type BackendRouteDefinition = {
  id: string;
  label: string;
  category: BackendCapabilityCategory;
  workspaceProxyPath: string;
  backendPath: string;
  method: "GET" | "POST";
};

export const backendRouteDefinitions: BackendRouteDefinition[] = [
  {
    id: "health",
    label: "Backend Health",
    category: "system",
    workspaceProxyPath: "/api/backend/health",
    backendPath: "/health",
    method: "GET",
  },
  {
    id: "research-runs",
    label: "Research Runs",
    category: "research",
    workspaceProxyPath: "/api/backend/research",
    backendPath: "/v1/research-runs",
    method: "POST",
  },
  {
    id: "reports",
    label: "Research Reports",
    category: "reports",
    workspaceProxyPath: "/api/backend/reports",
    backendPath: "/v1/reports/research",
    method: "POST",
  },
  {
    id: "pipelines",
    label: "Research Pipelines",
    category: "pipelines",
    workspaceProxyPath: "/api/backend/pipelines",
    backendPath: "/v1/research-pipelines",
    method: "POST",
  },
  {
    id: "backtests",
    label: "Backtests",
    category: "backtests",
    workspaceProxyPath: "/api/backend/backtests",
    backendPath: "/v1/backtests",
    method: "POST",
  },
  {
    id: "strategies",
    label: "Strategy Comparison",
    category: "strategies",
    workspaceProxyPath: "/api/backend/strategies",
    backendPath: "/v1/strategies/compare",
    method: "POST",
  },
  {
    id: "signals",
    label: "Signal Evaluations",
    category: "evaluations",
    workspaceProxyPath: "/api/backend/signals",
    backendPath: "/v1/evaluations/signals",
    method: "POST",
  },
  {
    id: "system",
    label: "System Status",
    category: "system",
    workspaceProxyPath: "/api/backend/system",
    backendPath: "/v1/system/storage",
    method: "GET",
  },
  {
    id: "conformance",
    label: "Provider Conformance",
    category: "system",
    workspaceProxyPath: "/api/backend/conformance",
    backendPath: "/v1/provider/conformance",
    method: "GET",
  },
];

export const backendRouteMap = Object.fromEntries(
  backendRouteDefinitions.map((item) => [item.id, item]),
) as Record<string, BackendRouteDefinition>;
