# Runtime

v0.4 runtime focuses on a mock-first assistant workspace with optional live backend bridge.

## Modes

- `mock` (default)
  - deterministic synthetic responses
  - no API key required
  - no backend required
- `api`
  - uses bridge/direct backend transport
  - graceful fallback to mock when enabled

## Runtime settings

`RuntimeSettings`:
- mode
- apiBaseUrl
- apiBridgeMode (`mock | proxy | direct`)
- selectedProvider
- selectedModel
- fallbackToMock
- showToolCalls
- showTokenUsage
- maxToolSteps (bounded 1..8)

Settings are localStorage-only and can be reset to mock defaults.

## Runtime status

`BackendConnectionState` and capabilities panel show:
- backend reachable/unreachable
- check timestamp
- fallback active state/reason
- available endpoint capabilities

Top status remains explicit: `Mock workspace`, `API connected`, or `API fallback`.

## Boundaries

- not a dashboard/SaaS buildout
- no broker/trading execution
- no server-side persistence
- no financial advice output intent
