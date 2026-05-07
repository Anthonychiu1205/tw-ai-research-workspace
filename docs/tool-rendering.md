# Tool Rendering

Tool registry maps named tools to zod input schemas and execute functions.

Rendered result contract:
- toolName
- status
- startedAt/completedAt/latency
- summary
- data
- evidenceIds
- warnings

No trading, broker, or execution tools are exposed.
