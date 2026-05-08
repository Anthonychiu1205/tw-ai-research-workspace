import { execSync } from "node:child_process";
execSync("npx tsx scripts/internal/run-backend-harness.ts", { stdio: "inherit" });
