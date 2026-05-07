# Model Runtime

Model providers:
- mock
- openai (env-gated)
- anthropic (env-gated)
- local (placeholder)

`lib/config/models.ts` exposes switcher metadata with availability/reason fields.
`lib/ai/runtime.ts` defaults to mock output unless a real provider is explicitly enabled.
