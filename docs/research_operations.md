# Research Operations

Operations are explicit user-triggered workflows.

Supported operations:
- run research
- generate report
- run planner pipeline
- run backtest preview (mock summary)
- compare strategies
- evaluate signals

Each operation:
- uses API client (mock/proxy/direct)
- can fallback to mock safely
- creates workspace artifacts
- surfaces typed status/warnings/errors
- never executes trading
