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

const files = fs.readdirSync(src).filter((name) => name.endsWith(".json"));
let copied = 0;
let skipped = 0;

for (const file of files) {
  const from = path.join(src, file);
  const to = path.join(dest, file);
  if (fs.existsSync(to) && !force) {
    skipped += 1;
    continue;
  }
  fs.copyFileSync(from, to);
  copied += 1;
}

console.log(`sync-demo-artifacts: copied=${copied}, skipped=${skipped}, force=${force}`);
