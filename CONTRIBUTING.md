# Contributing

Thanks for helping improve Claude-for-OSS.

## Setup

```bash
npm ci
npm run build
npm test
npm run validate
```

## Layout

- `src/` — CLI, analyzer, pack generator
- `action/check` — composite GitHub Action for freshness checks
- `validation/` — discovery-cost validation fixtures and survey
- `docs/awesome-agent-ready.md` — adoption catalog

## Guidelines

- Cite only paths that exist on disk in generated docs.
- Keep structure-hash inputs independent of pack outputs so `init` does not invalidate itself.
- Prefer clear, attributable commits.
- Extend `validation/` when changing discovery-cost behavior.

## Install from source

```bash
npm install -g github:Duc-python/claude-for-oss#main
npx -y --package=github:Duc-python/claude-for-oss#main cfo check
```

The `prepare` script compiles TypeScript on install from git.

## Releasing

1. Bump the version in `package.json`
2. Run `npm run build && npm test && npm run validate`
3. Tag `vX.Y.Z` and push to `main`
4. Publish artifacts as needed (GitHub release and/or npm)
