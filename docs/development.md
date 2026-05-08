# Development

## Core flow

1. `npm install`
2. `npm run dev`
3. verify:
   - `npm run typecheck`
   - `npm run test:run`
   - `npm run build`
   - `node scripts/check-env.mjs`
   - `node scripts/smoke-test.mjs`
   - `node scripts/check-backend-contract.mjs`
   - `node scripts/check-backend-compatibility.mjs`
   - `node scripts/evaluate-workspace.mjs`
   - `node scripts/check-pages.mjs`
   - `node scripts/export-routes.mjs`
   - `node scripts/generate-workspace-demo-bundle.mjs`
   - `node scripts/generate-share-bundle.mjs`
   - `node scripts/final-audit.mjs`

## Optional live backend smoke

- `node scripts/check-live-backend.mjs`
- strict mode: `node scripts/check-live-backend.mjs --strict`
- optional research call: `node scripts/check-live-backend.mjs --run-research`

## Lint

`npm run lint` remains typecheck fallback in this environment.
Typecheck/test/build are authoritative gates.

## Boundaries

- not dashboard/SaaS
- no financial advice
- no trading/broker integration
- mock-first by default
- backend optional
- local-only session/artifact persistence
