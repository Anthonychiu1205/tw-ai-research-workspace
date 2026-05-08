# Backend Contracts

Contract checks run via:
- `node scripts/check-backend-contract.mjs`

Validates:
- mock/synthetic/non-advice metadata
- required fixture shapes (report/trace/signal/strategy)
- allowed artifact types

Output:
- `artifacts/backend-contract-check.json`

If external backend demo artifacts are missing, check warns and exits 0.
