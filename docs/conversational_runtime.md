# Conversational Runtime

v0.5 keeps assistant-style local runtime with deterministic mock behavior.

## Prompt mapping

- analyze + 2330 -> runResearch
- report -> generateReport
- strategy -> compareStrategies
- pipeline/trace -> runPipeline
- signal -> evaluateSignals

## RC hardening

- operation-to-chat linkage
- tool-to-artifact linkage
- retry/clear/error states
- fallback-safe API mode

No live web browsing. No autonomous trading behaviors.
