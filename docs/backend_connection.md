# Backend Connection

Backend connection manager makes runtime state explicit.

## UI

- topbar status: `Mock workspace` / `API connected` / `API fallback`
- backend card: reachable/status/error/checkedAt/fallback reason
- runtime settings panel: mode/base URL/provider/model/fallback/tool visibility
- capabilities panel: route category availability

## Behavior

- mock mode: backend optional
- api mode: health/capabilities checks run
- backend failure: mock fallback stays available and visible

No remote mutation, deployment infra, or server persistence is added.
