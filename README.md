# tw-ai-research-workspace

AI-native Taiwan financial research workspace UI layer.

## What is this?

`tw-ai-research-workspace` is a local-first workspace layer for conversational Taiwan research workflows.

It is intentionally **not**:
- a dashboard/SaaS analytics product
- a backend research engine
- a broker/trading execution system

All bundled demo data is synthetic mock data and non-advice.

## Relationship to existing repos

- `tw-feature-engine`
  - Taiwan market data platform (data/source layer)
- `tw-ai-investment-research`
  - AI research backend engine (planner/executor/reflection/reports/backtesting/APIs)
- `tw-ai-research-workspace` (this repo)
  - frontend workspace layer that consumes optional backend APIs and local mock artifacts

## Scope boundaries

- not financial advice
- no buy/sell recommendation engine
- no broker integration
- no trading execution
- no auth or billing
- no vector DB / full RAG
- no production deployment stack

## v0.3 Highlights

- interactive research operations panel (run research/report/pipeline/backtest-preview/strategy compare/signal evaluate)
- artifact workbench (browser, metadata, lineage, JSON, pin/unpin, export/import)
- backend live mode controls (mock/api switching, health checks, fallback visibility)
- runtime settings persistence in localStorage
- command palette quick actions
- evidence/report interaction (click evidence IDs from report to timeline)
- planner trace interaction tabs (plan/execution/reflection)
- workspace backup export/import

## Runtime model

Default behavior is **mock-first**:

- `NEXT_PUBLIC_WORKSPACE_MODE=mock`
- `AI_PROVIDER=mock`
- no API key required
- no backend server required

API mode is optional and fallback-safe.

## Environment variables

See [`.env.example`](/Volumes/DEV_USB/Projects/tw-ai-research-workspace/.env.example).

Key behavior:
- `NEXT_PUBLIC_WORKSPACE_MODE`: `mock` (default) or `api`
- `TW_AI_RESEARCH_API_BASE_URL`: optional backend URL
- `NEXT_PUBLIC_ENABLE_REAL_MODELS`: controls real provider enablement
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`: optional, env-gated only

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Verification

```bash
npm run typecheck
npm run test:run
npm run build
node scripts/check-env.mjs
node scripts/smoke-test.mjs
node scripts/export-workspace-schema.mjs
node scripts/check-backend-contract.mjs
node scripts/sync-demo-artifacts.mjs
```

## Lint status

`npm run lint` currently uses a **typecheck fallback** in this environment. This is documented and intentional to avoid spending excessive time on local ESLint ecosystem compatibility.

## Connect to local `tw-ai-investment-research` API

1. set `NEXT_PUBLIC_WORKSPACE_MODE=api`
2. set `TW_AI_RESEARCH_API_BASE_URL=http://localhost:8000` (or your local URL)
3. keep `fallbackToMock=true` in runtime settings for graceful degradation

If backend is unreachable, workspace falls back to synthetic mock output with explicit fallback metadata.

## Workspace UX

- `/workspace`: chat-first runtime + operations + artifact workbench
- `/reports`: synthetic report viewer
- `/strategies`: synthetic strategy comparison
- `/traces`: planner/executor/reflection view

## Tool calls

Workspace tools:
- `runResearch`
- `generateReport`
- `runPipeline`
- `compareStrategies`
- `evaluateSignals`
- `getEvidenceTimeline`
- `getSignalMatrix`
- `getAgentConsensus`

No trading tools are included.

## Session and artifact persistence

- localStorage only
- session CRUD + import/export
- artifact CRUD/pin/filter + import/export
- runtime settings persistence
- workspace backup import/export

## Limitations

- assistant-ui package integration remains optional/planned; current implementation is assistant-ui-inspired local components
- real model providers remain env-gated placeholders
- no live web browsing by default
- no autonomous uncontrolled loops

## Roadmap

- deeper OpenAPI contract mapping
- richer artifact lineage visualizations
- optional assistant-ui package integration after dependency alignment
