# Tool Rendering

The workspace displays tool lifecycle explicitly during chat/runtime streaming.

## Stream lifecycle events

- `message_delta`
- `tool_call_start`
- `tool_call_delta`
- `tool_call_result`
- `trace_update`
- `token_usage`
- `final`
- `error`

## Tool registry contract

Each tool includes:
- name, label, description
- category
- input schema
- output kind
- artifact production flag

Tool result metadata includes status, timings, evidence IDs, warnings, source, and fallback status.

No trading or broker tool exists.
