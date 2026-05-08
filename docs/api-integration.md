# API Integration

v0.4 adds a Next.js API bridge for `tw-ai-investment-research` while keeping mock-first fallback behavior.

## Bridge routes

`/api/backend/*` routes:
- `GET /api/backend/health`
- `POST /api/backend/research`
- `POST /api/backend/reports`
- `POST /api/backend/pipelines`
- `POST /api/backend/backtests`
- `POST /api/backend/strategies`
- `POST /api/backend/signals`
- `GET /api/backend/system`
- `GET /api/backend/conformance`

## Client behavior

`lib/api/client.ts` supports:
- `mock` transport
- `proxy` transport (default when mode=`api`)
- `direct` transport

All paths normalize timeout/non-2xx/invalid JSON into typed frontend-safe errors.

## Metadata contract

Frontend-safe metadata includes:
- `source`: `mock | api | mock_fallback`
- `provider`
- `synthetic`
- `fallbackUsed`
- `fallbackReason`
- `notFinancialAdvice: true`
- `noTradingExecution: true`

Components consume adapter outputs instead of raw backend payloads.
