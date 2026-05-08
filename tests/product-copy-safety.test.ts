import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const unsafeTerms = ["保證獲利", "無風險", "target price", "buy recommendation", "sell recommendation"];

describe("product copy safety", () => {
  test("dictionaries avoid unsafe investment advice language", () => {
    const zh = fs.readFileSync(path.resolve(process.cwd(), "lib/i18n/dictionaries/zh-tw.ts"), "utf-8").toLowerCase();
    const en = fs.readFileSync(path.resolve(process.cwd(), "lib/i18n/dictionaries/en-us.ts"), "utf-8").toLowerCase();

    for (const term of unsafeTerms) {
      expect(zh).not.toContain(term.toLowerCase());
      expect(en).not.toContain(term.toLowerCase());
    }
  });

  test("readme keeps no-trading and non-advice boundaries", () => {
    const readme = fs.readFileSync(path.resolve(process.cwd(), "README.md"), "utf-8").toLowerCase();
    expect(readme).toContain("not financial advice");
    expect(readme).toContain("no trading");
    expect(readme).toContain("no broker integration");
  });
});
