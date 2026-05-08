# Conversational Runtime

v0.4 introduces a local assistant-style chat hook with deterministic JSONL streaming.

## Core hook

`useResearchChat` returns:
- messages/input state
- send/stop/retry/clear actions
- active tool calls
- token usage
- last error

## Prompt-to-tool mapping (mock runtime)

- `analyze` + `2330` -> `runResearch`
- `report` -> `generateReport`
- `strategy` -> `compareStrategies`
- `pipeline` or `trace` -> `runPipeline`
- `signal` -> `evaluateSignals`

## Boundaries

- no live web browsing
- no trading execution path
- no financial advice intent
