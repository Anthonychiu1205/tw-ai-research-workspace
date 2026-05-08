import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.resolve(root, "app");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.name === "page.tsx" || entry.name === "route.ts") {
      files.push(full);
    }
  }
  return files;
}

const files = walk(appDir);
const routes = files.map((full) => {
  const rel = path.relative(appDir, full).replace(/\\/g, "/");
  if (rel.endsWith("/page.tsx")) {
    const route = `/${rel.replace(/\/page\.tsx$/, "")}`.replace(/\/+/g, "/");
    return { type: "page", file: rel, route: route === "/" ? "/" : route };
  }
  const route = `/${rel.replace(/\/route\.ts$/, "")}`.replace(/\/+/g, "/");
  return { type: "api", file: rel, route };
});

const out = {
  generatedAt: new Date().toISOString(),
  routes,
};

const outPath = path.resolve(root, "artifacts/routes.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

const docsPath = path.resolve(root, "docs/routes.md");
const lines = ["# Routes", "", `Generated at: ${out.generatedAt}`, "", "## Route Inventory", ""];
for (const route of routes) {
  lines.push(`- [${route.type}] ${route.route} (${route.file})`);
}
fs.writeFileSync(docsPath, `${lines.join("\n")}\n`);

console.log(`export-routes: wrote ${outPath} and ${docsPath}`);
