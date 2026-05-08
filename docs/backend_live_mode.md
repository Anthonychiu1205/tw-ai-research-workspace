# Backend Live Mode (Dry-Run)

This workspace remains mock-first and backend-optional.

## Local backend mode

1. Start local `tw-ai-investment-research` service.
2. Set `.env.local`:
   - `NEXT_PUBLIC_WORKSPACE_MODE=api`
   - `NEXT_PUBLIC_API_BRIDGE_MODE=proxy`
   - `TW_AI_RESEARCH_API_BASE_URL=http://localhost:8000`
3. Start workspace with `npm run dev`.
4. In Runtime Settings, click **Test backend connection**.

For script-based validation from this repo:

- `TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-live-backend-integration.mjs --strict`
- `TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 node scripts/check-workspace-api-mode.mjs --strict`

## Fallback behavior

If backend is unreachable, workspace falls back to synthetic mock output and displays fallback state.

## Troubleshooting

- verify backend URL and port
- keep bridge mode as `proxy`
- check `/api/backend/health` response path
- use mock mode if backend is unavailable

No broker integration and no trading execution are included.
