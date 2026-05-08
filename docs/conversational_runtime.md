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

## Localization

- prompt examples are locale-aware (`zh-TW` / `en-US`)
- mock deterministic response/disclaimer follows active locale
- stream protocol fields remain stable and unlocalized

No live web browsing. No autonomous trading behaviors.
