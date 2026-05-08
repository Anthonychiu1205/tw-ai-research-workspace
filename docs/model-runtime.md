# Model Runtime

Providers:
- `mock` (default)
- `openai` (env-gated)
- `anthropic` (env-gated)
- `local` (env-gated placeholder)

`lib/config/models.ts` exposes:
- model list
- provider
- availability flag
- unavailable reason
- tool/stream support flags

When a real provider is unavailable, runtime falls back to mock and surfaces warning metadata.

No secrets are shown in UI.
