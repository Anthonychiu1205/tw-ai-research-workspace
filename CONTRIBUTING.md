# Contributing

## Scope

This repository is the workspace UI layer for Taiwan research workflows.

In scope:
- workspace UX, interaction reliability, and docs
- mock-first runtime behavior and fallback clarity
- artifact readability and trace/evidence presentation
- tests, scripts, and local developer tooling

Out of scope without explicit approval:
- trading execution
- broker integration
- auth/billing SaaS features
- production deployment infrastructure

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Validation before PR

```bash
npm run typecheck
npm run test:run
npm run build
node scripts/check-env.mjs
node scripts/smoke-test.mjs
node scripts/workspace-final-audit.mjs
```

## CI expectations

- CI must pass without real API keys.
- CI must pass without backend running.
- CI must remain mock-first and deterministic by default.

## Copy and safety policy

- Keep non-advice wording intact.
- Do not introduce buy/sell or guaranteed-return language.
- Keep fallback states explicit when backend is unavailable.
