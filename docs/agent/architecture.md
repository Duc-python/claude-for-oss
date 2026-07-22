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

The package is not on the public npm registry yet (npm publish requires 2FA). Install from **GitHub** instead:

```bash
# one-shot (recommended)
npx -y --package=github:Duc-python/claude-for-oss#main cfo init
npx -y --package=github:Duc-python/claude-for-oss#main cfo check

# or install globally from GitHub
npm install -g github:Duc-python/claude-for-oss#main
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
| `.claude/skills
```
