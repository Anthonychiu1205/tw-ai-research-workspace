# API Bridge

v0.4 adds Next.js bridge routes to proxy `tw-ai-investment-research` APIs.

## Why bridge mode

- avoids frontend CORS handling
- centralizes timeout/error normalization
- hides backend internals from UI
- keeps mock fallback behavior consistent

## Transport modes

- `mock`: fixture-backed
- `proxy`: `/api/backend/*` bridge (recommended for API mode)
- `direct`: frontend calls backend base URL directly

Set via `NEXT_PUBLIC_API_BRIDGE_MODE`.

Bridge is runtime-only; no backend logic is copied into this repo.
