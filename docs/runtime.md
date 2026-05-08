# Runtime

v0.3 runtime focuses on interactive workspace operations with explicit fallback visibility.

## Modes

- `mock` (default)
  - deterministic synthetic responses
  - no API key required
  - no backend required
- `api`
  - attempts backend calls
  - graceful fallback to mock when enabled

## Runtime settings

`RuntimeSettings`:
- mode
- apiBaseUrl
- selectedProvider
- selectedModel
- fallbackToMock
- showToolCalls
- showTokenUsage
- maxToolSteps (bounded 1..8)

Settings are persisted to localStorage and can be reset to mock defaults.

## Runtime status

`BackendConnectionState` shows:
- reachable/unreachable backend
- check timestamp
- fallback active state
- fallback reason

Topbar mirrors: `Mock workspace`, `API connected`, or `API fallback`.
