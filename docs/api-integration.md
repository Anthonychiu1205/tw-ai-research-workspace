# API Integration

`lib/api/client.ts` provides typed API operations with timeout, error typing, and fallback handling.

## Client behavior

- mock mode returns local fixtures
- api mode uses `TW_AI_RESEARCH_API_BASE_URL`
- network/non-2xx/invalid JSON errors map to `WorkspaceApiError`
- fallback metadata is attached when mock fallback is used

## Metadata contract

Frontend-safe metadata includes:
- `source`: `mock | api | mock_fallback`
- `synthetic`
- `fallbackUsed`
- `fallbackReason`
- `notFinancialAdvice: true`
- `noTradingExecution: true`

## Adapter layer

Components consume adapter outputs from `lib/api/adapters.ts` instead of raw backend JSON.

## Backend optional

No backend process is required for demo.
