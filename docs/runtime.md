# Runtime

v0.5 runtime targets local release-candidate readiness.

## Modes

- `mock` (default)
  - deterministic synthetic demo
  - no backend/API keys required
- `api`
  - optional backend bridge/direct transport
  - fallback to mock when unavailable

## Runtime settings

- mode
- apiBaseUrl
- apiBridgeMode (`mock | proxy | direct`)
- selectedProvider/model
- fallbackToMock
- tool/token visibility
- bounded `maxToolSteps`

Settings persist in localStorage only.

## Boundaries

- not dashboard / not SaaS
- no trading / no broker
- no financial advice
- backend optional
- local-only session/artifact persistence
- real providers env-gated
