# tw-ai-research-workspace

AI-native Taiwan financial research workspace UI layer.

This repo is a local-first, mock-first workspace that combines:
- financial-agent-ui style workspace orchestration
- Dexter-inspired planning/trace UX
- Vercel AI SDK streaming/tool architecture patterns
- assistant-ui-inspired chat/workspace interaction patterns
- `tw-ai-investment-research` API consumption (optional backend)

## Relationship to existing repos

- `tw-feature-engine`: Taiwan market data platform (data/source layer)
- `tw-ai-investment-research`: AI research backend engine (planner/executor/reflection/reports/backtesting/APIs)
- `tw-ai-research-workspace` (this repo): frontend workspace layer consuming APIs and mock artifacts

## Scope boundaries

- Not a SaaS dashboard
- Not a backend system
- Not broker integration
- Not trading execution
- Not financial advice

All demo artifacts are synthetic mock data.

## Mock-first runtime

Default mode requires no API keys and no backend process.

- `NEXT_PUBLIC_WORKSPACE_MODE=mock`
- `AI_PROVIDER=mock`
- real providers are env-gated

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Env vars

See `.env.example`.

Key behavior:
- default mode: mock
- backend API optional via `TW_AI_RESEARCH_API_BASE_URL`
- OpenAI/Anthropic keys are optional and disabled by default

## Run checks

```bash
npm run typecheck
npm run lint
npm run test:run
node scripts/check-env.mjs
node scripts/smoke-test.mjs
npm run build
```

## Connect to local tw-ai-investment-research API

1. set `NEXT_PUBLIC_WORKSPACE_MODE=api`
2. set `TW_AI_RESEARCH_API_BASE_URL=http://localhost:8000` (or your local URL)
3. keep fallback behavior enabled: API failure returns synthetic fixtures

## Workspace UX

- `/workspace`: chat + artifacts + signal explorer + planner trace
- `/reports`: synthetic report viewer
- `/strategies`: synthetic strategy comparison
- `/traces`: planner/executor/reflection visualization

## Model runtime

Providers:
- `mock` (default)
- `openai` (env-gated)
- `anthropic` (env-gated)
- `local` (placeholder, env-gated)

No provider keys are required for demo.

## Tool calls

Tool registry includes:
- `runResearch`
- `generateReport`
- `runPipeline`
- `compareStrategies`
- `evaluateSignals`
- `getEvidenceTimeline`
- `getSignalMatrix`
- `getAgentConsensus`

No trading tools are provided.

## Session persistence

Client-only localStorage persistence:
- create/update/list/delete session
- persists messages/artifacts/model/runtime mode
- no auth and no backend DB

## Limitations

- assistant-ui package integration is planned; current build uses assistant-ui-inspired local components
- real LLM provider path is minimal and env-gated
- no live web browsing, no autonomous loops

## Roadmap

- optional assistant-ui package integration after dependency alignment
- richer trace event rendering
- stronger OpenAPI-driven adapter generation
