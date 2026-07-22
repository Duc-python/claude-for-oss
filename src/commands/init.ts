import chalk from "chalk";
import { analyzeRepo, estimateDiscoveryCost } from "../analyze/repo.js";
import { generatePack } from "../generate/pack.js";
import { writePack } from "../generate/write.js";

export interface InitOptions {
  root: string;
  dryRun?: boolean;
  noClaudeMd?: boolean;
}

export function cmdInit(options: InitOptions): number {
  const signals = analyzeRepo(options.root);
  const before = estimateDiscoveryCost(signals);
  const pack = generatePack(signals, { writeClaudeMd: !options.noClaudeMd });

  console.log(chalk.bold("claude-for-oss init"));
  console.log(`Root: ${options.root}`);
  console.log(
    `Detected: ${signals.primaryLanguage ?? "?"} / ${signals.packageManager ?? "?"} / hash ${signals.structureHash}`,
  );
  console.log(
    `Discovery cost (before pack): ~${before.estimatedToolCalls} tool-calls, files: ${before.filesToOpen.join(", ") || "(none)"}`,
  );

  if (options.dryRun) {
    console.log(chalk.yellow("\nDry run — would write:"));
    for (const f of pack.files) console.log(`  ${f.relativePath}`);
    return 0;
  }

  const written = writePack(options.root, pack);
  console.log(chalk.green(`\nWrote ${written.length} files:`));
  for (const f of written) console.log(`  ${f}`);

  const afterSignals = analyzeRepo(options.root);
  const after = estimateDiscoveryCost(afterSignals);
  const reduction =
    before.estimatedToolCalls === 0
      ? 0
      : Math.round(
          (1 - after.estimatedToolCalls / before.estimatedToolCalls) * 100,
        );
  console.log(
    chalk.cyan(
      `\nEstimated discovery tool-calls after: ~${after.estimatedToolCalls} (${reduction}% reduction proxy)`,
    ),
  );
  return 0;
}
