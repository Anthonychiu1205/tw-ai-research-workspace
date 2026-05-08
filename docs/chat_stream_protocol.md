# Chat Stream Protocol

v0.4 chat route emits JSONL stream events (`text/plain; charset=utf-8`).

Each line is:

```json
{"type":"message_delta","id":"...","timestamp":"...","payload":{}}
```

Event types:
- `message_delta`
- `tool_call_start`
- `tool_call_delta`
- `tool_call_result`
- `trace_update`
- `token_usage`
- `final`
- `error`

`final` payload includes disclaimer and token usage summary metadata.

No trading/broker event type is defined.
