# Public Demo Guide

## What to demo

`tw-ai-research-workspace` is a mock-first AI-native Taiwan research workspace.

Demo emphasis:
- conversational research workflow
- traceable artifacts and evidence
- planner/executor/reflection visibility
- optional backend API integration

Not in scope:
- trading execution
- no broker integration
- financial advice

## Recommended demo path (mock-only, default)

1. `npm run dev`
2. open `/workspace`
3. click `開始 2330 demo` / `Start 2330 Demo`
4. inspect created research artifact
5. open evidence references
6. open planner trace
7. generate report
8. compare strategies
9. export share bundle

## Optional backend API demo

If local backend is running:

```bash
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-live-backend-integration.mjs --strict
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-workspace-api-mode.mjs --strict
```

Then run workspace with:

```bash
NEXT_PUBLIC_WORKSPACE_MODE=api \
NEXT_PUBLIC_API_BRIDGE_MODE=proxy \
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 \
npm run dev
```

## Troubleshooting

- Backend unavailable: workspace automatically falls back to mock mode.
- Missing API keys: keep mock mode; public demo does not require real keys.
- Port conflict on `8000`: update backend URL in runtime settings.

## Safety statement

- Mock/synthetic data is for research and education only.
- This workspace is not financial advice.
- This workspace does not place orders, execute trades, or integrate with brokers.
