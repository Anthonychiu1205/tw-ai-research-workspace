# Backend Contracts

`node scripts/check-backend-contract.mjs` validates workspace artifact contracts.

Checks:
- local `fixtures/demo/*.json`
- local `fixtures/mock-api/*.json`
- optional backend source: `../tw-ai-investment-research/artifacts/demo/*.json`

Output:
- `artifacts/backend-contract-check.json`

Behavior:
- if backend source folder is absent, script exits `0` and validates local fixtures only.
