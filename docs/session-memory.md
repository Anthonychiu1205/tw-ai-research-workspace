# Session Memory

Session and artifact memory is local-only.

## Storage

- `tw-ai-research-workspace:sessions`
- `tw-ai-research-workspace:artifacts`
- `tw-ai-research-workspace:runtime-settings`

## Session features

- create, rename, update, delete
- duplicate and clear
- import/export JSON
- schema version: `workspace-session.v0.2`

## Artifact features

- create/update/delete
- pin/unpin
- filter by type/ticker/session
- import/export JSON

## Resilience

- SSR-safe guards for `window`
- corrupted JSON falls back safely
- no backend DB and no auth dependency
