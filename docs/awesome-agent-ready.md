# Awesome Agent-Ready Repos

Open-source repositories that ship a [Claude-for-OSS](https://github.com/Duc-python/claude-for-oss) **orientation pack** (`AGENTS.md`, `docs/agent/*`, freshness meta) so coding agents can orient without thrashing.

## Badge

Add to your README:

```markdown
[![agent-oriented](https://raw.githubusercontent.com/Duc-python/claude-for-oss/main/badges/agent-oriented.svg)](https://github.com/Duc-python/claude-for-oss)
[![Claude-ready](https://raw.githubusercontent.com/Duc-python/claude-for-oss/main/badges/claude-ready.svg)](https://github.com/Duc-python/claude-for-oss)
```

Or shields.io style:

```markdown
[![agent-oriented](https://img.shields.io/badge/agent--oriented-yes-0A7)](https://github.com/Duc-python/claude-for-oss)
[![Claude-ready](https://img.shields.io/badge/Claude--ready-OSS-D97706)](https://github.com/Duc-python/claude-for-oss)
```

## How to get listed

1. `npx claude-for-oss init`
2. Merge the orientation pack (and keep it fresh with `cfo check` in CI)
3. Open an issue/PR on [claude-for-oss](https://github.com/Duc-python/claude-for-oss) adding your repo below

## Catalog

| Repository | Notes |
| --- | --- |
| [Duc-python/claude-for-oss](https://github.com/Duc-python/claude-for-oss) | Reference implementation + CLI |
| [Duc-python/Tool-check-vnc](https://github.com/Duc-python/Tool-check-vnc) | Orientation pack PR (Phase 3) |
| [Duc-python/Private](https://github.com/Duc-python/Private) | Orientation pack PR (Phase 3) |
| [Duc-python/T-i-file-telegeram-](https://github.com/Duc-python/T-i-file-telegeram-) | Orientation pack PR (Phase 3) |

## Maintain freshness

```bash
npx claude-for-oss check
npx claude-for-oss refresh   # when structure drifts
```
