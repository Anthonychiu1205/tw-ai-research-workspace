import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const dryRun = !force;

const src = path.resolve(process.cwd(), "../tw-ai-investment-research/artifacts/demo");
const dest = path.resolve(process.cwd(), "fixtures/demo");

if (!fs.existsSync(src)) {
  console.log("sync-demo-artifacts: dry-run=true; source repo artifacts/demo not found, keep local fixtures");
  process.exit(0);
}

const srcFiles = fs.readdirSync(src).filter((name) => name.endsWith(".json")).sort();
const report = {
  source: src,
  destination: dest,
  dryRun,
  force,
  available: srcFiles,
  wouldCopy: [],
  copied: [],
  skipped: [],
};

for (const file of srcFiles) {
  const from = path.join(src, file);
  const to = path.join(dest, file);

  if (!force) {
    report.wouldCopy.push(file);
    continue;
  }

  if (fs.existsSync(to)) {
    report.skipped.push(file);
    continue;
  }

  fs.copyFileSync(from, to);
  report.copied.push(file);
}

if (dryRun) {
  console.log(`sync-demo-artifacts: dry-run=true available=${report.available.length} wouldCopy=${report.wouldCopy.length}`);
  if (report.wouldCopy.length > 0) {
    console.log(`sync-demo-artifacts: preview -> ${report.wouldCopy.join(", ")}`);
  }
  console.log("sync-demo-artifacts: pass --force to copy non-existing files (non-destructive)");
} else {
  console.log(`sync-demo-artifacts: dry-run=false copied=${report.copied.length} skipped=${report.skipped.length}`);
}
