# `claude-for-oss/check` composite action

Fails the job when the orientation pack is missing or stale.

## Usage

```yaml
- uses: actions/checkout@v4
- uses: ./action/check   # or owner/claude-for-oss/action/check@v0.1.0
  with:
    path: "."
    refresh-on-stale: "false"
```

### Inputs

| Name | Default | Description |
| --- | --- | --- |
| `path` | `.` | Repo path to check |
| `refresh-on-stale` | `false` | If `true`, run `cfo refresh --force` then re-check (does not commit) |

When used from this repository, the action builds the local CLI. When published, it falls back to `npm install -g claude-for-oss`.
