# Runtime

Modes:
- `mock` (default): fixtures and deterministic streaming
- `api`: calls `tw-ai-investment-research` API with graceful fallback to mock

Fallback:
- API errors are converted into typed safe results
- UI never receives raw fetch stack traces

No API key is required for local demo.
