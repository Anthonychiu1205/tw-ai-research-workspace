import fs from "node:fs";
import path from "node:path";

export type OpenApiMeta = {
  source: "file" | "static";
  routes: Array<{ path: string; method: string; summary: string }>;
};

export function loadOpenApiMeta(customPath?: string): OpenApiMeta {
  const filePath = customPath ?? path.join(process.cwd(), "public", "openapi.json");
  if (fs.existsSync(filePath)) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const routes: OpenApiMeta["routes"] = [];
    const paths = raw.paths ?? {};
    for (const [routePath, methods] of Object.entries<any>(paths)) {
      for (const [method, meta] of Object.entries<any>(methods ?? {})) {
        routes.push({
          path: routePath,
          method: method.toUpperCase(),
          summary: meta.summary ?? "No summary",
        });
      }
    }
    return { source: "file", routes };
  }

  return {
    source: "static",
    routes: [
      { path: "/health", method: "GET", summary: "Backend health" },
      { path: "/research/run", method: "POST", summary: "Run research plan" },
      { path: "/reports/generate", method: "POST", summary: "Generate report" },
      { path: "/pipeline/run", method: "POST", summary: "Run pipeline" },
    ],
  };
}
