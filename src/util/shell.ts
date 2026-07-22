import { spawnSync } from "node:child_process";

export function whichGh(): string | undefined {
  const r = spawnSync("bash", ["-lc", "command -v gh"], { encoding: "utf8" });
  const path = r.stdout?.trim();
  return path || undefined;
}

export function runGh(
  args: string[],
  cwd: string,
): { ok: boolean; stdout: string; stderr: string; status: number | null } {
  const gh = whichGh();
  if (!gh) {
    return {
      ok: false,
      stdout: "",
      stderr:
        "GitHub CLI (`gh`) not found. Install https://cli.github.com/ then re-run.",
      status: 127,
    };
  }
  const r = spawnSync(gh, args, { cwd, encoding: "utf8" });
  return {
    ok: r.status === 0,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
    status: r.status,
  };
}

export function runGit(
  args: string[],
  cwd: string,
): { ok: boolean; stdout: string; stderr: string } {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return {
    ok: r.status === 0,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
  };
}
