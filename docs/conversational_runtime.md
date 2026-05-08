# Conversational Runtime (v0.2)

The conversational runtime emits normalized stream events for UI rendering:
- `message_delta`
- `tool_call_start`
- `tool_call_delta`
- `tool_call_result`
- `trace_update`
- `token_usage`
- `final`
- `error`

This keeps the workspace chat-first while preserving explicit tool lifecycle visibility.

Safety boundaries:
- synthetic outputs by default
- no buy/sell recommendations
- no trading execution
- final disclaimer included
