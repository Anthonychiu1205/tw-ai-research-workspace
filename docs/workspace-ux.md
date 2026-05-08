# Workspace UX

v0.4 keeps the app workspace/chat-first, not dashboard-first.

## Layout

- left: sessions, artifacts, command menu
- center: chat + operations
- right: backend/runtime controls + capabilities + artifact/context detail

## Interaction

- command palette and keyboard shortcuts for fast actions
- operation results become artifacts and chat system events
- tool-call timeline renders status/latency/evidence/fallback
- report evidence IDs can drive evidence timeline focus
- URL deep links: `ticker`, `session`, `artifact`, `view`

## Design references

- financial-agent-ui inspired generative workflow
- assistant-ui-inspired component patterns (local implementation)
- Dexter-inspired trace visualization (bounded, deterministic)

## Safety

- no uncontrolled autonomous loops
- no broker or trading flows
- no financial advice phrasing
