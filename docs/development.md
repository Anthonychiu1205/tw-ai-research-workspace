# Development

## Local workflow

1. `npm install`
2. `npm run dev`
3. verify:
   - `npm run typecheck`
   - `npm run test:run`
   - `npm run build`
   - `node scripts/check-env.mjs`
   - `node scripts/smoke-test.mjs`
   - `node scripts/export-workspace-schema.mjs`
   - `node scripts/check-backend-contract.mjs`
   - `node scripts/sync-demo-artifacts.mjs`
   - `node scripts/generate-workspace-demo-bundle.mjs`

## Fixture sync

- dry-run (default): `node scripts/sync-demo-artifacts.mjs`
- copy missing files only: `node scripts/sync-demo-artifacts.mjs --force`

Optional source: `../tw-ai-investment-research/artifacts/demo`

## Lint note

`npm run lint` is intentionally a typecheck fallback in this environment.
Typecheck/test/build are the authoritative gates.

## Safety boundaries

- not a dashboard/SaaS buildout
- no broker/trading execution
- no financial advice intent
