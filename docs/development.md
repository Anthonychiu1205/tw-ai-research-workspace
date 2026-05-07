# Development

Local flow:
1. `npm install`
2. `npm run dev`
3. run checks: typecheck, lint, tests, smoke, build

Optional fixture sync:
- `node scripts/sync-demo-artifacts.mjs`
- source: `../tw-ai-investment-research/artifacts/demo`
- non-destructive by default unless `--force`
