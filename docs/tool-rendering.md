# Tool Rendering

v0.4 renders tool lifecycle as first-class chat/runtime state.

## Stream events

- `message_delta`
- `tool_call_start`
- `tool_call_delta`
- `tool_call_result`
- `trace_update`
- `token_usage`
- `final`
- `error`

## Tool timeline UX

Each tool call renders:
- status (`pending/running/succeeded/failed`)
- latency
- fallback badge when used
- evidence IDs
- optional artifact open action

No trading or broker tools exist.
