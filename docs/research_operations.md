# Research Operations

Operations remain explicit user-triggered workflows.

Kinds:
- run research
- generate report
- run pipeline
- run backtest preview
- run portfolio review
- run backtest v2
- compare strategies
- evaluate signals

Each operation can run in mock mode without backend and creates local artifacts.
No trading execution is performed.

## Interaction reliability (v0.9)

Each operation now exposes explicit UI state:
- `idle`
- `running`
- `succeeded`
- `failed`
- `fallback`

Result behavior:
- success: shows completion feedback and artifact open action
- failed: shows safe error detail and retry path
- fallback: clearly states backend is unavailable and mock fallback was used

No operation should silently no-op.
