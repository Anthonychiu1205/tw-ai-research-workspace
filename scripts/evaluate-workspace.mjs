import { execSync } from "node:child_process";
execSync("npx tsx scripts/internal/evaluate-workspace.ts", { stdio: "inherit" });
