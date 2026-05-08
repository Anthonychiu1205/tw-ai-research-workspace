# Local Stack Demo

## Purpose

This document provides a practical local demo flow for:

- `tw-ai-investment-research` as backend research engine
- `tw-ai-research-workspace` as frontend workspace layer

It is intended for local integration readiness only.

## Repo relationship

- `tw-ai-investment-research` = backend APIs and research runtime
- `tw-ai-research-workspace` = chat-first research workspace UI

## Terminal A / B / C commands

Use `node scripts/local-stack.mjs print-commands` for the latest command set.

### Terminal A — backend

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-investment-research
PYTHON=/Users/ant/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
$PYTHON -m uvicorn apps.api.main:app --host 127.0.0.1 --port 8000
```

### Terminal B — integration checks

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-research-workspace
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-live-backend-integration.mjs --strict
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-workspace-api-mode.mjs --strict
```

### Terminal C — workspace app

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-research-workspace
NEXT_PUBLIC_WORKSPACE_MODE=api \
NEXT_PUBLIC_API_BRIDGE_MODE=proxy \
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 \
npm run dev
```

## Strict vs non-strict integration checks

- non-strict (default): backend unavailable -> warning, exit 0
- strict (`--strict`): backend unavailable -> exit 1

Use strict mode for live demo gating only.

## Troubleshooting

- backend not running:
  - start Terminal A command first
- wrong Python version:
  - use the pinned runtime shown above
- port `8000` in use:
  - stop conflicting process or change backend port and pass `--base-url`
- workspace fallback to mock:
  - expected behavior when backend is unreachable

## Safety boundaries

- no broker integration
- no trading execution
- mock mode remains default
- all outputs are research-oriented and non-advice
