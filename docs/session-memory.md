# Session Memory

Sessions and artifacts remain local-only in v0.5.

## Storage

- sessions key
- artifacts key
- runtime settings key

## Export/import

- workspace backup (`workspace-backup.v0.3`)
- share bundle (`workspace-share-bundle.v0.5`)

## Guarantees

- SSR-safe localStorage guards
- corrupted payload fallback
- no server-side persistence
