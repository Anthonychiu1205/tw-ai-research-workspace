import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outPath = path.resolve(root, "artifacts/i18n-check.json");

const requiredFiles = [
  "lib/i18n/dictionaries/en-us.ts",
  "lib/i18n/dictionaries/zh-tw.ts",
  "lib/i18n/i18n-context.tsx",
  "components/app-shell/language-switcher.tsx",
  "docs/i18n.md",
];

const requiredSections = [
  "app",
  "nav",
  "runtime",
  "model",
  "backend",
  "chat",
  "tools",
  "operations",
  "artifacts",
  "reports",
  "evidence",
  "trace",
  "sessions",
  "scenarios",
  "onboarding",
  "errors",
  "emptyStates",
  "disclaimers",
  "limitations",
  "commands",
  "common",
];

const requiredKeys = [
  "app.title",
  "chat.title",
  "chat.exampleAnalyze",
  "operations.runResearch",
  "artifacts.title",
  "disclaimers.nonAdvice",
  "disclaimers.noTrading",
  "common.english",
  "common.traditionalChinese",
];

function read(filePath) {
  return fs.readFileSync(path.resolve(root, filePath), "utf-8");
}

function sectionExists(text, section) {
  const pattern = new RegExp(`\\b${section}\\s*:\\s*\\{`);
  return pattern.test(text);
}

function keyExists(text, keyPath) {
  const [section, key] = keyPath.split(".");
  const sectionPattern = new RegExp(`${section}\\s*:\\s*\\{[\\s\\S]*?\\b${key}\\s*:`, "m");
  return sectionPattern.test(text);
}

const existingFiles = requiredFiles.map((file) => ({ file, exists: fs.existsSync(path.resolve(root, file)) }));
const enText = read("lib/i18n/dictionaries/en-us.ts");
const zhText = read("lib/i18n/dictionaries/zh-tw.ts");
const sectionChecks = requiredSections.map((section) => ({
  section,
  en: sectionExists(enText, section),
  zh: sectionExists(zhText, section),
}));
const keyChecks = requiredKeys.map((keyPath) => ({
  keyPath,
  en: keyExists(enText, keyPath),
  zh: keyExists(zhText, keyPath),
}));

const readme = read("README.md").toLowerCase();
const readmeChecks = {
  mentionsLanguageSupport: readme.includes("language support"),
  mentionsZhDefault:
    readme.includes("default locale is zh-tw") ||
    readme.includes("default locale: zh-tw") ||
    (readme.includes("default locale is") && readme.includes("zh-tw")),
  mentionsSwitcher:
    readme.includes("english / traditional chinese") ||
    (readme.includes("english") && (readme.includes("繁體中文") || readme.includes("traditional chinese"))),
};

const passed =
  existingFiles.every((item) => item.exists) &&
  sectionChecks.every((item) => item.en && item.zh) &&
  keyChecks.every((item) => item.en && item.zh) &&
  Object.values(readmeChecks).every(Boolean);

const report = {
  checkedAt: new Date().toISOString(),
  passed,
  files: existingFiles,
  sectionChecks,
  keyChecks,
  readmeChecks,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!passed) {
  console.error("check-i18n: failed");
  process.exit(1);
}

console.log("check-i18n: OK");
