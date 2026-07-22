#!/usr/bin/env node
import { resolve } from "node:path";
import { Command } from "commander";
import { cmdCheck } from "./commands/check.js";
import { cmdInit } from "./commands/init.js";
import { cmdPr } from "./commands/pr.js";
import { cmdRefresh } from "./commands/refresh.js";

const program = new Command();

program
  .name("claude-for-oss")
  .description(
    "Make open-source repos agent-ready: generate & refresh orientation packs",
  )
  .version("0.1.1");

program
  .command("init")
  .description("Analyze the repo and write an orientation pack")
  .option("-C, --cwd <path>", "repository root", ".")
  .option("--dry-run", "print files without writing", false)
  .option("--no-claude-md", "do not write CLAUDE.md pointer")
  .action((opts: { cwd: string; dryRun?: boolean; claudeMd?: boolean }) => {
    const code = cmdInit({
      root: resolve(opts.cwd),
      dryRun: opts.dryRun,
      noClaudeMd: opts.claudeMd === false,
    });
    process.exitCode = code;
  });

program
  .command("refresh")
  .description("Regenerate the pack when structure is stale")
  .option("-C, --cwd <path>", "repository root", ".")
  .option("--force", "regenerate even if fresh", false)
  .option("--dry-run", "print files without writing", false)
  .option("--no-claude-md", "do not write CLAUDE.md pointer")
  .action(
    (opts: {
      cwd: string;
      force?: boolean;
      dryRun?: boolean;
      claudeMd?: boolean;
    }) => {
      const code = cmdRefresh({
        root: resolve(opts.cwd),
        force: opts.force,
        dryRun: opts.dryRun,
        noClaudeMd: opts.claudeMd === false,
      });
      process.exitCode = code;
    },
  );

program
  .command("check")
  .description("Exit 0 if pack is fresh; 1 if stale (for CI)")
  .option("-C, --cwd <path>", "repository root", ".")
  .option("--json", "print JSON result", false)
  .action((opts: { cwd: string; json?: boolean }) => {
    const code = cmdCheck({ root: resolve(opts.cwd), json: opts.json });
    process.exitCode = code;
  });

program
  .command("pr")
  .description("Commit orientation pack and open a GitHub PR via gh")
  .option("-C, --cwd <path>", "repository root", ".")
  .option("--branch <name>", "branch name")
  .option("--base <name>", "base branch", "main")
  .option("--title <title>", "PR title")
  .option("--draft", "open as draft PR", false)
  .option("--no-claude-md", "do not write CLAUDE.md pointer")
  .action(
    (opts: {
      cwd: string;
      branch?: string;
      base?: string;
      title?: string;
      draft?: boolean;
      claudeMd?: boolean;
    }) => {
      const code = cmdPr({
        root: resolve(opts.cwd),
        branch: opts.branch,
        base: opts.base,
        title: opts.title,
        draft: opts.draft,
        noClaudeMd: opts.claudeMd === false,
      });
      process.exitCode = code;
    },
  );

program.parse();
