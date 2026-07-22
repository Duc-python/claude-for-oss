# Architecture map (agent)

Generated for agents exploring this repo. Only lists paths that existed when the pack was built.

## Top-level layout

| Path | Role |
| --- | --- |
| `.claude/` | top-level directory |
| `.github/` | top-level directory |
| `action/` | top-level directory |
| `badges/` | top-level directory |
| `docs/` | documentation |
| `schema/` | top-level directory |
| `src/` | primary source |
| `validation/` | top-level directory |

## Notable files

- [`README.md`](../../README.md)
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
- [`package.json`](../../package.json)
- [`tsconfig.json`](../../tsconfig.json)

## Touch guide

### `docs`

Role: documentation

When editing here, also read: `docs`, `README.md`, `AGENTS.md`, `package.json`

### `src`

Role: primary source

When editing here, also read: `src`, `README.md`, `AGENTS.md`, `package.json`, `docs`

## README excerpt

```
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
cfo init [-C path] [--dry-run] [--no-claude
```
