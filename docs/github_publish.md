# GitHub Publish Plan

Generate command plan:
- `node scripts/prepare-github-publish.mjs`

Output:
- `artifacts/github-publish-plan.json`

Plan is informational only. Script does not mutate remote, push, or tag.

Typical manual flow:
1. `git remote add origin <USER_REPO_URL>`
2. `git push -u origin main`
3. `git tag -a v0.1.0 -m "v0.1.0"`
4. `git push origin v0.1.0`

If `origin` already exists, inspect first:
- `git remote -v`
- update/remove old remote manually before `git remote add origin ...`
