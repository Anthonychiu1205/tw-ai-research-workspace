# Backend Compatibility

v0.6 compares workspace expectations with optional backend artifacts.

Run:
- `node scripts/check-backend-compatibility.mjs`

Output:
- `artifacts/backend-compatibility-report.json`

Checks:
- required endpoint parity (`/health`, `/v1/*` core routes)
- backend demo artifact metadata
- workspace adapter parse compatibility

If backend artifacts are missing locally, the check exits 0 with warnings.
