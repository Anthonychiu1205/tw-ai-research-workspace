# Model Runtime

Providers:
- `mock` (default)
- `openai` (env-gated)
- `anthropic` (env-gated)
- `local` (env-gated placeholder)

`lib/config/models.ts` exposes:
- model list
- provider
- availability
- unavailable reason
- tool/stream support flags

If provider/key/base URL is unavailable, runtime falls back to mock safely. No secrets are rendered in UI.

This workspace remains non-advice and non-trading.
