# Backend Contracts

`node scripts/check-backend-contract.mjs` validates local fixture contracts and optional backend demo artifacts.

## Required fixture metadata

- `provider: mock`
- `dataType: synthetic_mock`
- `notFinancialAdvice: true`
- `noTradingExecution: true`

## Contract checks

- report fixture includes `sections`
- pipeline/trace fixtures include `plan`, `execution`, `reflection`
- signal matrix fixtures include `watchlist`, `signals`
- strategy comparison fixtures include `strategies`
- session demo artifacts use known workspace artifact types

Output:
- `artifacts/backend-contract-check.json`

If `../tw-ai-investment-research/artifacts/demo` is missing, script warns and exits `0`.
