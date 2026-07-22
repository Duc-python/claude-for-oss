# Orientation Pack Specification

Version: **1.0.0** (see `packVersion` in `docs/agent/pack.meta.json`)

Machine-readable meta schema: [`schema/pack.schema.json`](../../schema/pack.schema.json).

## Required files

| Path | Required | Description |
| --- | --- | --- |
| `AGENTS.md` | yes* | Primary agent orientation (stack, commands, where to look) |
| `CLAUDE.md` | recommended | Short pointer for Claude Code; may be omitted with `--no-claude-md` |
| `docs/agent/architecture.md` | yes | Module / top-level map with verified paths |
| `docs/agent/blast-radius.md` | yes | Best-effort static dependency hints |
| `docs/agent/pack.meta.json` | yes | Generator metadata + `structureHash` for freshness |
| `.github/GOOD_FIRST_AGENT.md` | yes | Template for agent-friendly issues |
| `.claude/skills/orient/SKILL.md` | yes | Portable `/orient` skill |
| `.claude/skills/find-test/SKILL.md` | yes | Portable `/find-test` skill |

\* At least one of `AGENTS.md` or `CLAUDE.md` must exist; generator always writes `AGENTS.md`.

## `pack.meta.json` fields

- `packVersion` — semver of this spec
- `generatedAt` — ISO-8601 timestamp
- `generator` — tool id/version
- `structureHash` — 16-char hex of structural signals (manifests, key dirs, CI workflows). **Excludes** pack output files so `init` does not stale itself
- `commands` — install/build/test/lint/typecheck/dev when detected
- `topLevelDirs`, `ciWorkflows`, `primaryLanguage`, `packageManager`

## Path integrity rule

Generators must only cite paths that existed at generation time (or `.` for root). Prefer links to real files over prose guesses.

## Freshness

`cfo check` compares current `structureHash` to `pack.meta.json`. CI should fail on mismatch so maintainers run `cfo refresh`.
