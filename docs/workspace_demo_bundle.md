# Workspace Demo Bundle

`node scripts/generate-workspace-demo-bundle.mjs` writes:

- `artifacts/workspace-demo-bundle.json`

Bundle includes:
- runtime settings
- sessions
- artifacts
- research card
- signal matrix
- evidence timeline
- report sections
- planner trace
- strategy comparison

Metadata always includes:
- `provider: mock`
- `dataType: synthetic_mock`
- `notFinancialAdvice: true`
- `noTradingExecution: true`
- `generatedAt`
