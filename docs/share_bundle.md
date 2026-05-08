# Share Bundle

v0.5 adds `WorkspaceShareBundle` export/import for local demo sharing.

Schema:
- `schemaVersion: workspace-share-bundle.v0.5`
- bundle metadata (`source`, `synthetic`, `notFinancialAdvice`, `noTradingExecution`)
- product metadata (`appName`, `locale`, `recommendedDemoFlow`, `generatedArtifacts`)
- sessions/artifacts/runtime settings
- `scenariosCompleted`
- `checksum`

Generate via:
- `node scripts/generate-share-bundle.mjs`

Output:
- `artifacts/workspace-share-bundle.json`

Persistence remains local-only; no server-side persistence is introduced.
