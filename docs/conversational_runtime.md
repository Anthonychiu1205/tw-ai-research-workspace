# Conversational Runtime

v0.3 runtime extends v0.2 with stronger operation/tool integration.

## Prompt-to-tool mapping (mock runtime)

- prompt contains `2330` + `analyze` -> `runResearch`
- prompt contains `report` -> `generateReport`
- prompt contains `strategy` -> `compareStrategies`
- prompt contains `pipeline` or `trace` -> `runPipeline`
- prompt contains `signal` -> `evaluateSignals`

## Response model

- deterministic synthetic stream chunks
- visible tool-call lifecycle events
- token usage summary event
- final disclaimer event

## Boundaries

- no live web browsing
- no trading execution path
- no financial advice output intent
