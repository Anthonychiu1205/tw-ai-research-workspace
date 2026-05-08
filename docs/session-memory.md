# Session Memory

Session persistence is local only:
- localStorage storage keys for sessions and artifacts
- no auth and no backend DB
- SSR-safe guards for `window`
- corrupted JSON fallback to empty state

Session store supports:
- create/rename/update/delete
- duplicate/clear
- import/export JSON
- schema version `workspace-session.v0.2`
