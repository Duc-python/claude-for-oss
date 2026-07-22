# `claude-for-oss/check` composite action

Fails the job when the orientation pack is missing or stale.

## Usage (this repo)

```yaml
- uses: actions/checkout@v4
- uses: ./action/check
  with:
    path: "."
    refresh-on-stale: "false"
```

## Usage (other repos)

Until the package is on npm:

```yaml
- uses: actions/checkout@v4
- uses: Duc-python/claude-for-oss/action/check@main
  with:
    path: "."
```

The action walks up from `action/check` to find `package.json` + `src/cli.ts`, builds locally when present, otherwise installs from `github:Duc-python/claude-for-oss#main`.

### Inputs

| Name | Default | Description |
| --- | --- | --- |
| `path` | `.` | Repo path to check |
| `refresh-on-stale` | `false` | If `true`, run `cfo refresh --force` then re-check (does not commit) |
