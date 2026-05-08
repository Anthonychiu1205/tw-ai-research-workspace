import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");

const src = path.resolve(process.cwd(), "../tw-ai-investment-research/artifacts/demo");
const dest = path.resolve(process.cwd(), "fixtures/demo");

if (!fs.existsSync(src)) {
  console.log("sync-demo-artifacts: source repo artifacts/demo not found, keep local fixtures");
  process.exit(0);
}

const srcFiles = fs.readdirSync(src).filter((name) => name.endsWith(".json")).sort();
const report = {
  source: src,
  destination: dest,
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
    if (!fs.existsSync(to)) {
      report.wouldCopy.push(file);
    } else {
      report.skipped.push(file);
    }
    continue;
  }

  fs.copyFileSync(from, to);
  report.copied.push(file);
}

if (!force) {
  console.log(`sync-demo-artifacts: dry-run, wouldCopy=${report.wouldCopy.length}, skipped=${report.skipped.length}`);
  if (report.wouldCopy.length > 0) {
    console.log(`sync-demo-artifacts: use --force to copy -> ${report.wouldCopy.join(", ")}`);
  }
} else {
  console.log(`sync-demo-artifacts: copied=${report.copied.length}, skipped=${report.skipped.length}, force=true`);
}
