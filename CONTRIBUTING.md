# Contributing

Thanks for helping grow Claude-for-OSS.

## Setup

```bash
npm ci
npm run build
npm test
npm run validate
```

## Project shape

- `src/` — CLI + analyzer + pack generator
- `action/check` — composite GitHub Action for freshness
- `validation/` — Phase 0 discovery-cost gate
- `docs/awesome-agent-ready.md` — adoption catalog

## Rules

- Prefer verified on-disk paths in generated docs (no invented modules).
- Keep structure-hash inputs free of pack outputs so `init` does not self-stale.
- Author commits as yourself; do not rely on AI co-author trailers for attribution.
- Add/adjust fixtures under `validation/` when changing discovery-cost math.

## Release

### GitHub (default while npm 2FA blocked)

```bash
npm install -g github:Duc-python/claude-for-oss#main
# or
npx -y github:Duc-python/claude-for-oss#main -- check
```

`prepare` runs `tsc` on install from git.

### npmjs.com (when you can enable 2FA / publish token)

1. Bump `package.json` version
2. `npm run build && npm test`
3. Tag `vX.Y.Z` and push
4. `npm publish --access public`
