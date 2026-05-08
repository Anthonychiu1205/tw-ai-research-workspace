# Model Runtime

Model providers:
- mock
- openai (env-gated)
- anthropic (env-gated)
- local (env-gated placeholder)

`lib/config/models.ts` exposes provider availability and reason-unavailable metadata.

`lib/ai/runtime.ts` normalizes provider/runtime config, emits stream lifecycle events, executes local tool registry, and falls back to mock safely when providers are unavailable.
