# Runtime

Modes:
- `mock` (default): fixtures, deterministic stream events, no API keys required
- `api`: attempts backend calls, returns mock fallback safely when unavailable

`WorkspaceRuntimeConfig` fields:
- mode / apiBaseUrl
- selectedProvider / selectedModel
- fallbackToMock
- streamToolCalls
- showTokenUsage
- maxToolSteps (bounded)

`WorkspaceRuntimeStatus` exposes backend/provider reachability and fallback state.
