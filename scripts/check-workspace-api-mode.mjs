import { execSync } from "node:child_process";

const args = process.argv.slice(2).map((value) => JSON.stringify(value)).join(" ");
execSync(`npx tsx scripts/internal/check-workspace-api-mode.ts ${args}`, { stdio: "inherit" });
