import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "package.json",
  "app/workspace/page.tsx",
  "lib/config/env.ts",
  ".env.example",
  "fixtures/mock-api/research-run.json",
];

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (Number.isNaN(nodeMajor) || nodeMajor < 18) {
  console.error(`Node ${process.versions.node} is too old. Require >= 18.`);
  process.exit(1);
}

for (const file of requiredFiles) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf-8");
if (!envExample.includes("NEXT_PUBLIC_WORKSPACE_MODE=mock")) {
  console.error(".env.example must default to mock mode");
  process.exit(1);
}

if (!envExample.includes("NEXT_PUBLIC_API_BRIDGE_MODE=mock")) {
  console.error(".env.example must include mock API bridge default");
  process.exit(1);
}

if (envExample.includes("OPENAI_API_KEY=required") || envExample.includes("ANTHROPIC_API_KEY=required")) {
  console.error("API keys must not be required by default");
  process.exit(1);
}

console.log("check-env: OK");
