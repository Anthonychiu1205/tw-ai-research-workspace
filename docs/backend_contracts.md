# Backend Contracts

`node scripts/check-backend-contract.mjs` validates local fixtures and optional backend demo artifacts.

## Required metadata

- `provider: mock`
- `dataType: synthetic_mock`
- `notFinancialAdvice: true`
- `noTradingExecution: true`

## Required shape checks

- report fixtures include `sections`
- pipeline/trace fixtures include `plan/execution/reflection`
- signal matrix fixtures include `watchlist/signals`
- strategy comparison fixtures include `strategies`
- session fixtures contain allowed artifact types only

Output: `artifacts/backend-contract-check.json`

If `../tw-ai-investment-research/artifacts/demo` is missing, script warns and exits 0.
