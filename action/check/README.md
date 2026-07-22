# `claude-for-oss/check` composite action

Fails the job when the orientation pack is missing or stale.

## Usage

```yaml
- uses: actions/checkout@v4
- uses: Duc-python/claude-for-oss/action/check@main
  with:
    path: "."
    refresh-on-stale: "false"
```

In this repository you can also reference the local action:

```yaml
- uses: ./action/check
```

The action resolves the package root from `action/check`, builds the local CLI when source is present, and otherwise installs from `github:Duc-python/claude-for-oss#main`.

### Inputs

| Name | Default | Description |
| --- | --- | --- |
| `path` | `.` | Repository path to check |
| `refresh-on-stale` | `false` | If `true`, run `cfo refresh --force` then re-check (does not commit) |
