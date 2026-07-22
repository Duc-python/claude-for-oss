import chalk from "chalk";
import { analyzeRepo } from "../analyze/repo.js";
import { checkFreshness } from "../freshness/hash.js";
import { generatePack } from "../generate/pack.js";
import { writePack } from "../generate/write.js";

export interface RefreshOptions {
  root: string;
  force?: boolean;
  dryRun?: boolean;
  noClaudeMd?: boolean;
}

export function cmdRefresh(options: RefreshOptions): number {
  const freshness = checkFreshness(options.root);
  console.log(chalk.bold("claude-for-oss refresh"));

  if (!freshness.stale && !options.force) {
    console.log(
      chalk.green(
        `Pack is fresh (hash ${freshness.currentHash}). Use --force to regenerate.`,
      ),
    );
    return 0;
  }

  if (freshness.stale) {
    console.log(chalk.yellow(`Stale: ${freshness.reason}`));
  }

  const signals = analyzeRepo(options.root);
  const pack = generatePack(signals, { writeClaudeMd: !options.noClaudeMd });

  if (options.dryRun) {
    console.log(chalk.yellow("Dry run — would write:"));
    for (const f of pack.files) console.log(`  ${f.relativePath}`);
    return 0;
  }

  const written = writePack(options.root, pack);
  console.log(chalk.green(`Refreshed ${written.length} files (hash ${signals.structureHash})`));
  return 0;
}
