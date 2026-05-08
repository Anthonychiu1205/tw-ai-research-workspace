# Workspace API Mode Example

This workspace is mock-first by default.

## Switch to API mode (local dry-run)

1. Set `.env.local`:
   - `NEXT_PUBLIC_WORKSPACE_MODE=api`
   - `NEXT_PUBLIC_API_BRIDGE_MODE=proxy`
   - `TW_AI_RESEARCH_API_BASE_URL=http://localhost:8000`
2. Start workspace: `npm run dev`
3. Open `/workspace`
4. Use **Test backend connection** in runtime settings.

If backend is unavailable, workspace falls back to synthetic mock output.

No broker integration, no trading execution, and no financial advice output intent.
