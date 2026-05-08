# Development

Local flow:
1. `npm install`
2. `npm run dev`
3. run verification:
   - `npm run typecheck`
   - `npm run test:run`
   - `npm run build`
   - `node scripts/check-env.mjs`
   - `node scripts/smoke-test.mjs`
   - `node scripts/check-backend-contract.mjs`

Optional fixture sync:
- `node scripts/sync-demo-artifacts.mjs` (dry-run)
- `node scripts/sync-demo-artifacts.mjs --force` (copy)
- source: `../tw-ai-investment-research/artifacts/demo`

Lint note:
- `npm run lint` currently uses typecheck fallback due ESLint `@rushstack/eslint-patch` compatibility in this environment.
