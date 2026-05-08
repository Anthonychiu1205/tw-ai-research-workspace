# Workspace Final Audit

v0.5 adds final release-candidate checks via:

- `node scripts/workspace-final-audit.mjs`

Output:
- `artifacts/workspace-final-audit.json`

Checks include:
- fixture metadata safety flags
- no trading tool presence
- required docs/routes/scripts existence
- package script coverage
- mock default env verification
- session schema version verification
- share bundle generation check

This is for local RC readiness, not production deployment.
