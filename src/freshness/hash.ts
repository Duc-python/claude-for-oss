import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { computeStructureHash } from "../analyze/repo.js";
import { PACK_PATHS, type OrientationPackMeta } from "../schema/pack.js";

export interface FreshnessResult {
  ok: boolean;
  stale: boolean;
  reason?: string;
  currentHash: string;
  recordedHash?: string;
  metaPath: string;
  meta?: OrientationPackMeta;
}

export function readPackMeta(root: string): OrientationPackMeta | undefined {
  const path = join(root, PACK_PATHS.meta);
  if (!existsSync(path)) return undefined;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as OrientationPackMeta;
  } catch {
    return undefined;
  }
}

export function checkFreshness(root: string): FreshnessResult {
  const metaPath = PACK_PATHS.meta;
  const currentHash = computeStructureHash(root);
  const meta = readPackMeta(root);

  if (!meta) {
    const hasAgents =
      existsSync(join(root, PACK_PATHS.agents)) ||
      existsSync(join(root, PACK_PATHS.claude));
    return {
      ok: false,
      stale: true,
      reason: hasAgents
        ? "orientation docs exist but docs/agent/pack.meta.json is missing"
        : "no orientation pack found — run `cfo init`",
      currentHash,
      metaPath,
    };
  }

  if (meta.structureHash !== currentHash) {
    return {
      ok: false,
      stale: true,
      reason: `structure hash mismatch (recorded ${meta.structureHash}, current ${currentHash}) — run \`cfo refresh\``,
      currentHash,
      recordedHash: meta.structureHash,
      metaPath,
      meta,
    };
  }

  // Ensure core files still exist
  for (const rel of [PACK_PATHS.architecture, PACK_PATHS.blastRadius]) {
    if (!existsSync(join(root, rel))) {
      return {
        ok: false,
        stale: true,
        reason: `missing pack file: ${rel}`,
        currentHash,
        recordedHash: meta.structureHash,
        metaPath,
        meta,
      };
    }
  }

  if (
    !existsSync(join(root, PACK_PATHS.agents)) &&
    !existsSync(join(root, PACK_PATHS.claude))
  ) {
    return {
      ok: false,
      stale: true,
      reason: "missing AGENTS.md and CLAUDE.md",
      currentHash,
      recordedHash: meta.structureHash,
      metaPath,
      meta,
    };
  }

  return {
    ok: true,
    stale: false,
    currentHash,
    recordedHash: meta.structureHash,
    metaPath,
    meta,
  };
}
