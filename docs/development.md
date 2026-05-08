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

## Optional fixture sync

- dry-run (default): `node scripts/sync-demo-artifacts.mjs`
- copy non-existing files: `node scripts/sync-demo-artifacts.mjs --force`

Source repo (optional): `../tw-ai-investment-research/artifacts/demo`

## Lint note

`npm run lint` currently acts as a typecheck fallback in this environment. Typecheck/test/build remain the authoritative gates.
