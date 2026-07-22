# Blast radius hints (best-effort)

Static, heuristic dependency hints for agents. **Not** a full call graph — verify before large refactors.

| From | To | Via |
| --- | --- | --- |
| `package.json` | `src` | scripts & deps |
| `.github/workflows` | `src` | CI runs build/test |

## Rules of thumb

1. Changing CI workflows (`.github/workflows`) may affect every package's required checks.
2. Changing root manifests (`package.json`, `Cargo.toml`, `go.mod`) can invalidate install/build assumptions in AGENTS.md — run `cfo refresh`.
3. Prefer tests closest to the module you edit.
