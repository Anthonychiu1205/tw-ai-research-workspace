# Final Audit

v0.6 final audit orchestrates publish-readiness checks.

Run:
- `node scripts/final-audit.mjs`

Output:
- `artifacts/final-audit.json`

Includes:
- env + smoke
- backend contract + compatibility
- workspace evaluation
- secret scan
- mock boundary check
- schema/demo/share bundle generation

This is local release readiness, not production deployment readiness.
