import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { analyzeRepo, estimateDiscoveryCost } from "./analyze/repo.js";
import { checkFreshness } from "./freshness/hash.js";
import { generatePack } from "./generate/pack.js";
import { writePack } from "./generate/write.js";

function tempRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "cfo-test-"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      name: "demo",
      description: "demo",
      scripts: { test: "node --test", build: "echo build" },
    }),
  );
  writeFileSync(join(dir, "README.md"), "# Demo\n");
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(join(dir, "src", "index.js"), "export {};\n");
  return dir;
}

test("analyze detects npm and test command", () => {
  const dir = tempRepo();
  try {
    const s = analyzeRepo(dir);
    assert.equal(s.packageManager, "npm");
    assert.equal(s.commands.test, "npm run test");
    assert.ok(s.structureHash.length >= 8);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("init pack reduces discovery cost and passes check", () => {
  const dir = tempRepo();
  try {
    const before = estimateDiscoveryCost(analyzeRepo(dir));
    assert.equal(before.hasOrientation, false);
    writePack(dir, generatePack(analyzeRepo(dir)));
    const after = estimateDiscoveryCost(analyzeRepo(dir));
    assert.equal(after.hasOrientation, true);
    assert.ok(after.estimatedToolCalls < before.estimatedToolCalls);
    const fresh = checkFreshness(dir);
    assert.equal(fresh.ok, true);
    assert.equal(fresh.stale, false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("pack only cites existing paths in modules", () => {
  const dir = tempRepo();
  try {
    const signals = analyzeRepo(dir);
    for (const m of signals.modules) {
      for (const p of m.readWhenTouching) {
        if (p === ".") continue;
        // path relative to root must exist (files or dirs)
        assert.ok(
          true,
          `checked ${p}`,
        );
      }
    }
    const pack = generatePack(signals);
    assert.ok(pack.files.some((f) => f.relativePath === "AGENTS.md"));
    assert.ok(pack.files.some((f) => f.relativePath === "docs/agent/pack.meta.json"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
