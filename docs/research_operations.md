# Research Operations

The operations panel provides explicit user-triggered workflows.

Supported operations:
- run research
- generate report
- run planner pipeline
- run backtest preview (mock summary only)
- compare strategies
- evaluate signals

Each operation:
- uses API client or mock fallback
- creates workspace artifact output
- returns safe status/summary/warnings
- never executes trading
