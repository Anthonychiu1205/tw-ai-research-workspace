# Architecture

`tw-ai-research-workspace` is a UI workspace layer that consumes backend APIs and local synthetic fixtures.

Core layers:
- `app/`: App Router pages and API routes
- `components/`: chat, shell, research, workspace widgets
- `lib/api`: client + adapters + OpenAPI metadata loader
- `lib/ai`: runtime/provider gating + tool registry
- `lib/sessions`: local session persistence
- `fixtures/`: synthetic mock artifacts

No backend agents, no data-provider pipelines, and no trading execution are embedded in this repo.
