# Multi-Model Runtime

Supported provider identifiers in workspace runtime:

- `mock` (default)
- `openai` (env-gated)
- `anthropic` (env-gated)
- `groq` (env-gated)
- `deepseek` (env-gated)
- `ollama` (env-gated)
- `local` (env-gated)

Real provider access is optional.
When unavailable, workspace falls back to mock/synthetic flows.
