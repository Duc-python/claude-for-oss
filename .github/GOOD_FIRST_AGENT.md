# Good first agent issue template

Use this template when filing issues intended for AI coding agents **and** human newcomers.

## Title

`[good-first-agent] <short outcome>`

## Goal

One concrete, verifiable outcome (e.g. "Fix typo in README install section", "Add unit test for X").

## Acceptance criteria

- [ ] Behavior or docs match the goal
- [ ] Tests pass: `npm run test`
- [ ] Diff stays scoped (avoid drive-by refactors)

## Suggested starting points

- `docs/` (documentation)
- `src/` (primary source)

## Out of scope

- Dependency major upgrades
- Unrelated formatting of the whole tree
- New features without a linked design note

## References

- Orientation: `AGENTS.md`
- Architecture: `docs/agent/architecture.md`
