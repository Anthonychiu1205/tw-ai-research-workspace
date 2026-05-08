# Runtime

v0.5 runtime targets local release-candidate readiness.
v0.8 extends runtime provider readiness and portfolio/backtest operations while keeping mock default.

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

## Capability matrix (v0.9)

Workspace evaluates capabilities by runtime mode + backend reachability:
- `both`: available in mock and api modes
- `api`: requires reachable backend (or shows fallback-safe disabled reason)
- `mock`: local-only helper capability

UI uses this matrix to control:
- enabled/disabled controls
- unavailable reasons
- fallback availability notes

## Boundaries

- not dashboard / not SaaS
- no trading / no broker
- no financial advice
- backend optional
- local-only session/artifact persistence
- real providers env-gated
