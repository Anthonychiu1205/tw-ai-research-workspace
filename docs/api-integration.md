# API Integration

`lib/api/client.ts` provides typed operations with timeout and fallback hardening:
- `checkBackendHealth()`
- research run/read
- report generation
- pipeline run/read
- strategy comparison
- signal evaluation
- provider/system status

Behavior:
- `mock` mode: fixture-only
- `api` mode: timeout-aware fetch wrapper
- non-2xx and network errors map to typed `WorkspaceApiError`
- fallback metadata includes `source`, `fallbackUsed`, and reason
- UI never receives raw fetch stack traces
