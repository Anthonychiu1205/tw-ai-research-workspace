# Session Memory

Session and artifact memory remains local-only in v0.4.

## Storage keys

- `tw-ai-research-workspace:sessions`
- `tw-ai-research-workspace:artifacts`
- `tw-ai-research-workspace:runtime-settings`

## Session features

- create/rename/update/delete
- duplicate and clear
- import/export JSON
- schema version: `workspace-session.v0.2`

## Artifact features

- create/update/delete
- pin/unpin
- filter by type/ticker/session
- import/export JSON

## Workspace backup

`WorkspaceExportActions` exports/imports sessions + artifacts + runtime settings.

No backend DB, auth, or server persistence is introduced.
