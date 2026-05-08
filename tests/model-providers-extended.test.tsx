import { describe, expect, test, beforeEach } from "vitest";
import { getModelOptions } from "@/lib/config/models";

describe("model providers extended", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_REAL_MODELS = "false";
    process.env.NEXT_PUBLIC_ENABLE_GROQ = "false";
    process.env.NEXT_PUBLIC_ENABLE_DEEPSEEK = "false";
    process.env.NEXT_PUBLIC_ENABLE_OLLAMA = "false";
    process.env.GROQ_API_KEY = "";
    process.env.DEEPSEEK_API_KEY = "";
    process.env.OLLAMA_BASE_URL = "";
  });

  test("providers listed", () => {
    const models = getModelOptions();
    const providers = new Set(models.map((model) => model.provider));
    expect(providers.has("mock")).toBe(true);
    expect(providers.has("groq")).toBe(true);
    expect(providers.has("deepseek")).toBe(true);
    expect(providers.has("ollama")).toBe(true);
  });

  test("unavailable reasons", () => {
    const models = getModelOptions();
    const groq = models.find((model) => model.provider === "groq");
    const deepseek = models.find((model) => model.provider === "deepseek");
    const ollama = models.find((model) => model.provider === "ollama");
    expect(groq?.available).toBe(false);
    expect(deepseek?.available).toBe(false);
    expect(ollama?.available).toBe(false);
    expect(groq?.reasonUnavailable).toMatch(/missing|disabled/i);
  });

  test("mock default", () => {
    const models = getModelOptions();
    const mock = models.find((model) => model.provider === "mock");
    expect(mock?.available).toBe(true);
  });

  test("no key required", () => {
    const models = getModelOptions();
    expect(models.length).toBeGreaterThan(0);
  });
});
