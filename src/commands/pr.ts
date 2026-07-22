import chalk from "chalk";
import { analyzeRepo } from "../analyze/repo.js";
import { checkFreshness } from "../freshness/hash.js";
import { generatePack } from "../generate/pack.js";
import { writePack } from "../generate/write.js";
import { runGh, runGit, whichGh } from "../util/shell.js";

export interface PrOptions {
  root: string;
  branch?: string;
  base?: string;
  title?: string;
  draft?: boolean;
  noClaudeMd?: boolean;
}

export function cmdPr(options: PrOptions): number {
  console.log(chalk.bold("claude-for-oss pr"));

  if (!whichGh()) {
    console.error(
      chalk.red(
        "GitHub CLI (`gh`) is required for `cfo pr`. Install: https://cli.github.com/",
      ),
    );
    console.error(
      "You can still run `cfo init` / `cfo refresh` and open a PR manually.",
    );
    return 1;
  }

  const freshness = checkFreshness(options.root);
  if (freshness.stale || !freshness.meta) {
    console.log(chalk.yellow("Pack missing or stale — regenerating…"));
    const signals = analyzeRepo(options.root);
    const pack = generatePack(signals, { writeClaudeMd: !options.noClaudeMd });
    writePack(options.root, pack);
  }

  const branch =
    options.branch ?? `claude-for-oss/orientation-${Date.now().toString(36)}`;
  const base = options.base ?? "main";
  const title =
    options.title ?? "chore: add Claude-for-OSS orientation pack";

  const checkout = runGit(["checkout", "-b", branch], options.root);
  if (!checkout.ok) {
    // maybe branch exists or detached — try create from current
    const alt = runGit(["checkout", "-B", branch], options.root);
    if (!alt.ok) {
      console.error(chalk.red(checkout.stderr || alt.stderr));
      return 1;
    }
  }

  runGit(["add", "AGENTS.md", "CLAUDE.md", "docs/agent", ".github/GOOD_FIRST_AGENT.md", ".claude/skills"], options.root);
  const commit = runGit(
    [
      "commit",
      "-m",
      "chore: add Claude-for-OSS orientation pack\n\nGenerated with claude-for-oss so coding agents can orient faster.",
    ],
    options.root,
  );
  if (!commit.ok && !/nothing to commit/i.test(commit.stderr + commit.stdout)) {
    console.error(chalk.red(commit.stderr || commit.stdout));
    return 1;
  }

  const push = runGit(["push", "-u", "origin", branch], options.root);
  if (!push.ok) {
    console.error(chalk.red(push.stderr || push.stdout));
    console.error(
      chalk.yellow(
        "Push failed — commit may still be local. Fix remote auth and push, then create a PR.",
      ),
    );
    return 1;
  }

  const body = `## Summary
- Adds a Claude-for-OSS **orientation pack** (\`AGENTS.md\`, \`docs/agent/*\`, skills) so coding agents (Claude Code, Cursor, OpenCode, …) can discover stack, commands, and layout without thrashing.

## Test plan
- [ ] Skim \`AGENTS.md\` commands — install/test look correct
- [ ] \`npx claude-for-oss check\` passes
- [ ] Optional: open agent session and confirm orientation is used
`;

  const args = [
    "pr",
    "create",
    "--title",
    title,
    "--body",
    body,
    "--base",
    base,
    "--head",
    branch,
  ];
  if (options.draft) args.push("--draft");

  const pr = runGh(args, options.root);
  if (!pr.ok) {
    console.error(chalk.red(pr.stderr || pr.stdout));
    return 1;
  }
  console.log(chalk.green(pr.stdout.trim() || "PR created."));
  return 0;
}
