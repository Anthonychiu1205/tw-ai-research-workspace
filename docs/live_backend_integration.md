# Live Backend Integration (Two-Repo Local Demo)

This document explains how to run a local live integration between:

- `tw-ai-investment-research` (backend engine)
- `tw-ai-research-workspace` (workspace frontend)

This is integration readiness only. It is not trading, not broker integration, and not financial advice.

## 1) Terminal A: start backend

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-investment-research
PYTHON=/Users/ant/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
$PYTHON -m uvicorn apps.api.main:app --host 127.0.0.1 --port 8000
```

Backend should run with mock/default-safe provider behavior unless explicitly changed.

## 2) Terminal B: run workspace integration checks

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-research-workspace
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-live-backend-integration.mjs --strict
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-workspace-api-mode.mjs --strict
```

Generated artifacts:

- `artifacts/live-backend-integration-report.json`
- `artifacts/workspace-api-mode-report.json`

## 3) Terminal C: run workspace in API mode

```bash
cd /Volumes/DEV_USB/Projects/tw-ai-research-workspace
NEXT_PUBLIC_WORKSPACE_MODE=api \
NEXT_PUBLIC_API_BRIDGE_MODE=proxy \
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 \
npm run dev
```

## 4) UI checks

In `/workspace`:

- backend connected badge and base URL visible
- run research
- generate report
- run pipeline
- run portfolio review
- run backtest v2
- run strategy comparison
- check artifacts are created

## 5) Safety boundaries

- mock remains the default workspace mode
- backend remains optional for standard test/dev loops
- no broker integration
- no order placement or trade execution
- all outputs remain research and educational, not financial advice
