# Tool Rendering

Tool lifecycle remains explicit in chat/runtime UI.

Stream events:
- `message_delta`
- `tool_call_start`
- `tool_call_delta`
- `tool_call_result`
- `trace_update`
- `token_usage`
- `final`
- `error`

Timeline shows status, latency, evidence IDs, fallback badge, optional artifact open action.

No trading or broker tool exists.
