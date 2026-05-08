# Workspace UX

v0.5 is workspace-first, not dashboard-first.

## Layout

- left: sessions, artifacts, command palette
- center: chat, scenarios, operations, onboarding
- right: backend/runtime/capabilities + artifact detail/context

## New in v0.5

- guided scenarios launcher + stepper
- onboarding welcome + demo journey
- share bundle export/import actions
- backend live-mode dry-run guide

## Extended in v0.8

- portfolio review panel and rebalance plan rendering
- backtest v2 summary view (portfolio-managed hypothetical results)
- artifact context renderers for `portfolio_review`, `rebalance_plan`, `backtest_v2_summary`
- dedicated `/portfolio` page for research simulation views

## Extended in v0.9

- light theme as default workspace surface (document-product style)
- reduced visual noise: fewer nested cards/borders and compact status hierarchy
- clearer layout split:
  - left: navigation + compact sessions/artifacts
  - center: chat-first workflow + operations/scenarios/artifacts tabs
  - right: active context + collapsed runtime/backend details
- explicit inline feedback for run/complete/failure/fallback states

## v1.0 candidate polish

- product-style landing entry and cleaner first-run onboarding copy
- scenario cards now surface expected outputs and mock-safe status
- artifact detail panel prioritizes semantic previews before raw JSON
- public demo flow is documented for mock-only and optional backend paths

## Safety

- synthetic output labeling
- non-advice messaging
- no trading / no broker
- bounded deterministic workflows

## Language

- UI supports `zh-TW` and `en-US`
- default locale is `zh-TW`
- locale switch is available in topbar and persisted locally
