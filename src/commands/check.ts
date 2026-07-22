import chalk from "chalk";
import { checkFreshness } from "../freshness/hash.js";

export interface CheckOptions {
  root: string;
  json?: boolean;
}

export function cmdCheck(options: CheckOptions): number {
  const result = checkFreshness(options.root);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(chalk.bold("claude-for-oss check"));
    console.log(`Hash: ${result.currentHash}`);
    if (result.recordedHash) console.log(`Recorded: ${result.recordedHash}`);
    if (result.ok) {
      console.log(chalk.green("OK — orientation pack is fresh."));
    } else {
      console.log(chalk.red(`STALE — ${result.reason}`));
    }
  }

  return result.ok ? 0 : 1;
}
