import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredRouteFiles = [
  "app/page.tsx",
  "app/workspace/page.tsx",
  "app/reports/page.tsx",
  "app/strategies/page.tsx",
  "app/traces/page.tsx",
  "app/api/chat/route.ts",
  "app/api/health/route.ts",
  "app/api/backend/health/route.ts",
];

const missing = requiredRouteFiles.filter((file) => !fs.existsSync(path.resolve(root, file)));
if (missing.length > 0) {
  console.error(`check-pages: missing files -> ${missing.join(", ")}`);
  process.exit(1);
}

const nextBuildManifest = path.resolve(root, ".next/build-manifest.json");
const buildPresent = fs.existsSync(nextBuildManifest);

const result = {
  checkedAt: new Date().toISOString(),
  requiredRouteFiles,
  missing,
  buildManifestPresent: buildPresent,
};

const outPath = path.resolve(root, "artifacts/check-pages.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));

console.log(`check-pages: OK routes=${requiredRouteFiles.length} buildManifestPresent=${buildPresent}`);
