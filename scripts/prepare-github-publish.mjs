import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const outPath = path.resolve(process.cwd(), "artifacts/github-publish-plan.json");
const root = process.cwd();

const currentBranch = execSync("git branch --show-current", { cwd: root, encoding: "utf-8" }).trim();
const latestCommit = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf-8" }).trim();
const latestCommitMessage = execSync("git log -1 --pretty=%s", { cwd: root, encoding: "utf-8" }).trim();
const remoteSnapshot = execSync("git remote -v", { cwd: root, encoding: "utf-8" }).trim();
const tagsSnapshot = execSync("git tag --list", { cwd: root, encoding: "utf-8" }).trim();

const commands = [
  "git remote add origin <USER_REPO_URL>",
  "git push -u origin main",
  "git tag -a v0.1.0 -m \"v0.1.0\"",
  "git push origin v0.1.0",
];

const report = {
  generatedAt: new Date().toISOString(),
  suggestedRepoName: "tw-ai-research-workspace",
  currentBranch,
  latestCommit,
  latestCommitMessage,
  noPushPerformed: true,
  noTagCreated: true,
  noRemoteChanged: true,
  note: "Plan only. No remote mutation, push, or tag execution was performed.",
  remoteSnapshot,
  tagsSnapshot,
  commands,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log("prepare-github-publish: command plan generated (no commands executed)");
for (const command of commands) {
  console.log(`- ${command}`);
}
