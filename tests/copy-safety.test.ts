import { describe, expect, test } from "vitest";
import { zhTWDictionary } from "@/lib/i18n/dictionaries/zh-tw";
import { enUSDictionary } from "@/lib/i18n/dictionaries/en-us";

function flatten(input: unknown): string[] {
  if (typeof input === "string") return [input];
  if (!input || typeof input !== "object") return [];
  return Object.values(input as Record<string, unknown>).flatMap((value) => flatten(value));
}

describe("copy safety", () => {
  test("zh-TW and en-US dictionaries expose required sections", () => {
    expect(zhTWDictionary.app.title).toBeTruthy();
    expect(zhTWDictionary.runtime.settingsTitle).toBeTruthy();
    expect(zhTWDictionary.disclaimers.nonAdvice).toBeTruthy();
    expect(enUSDictionary.app.title).toBeTruthy();
    expect(enUSDictionary.runtime.settingsTitle).toBeTruthy();
    expect(enUSDictionary.disclaimers.nonAdvice).toBeTruthy();
  });

  test("forbidden investment advice wording is absent in dictionaries", () => {
    const allCopy = [...flatten(zhTWDictionary), ...flatten(enUSDictionary)].join("\n");
    const forbidden = [
      "保證獲利",
      "無風險",
      "目標價",
      "必買",
      "必賣",
      "buy recommendation",
      "sell recommendation",
      "guaranteed returns",
      "risk-free",
    ];

    for (const term of forbidden) {
      expect(allCopy).not.toContain(term);
    }
  });
});

