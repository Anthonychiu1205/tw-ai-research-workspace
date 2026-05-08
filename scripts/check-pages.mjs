import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredRouteFiles = [
  "app/page.tsx",
  "app/workspace/page.tsx",
  "app/portfolio/page.tsx",
  "app/reports/page.tsx",
  "app/strategies/page.tsx",
  "app/traces/page.tsx",
  "app/api/chat/route.ts",
  "app/api/health/route.ts",
  "app/api/backend/health/route.ts",
  "app/api/backend/portfolio/route.ts",
];

const missing = requiredRouteFiles.filter((file) => !fs.existsSync(path.resolve(root, file)));
if (missing.length > 0) {
  console.error(`check-pages: missing files -> ${missing.join(", ")}`);
  process.exit(1);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(ts|tsx)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const pageFiles = walk(path.resolve(root, "app")).filter((file) => file.endsWith("page.tsx"));
const pageIssues = [];
for (const file of pageFiles) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf-8");
  if (text.includes("TW_AI_RESEARCH_API_BASE_URL")) {
    pageIssues.push(`${rel}: page should not directly read backend env`);
  }
  if (text.includes("OPENAI_API_KEY") || text.includes("ANTHROPIC_API_KEY")) {
    pageIssues.push(`${rel}: page should not reference provider secrets`);
  }
  if (text.includes("fetch(\"http://") || text.includes("fetch('http://")) {
    pageIssues.push(`${rel}: hardcoded external fetch detected`);
  }
}

const apiRouteFiles = walk(path.resolve(root, "app/api")).filter((file) => file.endsWith("route.ts"));
const apiIssues = [];
for (const file of apiRouteFiles) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf-8");
  if (text.includes("OPENAI_API_KEY=") || text.includes("ANTHROPIC_API_KEY=")) {
    apiIssues.push(`${rel}: should not expose raw env assignment`);
  }
}

const nextBuildManifest = path.resolve(root, ".next/build-manifest.json");
const buildPresent = fs.existsSync(nextBuildManifest);

const result = {
  checkedAt: new Date().toISOString(),
  requiredRouteFiles,
  missing,
  buildManifestPresent: buildPresent,
  pageFiles: pageFiles.map((file) => path.relative(root, file).replace(/\\/g, "/")),
  apiRouteFiles: apiRouteFiles.map((file) => path.relative(root, file).replace(/\\/g, "/")),
  pageIssues,
  apiIssues,
};

const outPath = path.resolve(root, "artifacts/check-pages.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));

if (pageIssues.length > 0 || apiIssues.length > 0) {
  console.error(`check-pages: failed pageIssues=${pageIssues.length} apiIssues=${apiIssues.length}`);
  process.exit(1);
}

console.log(`check-pages: OK routes=${requiredRouteFiles.length} buildManifestPresent=${buildPresent}`);
