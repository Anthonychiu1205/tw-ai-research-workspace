# Workspace Export

Workspace backups are local JSON payloads.

## Backup shape

- `schemaVersion: workspace-backup.v0.3`
- `exportedAt`
- `sessions`
- `artifacts`
- `runtimeSettings`

Functions:
- `createWorkspaceBackup`
- `exportWorkspaceState`
- `validateWorkspaceBackup`
- `importWorkspaceState`

Invalid schema is rejected safely.
