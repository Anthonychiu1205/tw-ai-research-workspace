# Backend Connection

Backend connection manager lets users switch mode and inspect fallback state.

## UI elements

- Topbar status: `Mock workspace`, `API connected`, `API fallback`
- Backend connection card: reachable/status/error/checkedAt/fallback reason
- Runtime settings panel: mode/base URL/provider/model/fallback flags

## Behavior

- in mock mode: backend optional
- in api mode: health checked via `checkBackendHealth()`
- on failure: mock fallback remains available and visible
