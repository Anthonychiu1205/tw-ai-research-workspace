import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = "/Volumes/DEV_USB/Projects/tw-ai-research-workspace";
const FILES = [
  "app/workspace/page.tsx",
  "components/app-shell/topbar.tsx",
  "components/app-shell/sidebar.tsx",
  "components/chat/research-chat.tsx",
  "components/workspace/workspace-context-panel.tsx",
  "components/workspace/backend-connection-card.tsx",
];

const FORBIDDEN_TOKENS = ["bg-black", "bg-slate-950", "backdrop-blur", "bg-white/5", "border-white/10"];

describe("no AI dark glass regression", () => {
  test("key workspace components avoid dark/glass class tokens", () => {
    for (const rel of FILES) {
      const file = path.join(ROOT, rel);
      const content = fs.readFileSync(file, "utf8");
      for (const token of FORBIDDEN_TOKENS) {
        expect(content).not.toContain(token);
      }
    }
  });
});

