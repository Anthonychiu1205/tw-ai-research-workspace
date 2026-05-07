# API Integration

`lib/api/client.ts` provides typed operations:
- health
- research run/read
- report generation
- pipeline run/read
- strategy comparison
- signal evaluation
- provider/system status

In `mock` mode, responses come from `fixtures/mock-api` and `fixtures/demo`.
In `api` mode, network failures gracefully fall back to mock fixtures.
