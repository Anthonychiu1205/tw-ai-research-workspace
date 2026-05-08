import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/secret-scan.json");
const patterns = [
  { id: "openai_key", regex: /OPENAI_API_KEY\s*=\s*sk-[A-Za-z0-9_-]+/g },
  { id: "anthropic_key", regex: /ANTHROPIC_API_KEY\s*=\s*[A-Za-z0-9_-]{20,}/g },
  { id: "sk_token", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { id: "ghp_token", regex: /\bghp_[A-Za-z0-9]{20,}\b/g },
  { id: "slack_token", regex: /\bxoxb-[A-Za-z0-9-]{20,}\b/g },
  { id: "private_key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const files = walk(root);
const hits = [];
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (rel === ".env.example") continue;
  if (rel.startsWith("artifacts/")) continue;
  const text = fs.readFileSync(file, "utf-8");
  for (const pattern of patterns) {
    const found = text.match(pattern.regex);
    if (found && found.length > 0) {
      hits.push({ file: rel, pattern: pattern.id, count: found.length });
    }
  }
}

const envTracked = fs.existsSync(path.resolve(root, ".env"));
const passed = hits.length === 0;
const report = {
  checkedAt: new Date().toISOString(),
  passed,
  hits,
  notes: [
    envTracked ? ".env file exists locally (ensure it is not tracked)" : ".env file not present",
    "Placeholders in .env.example are allowed.",
  ],
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!passed) {
  console.error("secret-scan: failed");
  process.exit(1);
}

console.log("secret-scan: OK");
