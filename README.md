# tw-ai-research-workspace

[![CI](https://github.com/Anthonychiu1205/tw-ai-research-workspace/actions/workflows/ci.yml/badge.svg)](https://github.com/Anthonychiu1205/tw-ai-research-workspace/actions/workflows/ci.yml)

AI-native Taiwan financial research workspace UI layer.

繁中摘要：這是一個以 mock-first 為預設的台灣金融研究工作區，支援繁體中文與英文切換，僅供研究與教育用途，非投資建議，且不提供交易或券商串接。

## What is this?

`tw-ai-research-workspace` is a local-first workspace layer for conversational Taiwan research workflows.

It is intentionally **not**:
- a dashboard/SaaS analytics product
- a backend research engine
- a broker/trading execution system

All bundled demo data is synthetic mock data and non-advice.

## Quick status

- Mock-first
- Bilingual `zh-TW` / `en-US`
- Next.js + TypeScript
- Optional backend integration
- No trading / no broker

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

## v0.6 Highlights

- backend integration harness with deterministic mock backend server
- optional live backend smoke script (strict and non-strict modes)
- backend compatibility report (OpenAPI/routes/demo metadata/adapters)
- workspace evaluation suite (scenarios, chat stream, artifacts, safety)
- scenario transcript fixtures and validation helpers
- publish-readiness scripts (secret scan, boundary check, final audit, publish plan)
- expanded route/page QA and route inventory export

## v0.8 Highlights

- provider readiness surfaced in workspace runtime UI for `Groq` / `DeepSeek` / `Ollama` (all env-gated)
- portfolio review operations and artifact renderers (`portfolio_review`, `rebalance_plan`)
- backtesting v2 summary operation and workspace renderer (`backtest_v2_summary`)
- strategy comparison can show portfolio-level metrics when available
- API client/adapters extended for portfolio and portfolio-managed backtest routes
- demo/share bundle updated with portfolio and backtest v2 synthetic artifacts

## v0.9 Highlights

- light, clean product theme pass (replacing dark/glass-heavy styling)
- interaction reliability pass with explicit operation states: `idle/running/succeeded/failed/fallback`
- inline feedback components for actions, failures, and fallback-safe behavior
- capability matrix for mock/api availability and disabled reasons
- clearer operation-to-artifact activation flow (open artifact, context update, result summary)
- compact right-panel hierarchy (backend/runtime/capabilities/export grouped as collapsed secondary controls)

## v1.0 Candidate Highlights

- product-style landing entry with clear scope, boundaries, and demo CTAs
- polished onboarding and guided demo flow for first-time external users
- scenario cards upgraded with expected outputs and mock-safe status
- artifact detail readability pass (semantic-first summaries + collapsible raw JSON)
- clearer chat/tool fallback communication and operation feedback
- backend/API mode clarity pass for connected/fallback/unavailable states
- refreshed public demo docs and deterministic local demo/share bundle metadata

## v0.5 Highlights

- guided scenario workflows for demo-ready research journeys
- onboarding panels (welcome, quickstart checklist, demo journey)
- workspace share bundle export/import with checksum validation
- route/page QA scripts (`check-pages`) and final RC audit (`workspace-final-audit`)
- backend live-mode dry-run guide in runtime UI
- stronger local workspace state validation and expanded QA tests

## v0.4 Highlights

- live API bridge/proxy routes under `/api/backend/*` for optional `tw-ai-investment-research` integration
- assistant-style local chat hook (`useResearchChat`) with progressive tool lifecycle state
- stable JSONL chat stream protocol for deterministic mock and fallback-safe API runtime
- operation-to-chat integration (tool/operation results become visible chat and artifact state)
- URL deep-link state (`ticker`, `session`, `artifact`, `view`) for shareable local workspace context
- keyboard shortcuts (`Cmd/Ctrl+K`, `Cmd/Ctrl+Enter`, `Cmd/Ctrl+N`, `Cmd/Ctrl+B`, `?`)
- workspace demo bundle generation for deterministic local demos
- workspace QA and accessibility smoke coverage expanded

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
`NEXT_PUBLIC_API_BRIDGE_MODE` controls API transport:
- `mock` (mock transport)
- `proxy` (default in API mode, uses Next.js bridge routes)
- `direct` (frontend calls backend URL directly)

### Capability clarity

- Mock mode keeps core research operations available without backend
- API-only actions show disabled reason when backend is unreachable
- fallback messaging is explicit (`mock_fallback`) to avoid silent no-op behavior

## Language support

- UI supports `zh-TW` and `en-US`
- Default locale is `zh-TW`
- User can switch language in topbar (`繁體中文` / `English`)
- Locale choice is persisted in localStorage
- UI copy is localized; API paths, schema keys, provider/model ids remain unchanged

## Environment variables

See [`.env.example`](/Volumes/DEV_USB/Projects/tw-ai-research-workspace/.env.example).

Key behavior:
- `NEXT_PUBLIC_WORKSPACE_MODE`: `mock` (default) or `api`
- `NEXT_PUBLIC_API_BRIDGE_MODE`: `mock | proxy | direct`
- `TW_AI_RESEARCH_API_BASE_URL`: optional backend URL
- `NEXT_PUBLIC_ENABLE_REAL_MODELS`: controls real provider enablement
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`: optional, env-gated only
- `NEXT_PUBLIC_ENABLE_GROQ` / `GROQ_API_KEY`: optional, env-gated only
- `NEXT_PUBLIC_ENABLE_DEEPSEEK` / `DEEPSEEK_API_KEY`: optional, env-gated only
- `NEXT_PUBLIC_ENABLE_OLLAMA` / `OLLAMA_BASE_URL`: optional, env-gated only

## Setup

```bash
git clone <YOUR_REPO_URL> tw-ai-research-workspace
cd tw-ai-research-workspace
npm install
cp .env.example .env.local
npm run dev
```

Clone-and-run guide: see [docs/clone_and_run.md](docs/clone_and_run.md).

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
node scripts/generate-workspace-demo-bundle.mjs
node scripts/generate-share-bundle.mjs
node scripts/check-pages.mjs
node scripts/workspace-final-audit.mjs
node scripts/check-backend-compatibility.mjs
node scripts/evaluate-workspace.mjs
node scripts/final-audit.mjs
node scripts/prepare-github-publish.mjs
```

## Lint status

`npm run lint` currently uses a **typecheck fallback** in this environment. This is documented and intentional to avoid spending excessive time on local ESLint ecosystem compatibility.

## Connect to local `tw-ai-investment-research` API

1. set `NEXT_PUBLIC_WORKSPACE_MODE=api`
2. set `TW_AI_RESEARCH_API_BASE_URL=http://localhost:8000` (or your local URL)
3. keep `fallbackToMock=true` in runtime settings for graceful degradation

If backend is unreachable, workspace falls back to synthetic mock output with explicit fallback metadata.
No server-side persistence is used; sessions and artifacts remain local-only.

## Live backend integration

For cross-repo local integration checks (workspace + backend), use:

```bash
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-live-backend-integration.mjs --strict
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-workspace-api-mode.mjs --strict
```

Full walkthrough: [docs/live_backend_integration.md](/Volumes/DEV_USB/Projects/tw-ai-research-workspace/docs/live_backend_integration.md)

## Local Stack Demo

```bash
node scripts/local-stack.mjs print-commands
node scripts/local-stack.mjs doctor
node scripts/local-stack.mjs check-integration
```

- `print-commands`: show Terminal A/B/C local demo commands
- `doctor`: validate local repo/runtime prerequisites without requiring backend to run
- `check-integration`: run live/backend + workspace API-mode checks (non-strict by default)

## Public Demo Flow

```bash
npm run dev
```

1. open `/workspace`

## CI and repository setup

- CI guide: [docs/ci.md](docs/ci.md)
- GitHub repo setup: [docs/github_repo_setup.md](docs/github_repo_setup.md)
- Demo screenshot capture guide: [docs/demo_screenshots.md](docs/demo_screenshots.md)
2. click `開始 2330 demo` / `Start 2330 Demo`
3. inspect created research artifact and evidence references
4. inspect planner trace
5. compare strategies
6. export share bundle

See [docs/public_demo_guide.md](/Volumes/DEV_USB/Projects/tw-ai-research-workspace/docs/public_demo_guide.md) for both mock-only and optional backend demo paths.

## Workspace UX

- `/workspace`: chat-first runtime + operations + artifact workbench
- `/portfolio`: portfolio research simulation view
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
- `runPortfolioReview`
- `runBacktestV2`
- `getEvidenceTimeline`
- `getSignalMatrix`
- `getAgentConsensus`

No trading tools are included.

## Stream protocol

Chat route uses a local JSONL stream protocol:
- `message_delta`
- `tool_call_start`
- `tool_call_delta`
- `tool_call_result`
- `trace_update`
- `token_usage`
- `final`
- `error`

Final responses include non-advice disclaimer metadata.

## Session and artifact persistence

- localStorage only
- session CRUD + import/export
- artifact CRUD/pin/filter + import/export
- runtime settings persistence
- workspace backup import/export
- workspace share bundle import/export (`workspace-share-bundle.v0.5`)

## Limitations

- assistant-ui package integration remains optional/planned; current implementation is assistant-ui-inspired local components
- real model providers remain env-gated placeholders
- no live web browsing by default
- no autonomous uncontrolled loops
- still mock-first by default; backend integration remains optional

## Roadmap

- deeper OpenAPI contract mapping
- richer artifact lineage visualizations
- optional assistant-ui package integration after dependency alignment

## Safety reminders

- this repo is not a dashboard/SaaS product
- this repo does not provide financial advice
- this repo has no broker integration and no trading execution
- app runs in mock mode without API keys or backend by default

## Publish Readiness

- local release candidate status only
- mock-first and backend-optional
- no trading, no broker integration, no production deployment
- manual publish flow only (no push/tag performed by Codex)
