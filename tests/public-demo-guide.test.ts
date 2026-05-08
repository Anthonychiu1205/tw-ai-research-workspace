import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("public demo guide", () => {
  test("guide exists with required sections", () => {
    const filePath = path.resolve(process.cwd(), "docs/public_demo_guide.md");
    expect(fs.existsSync(filePath)).toBe(true);

    const text = fs.readFileSync(filePath, "utf-8").toLowerCase();
    expect(text).toContain("recommended demo path");
    expect(text).toContain("mock-only");
    expect(text).toContain("not financial advice");
    expect(text).toContain("no broker integration");
  });
});
