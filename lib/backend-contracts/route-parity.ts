export const requiredBackendRoutes = [
  "/health",
  "/v1/research-runs",
  "/v1/reports/research",
  "/v1/research-pipelines",
  "/v1/backtests",
  "/v1/strategies/compare",
  "/v1/evaluations/signals",
  "/v1/system/storage",
  "/v1/system/provider",
] as const;

export function extractRoutesFromOpenApi(openapi: unknown): string[] {
  if (!openapi || typeof openapi !== "object") return [];
  const paths = (openapi as { paths?: Record<string, unknown> }).paths;
  if (!paths || typeof paths !== "object") return [];
  return Object.keys(paths).sort();
}

export function extractRoutesFromRouteArtifact(routeArtifact: unknown): string[] {
  if (!routeArtifact) return [];

  if (Array.isArray(routeArtifact)) {
    return routeArtifact
      .map((item) => {
        if (!item || typeof item !== "object") return "";
        const path = (item as { path?: unknown }).path;
        return typeof path === "string" ? path : "";
      })
      .filter(Boolean)
      .sort();
  }

  if (typeof routeArtifact === "object") {
    const candidate = (routeArtifact as { routes?: unknown }).routes;
    if (Array.isArray(candidate)) {
      return extractRoutesFromRouteArtifact(candidate);
    }
  }

  return [];
}

export function checkRequiredRoutes(routes: string[]) {
  const unique = Array.from(new Set(routes));
  const missing = requiredBackendRoutes.filter((route) => !unique.includes(route));
  return {
    passed: missing.length === 0,
    missing,
    matched: requiredBackendRoutes.filter((route) => unique.includes(route)),
  };
}
