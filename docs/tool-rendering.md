# Tool Rendering

Tool registry metadata per tool:
- name / label / description
- category (research/report/pipeline/strategy/signal/evidence)
- input schema
- output kind
- artifact production flag

Tool result contract:
- toolName
- status (`pending`/`running`/`succeeded`/`failed`)
- startedAt/completedAt/latencyMs
- summary
- data
- evidenceIds
- warnings
- source
- fallbackUsed

No trading, broker, or execution tools are exposed.
