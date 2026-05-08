# Clone and Run (Mock-First)

## 1. Clone

```bash
git clone <YOUR_REPO_URL> tw-ai-research-workspace
cd tw-ai-research-workspace
```

## 2. Install and start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 3. Validate locally

```bash
npm run typecheck
npm run test:run
npm run build
node scripts/check-env.mjs
node scripts/smoke-test.mjs
node scripts/workspace-final-audit.mjs
```

## 4. Optional API mode (backend running locally)

```bash
NEXT_PUBLIC_WORKSPACE_MODE=api \
NEXT_PUBLIC_API_BRIDGE_MODE=proxy \
TW_AI_RESEARCH_API_BASE_URL=http://127.0.0.1:8000 \
npm run dev
```

## 5. Boundaries

- Mock mode is default
- Backend is optional
- No financial advice
- No trading / no broker integration
