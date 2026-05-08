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
   - `node scripts/check-pages.mjs`
   - `node scripts/check-backend-contract.mjs`
   - `node scripts/generate-workspace-demo-bundle.mjs`
   - `node scripts/generate-share-bundle.mjs`
   - `node scripts/workspace-final-audit.mjs`

## Lint

`npm run lint` remains typecheck fallback in this environment.
Typecheck/test/build are the authoritative gates.

## Boundaries

- not dashboard/SaaS
- no financial advice
- no trading or broker integration
- local-only persistence
- real providers env-gated
