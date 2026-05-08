import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve(process.cwd(), "artifacts/github-publish-plan.json");

const commands = [
  "git remote add origin <USER_REPO_URL>",
  "git push -u origin main",
  "git tag -a v0.1.0 -m \"v0.1.0\"",
  "git push origin v0.1.0",
];

const report = {
  generatedAt: new Date().toISOString(),
  note: "Plan only. No remote mutation, push, or tag execution was performed.",
  commands,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log("prepare-github-publish: command plan generated (no commands executed)");
for (const command of commands) {
  console.log(`- ${command}`);
}
