# Claude for Open Source (`claude-for-oss` / `cfo`)

Make any open-source repo **agent-ready**: generate and keep fresh an *orientation pack* so Claude Code, Cursor, OpenCode, Cline, and friends discover stack, commands, and layout without thrashing.

This is **not** another coding agent. It is a **context + contribution map** you commit to the repo.

[![agent-oriented](https://raw.githubusercontent.com/Duc-python/claude-for-oss/main/badges/agent-oriented.svg)](docs/awesome-agent-ready.md)
[![Claude-ready](https://raw.githubusercontent.com/Duc-python/claude-for-oss/main/badges/claude-ready.svg)](docs/awesome-agent-ready.md)

## Quick start

```bash
# in any git repo
npx claude-for-oss init
npx claude-for-oss check
```

Or install globally:

```bash
npm install -g claude-for-oss
cfo init
cfo refresh
cfo check
cfo pr          # requires GitHub CLI (`gh`)
```

## Orientation pack

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Stack, commands, where to look |
| `CLAUDE.md` | Pointer for Claude Code |
| `docs/agent/architecture.md` | Module map |
| `docs/agent/blast-radius.md` | Heuristic dependency hints |
| `docs/agent/pack.meta.json` | Structure hash for freshness |
| `.github/GOOD_FIRST_AGENT.md` | Issue template for agent-friendly work |
| `.claude/skills/orient/SKILL.md` | `/orient` skill |
| `.claude/skills/find-test/SKILL.md` | `/find-test` skill |

Schema: [`schema/pack.schema.json`](schema/pack.schema.json).

## CLI

```bash
cfo init [-C path] [--dry-run] [--no-claude-md]
cfo refresh [-C path] [--force] [--dry-run]
cfo check [-C path] [--json]          # exit 1 if stale
cfo pr [-C path] [--draft] [--base main]
```

## GitHub Action

Fail CI when the pack is missing or stale (e.g. after `package.json` / layout changes):

```yaml
- uses: actions/checkout@v4
- uses: <your-org>/claude-for-oss/action/check@main
  with:
    path: "."
    refresh-on-stale: "false"
```

This repo’s example workflow: [`.github/workflows/orientation-check.yml`](.github/workflows/orientation-check.yml).

## Validation (Phase 0)

```bash
npm run validate
```

Measures a discovery-cost proxy before/after pack generation on 10 fixtures (gate: ≥30% reduction on ≥6/10) and surveys popular public repos for existing `AGENTS.md` / `CLAUDE.md`.

## Develop

```bash
npm install
npm run build
npm test
npm run cfo -- init --dry-run
```

Requires Node.js ≥ 18.

## Adoption (Phase 3)

- Catalog of oriented repos: [`docs/awesome-agent-ready.md`](docs/awesome-agent-ready.md)
- Badge assets: [`badges/`](badges/)
- Keep CI green with [`.github/workflows/orientation-check.yml`](.github/workflows/orientation-check.yml)

## License

MIT
