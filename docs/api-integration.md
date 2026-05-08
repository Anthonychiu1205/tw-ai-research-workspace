# API Integration

v0.5 keeps API optional and mock-first.

## Transport modes

- `mock`: local fixtures
- `proxy`: Next.js bridge routes (`/api/backend/*`)
- `direct`: calls backend base URL directly

## Health and fallback

- backend health via bridge route
- non-2xx/timeout/invalid-json -> typed safe errors
- API mode can fallback to mock with metadata:
  - `source`
  - `fallbackUsed`
  - `fallbackReason`

## Troubleshooting

- verify `TW_AI_RESEARCH_API_BASE_URL`
- prefer `NEXT_PUBLIC_API_BRIDGE_MODE=proxy`
- use runtime panel test button
- if unavailable, keep mock mode for demos

No backend required by default. No trading/broker execution paths.
