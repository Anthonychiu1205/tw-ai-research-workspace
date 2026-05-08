import { execSync } from "node:child_process";
const args = process.argv.slice(2).join(" ");
execSync(`npx tsx scripts/internal/check-backend-compatibility.ts ${args}`.trim(), { stdio: "inherit" });
