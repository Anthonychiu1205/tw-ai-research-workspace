# Workspace UX

v0.3 keeps the app chat-first and operation-first (not dashboard-first).

## Layout

- left: sessions, artifacts, command palette
- center: research chat + research operations panel
- right: backend/runtime controls + artifact detail + context panel

## Interaction patterns

- command palette quick actions for common operations
- operation results generate artifacts directly
- artifact workbench supports filter/detail/export/pin
- report sections can select evidence IDs and highlight timeline items
- planner trace tabs split plan/execution/reflection

Design references:
- financial-agent-ui inspired generative workflow
- assistant-ui-inspired component patterns
- Dexter-inspired trace visualization

Safety:
- bounded deterministic workflow
- no uncontrolled autonomous loops
- synthetic/non-advice labeling throughout
