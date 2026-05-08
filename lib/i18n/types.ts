export type Locale = "en-US" | "zh-TW";

export type Dictionary = {
  app: Record<string, string>;
  nav: Record<string, string>;
  runtime: Record<string, string>;
  model: Record<string, string>;
  backend: Record<string, string>;
  chat: Record<string, string>;
  tools: Record<string, string>;
  operations: Record<string, string>;
  artifacts: Record<string, string>;
  reports: Record<string, string>;
  evidence: Record<string, string>;
  trace: Record<string, string>;
  sessions: Record<string, string>;
  scenarios: Record<string, string>;
  onboarding: Record<string, string>;
  errors: Record<string, string>;
  emptyStates: Record<string, string>;
  disclaimers: Record<string, string>;
  limitations: Record<string, string>;
  commands: Record<string, string>;
  common: Record<string, string>;
};
