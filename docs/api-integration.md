# API Integration

v0.5 keeps API optional and mock-first.

## Transport modes

- `mock`: local fixtures
- `proxy`: Next.js bridge routes (`/api/backend/*`)
- `direct`: calls backend base URL directly

## Health and fallback

- backend health via bridge route
- non-2xx/timeout/invalid-json -> typed safe errors
- API mode can fallback to mock with metadata:
  - `source`
  - `fallbackUsed`
  - `fallbackReason`

## Extended endpoints in workspace v0.8

- `POST /api/backend/portfolio` -> backend portfolio review/rebalance-plan
- `GET /api/backend/portfolio?analysisId=...` -> backend portfolio analysis lookup
- `POST /api/backend/backtests` with `mode=portfolio_manager` for backtest v2 summary

## Troubleshooting

- verify `TW_AI_RESEARCH_API_BASE_URL`
- prefer `NEXT_PUBLIC_API_BRIDGE_MODE=proxy`
- use runtime panel test button
- if unavailable, keep mock mode for demos

No backend required by default. No trading/broker execution paths.
