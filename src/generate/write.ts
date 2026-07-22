import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { GeneratedPack } from "../schema/pack.js";

export function writePack(root: string, pack: GeneratedPack): string[] {
  const written: string[] = [];
  for (const file of pack.files) {
    const abs = join(root, file.relativePath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, file.content, "utf8");
    written.push(file.relativePath);
  }
  return written;
}
