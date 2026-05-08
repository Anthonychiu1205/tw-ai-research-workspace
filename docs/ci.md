# CI Guide

## What CI runs

Workflow: `.github/workflows/ci.yml`

- Node matrix: 20, 22
- `npm ci`
- `npm run typecheck`
- `npm run test:run`
- `npm run build`
- `node scripts/check-env.mjs`
- `node scripts/smoke-test.mjs`

## What CI intentionally does not require

- No running backend service.
- No real API keys.
- No real LLM calls.
- No real tw-feature-engine API.

Default CI remains mock-first and deterministic.

## Manual release checks

Workflow: `.github/workflows/release-check.yml` (manual trigger)

Runs:
- `node scripts/workspace-final-audit.mjs`
- `node scripts/check-pages.mjs`
- `node scripts/check-backend-contract.mjs`
- `node scripts/generate-workspace-demo-bundle.mjs`
- `node scripts/generate-share-bundle.mjs`
- `node scripts/mock-boundary-check.mjs`

## Local equivalent

```bash
npm ci
npm run typecheck
npm run test:run
npm run build
node scripts/check-env.mjs
node scripts/smoke-test.mjs
```

## Optional live backend check

```bash
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-live-backend-integration.mjs --strict
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-workspace-api-mode.mjs --strict
```

These are intentionally not required for default CI.
