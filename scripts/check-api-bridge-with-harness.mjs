import { execSync } from "node:child_process";
execSync("npx tsx scripts/internal/check-api-bridge-with-harness.ts", { stdio: "inherit" });
