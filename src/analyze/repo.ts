import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import type {
  BlastEdge,
  OrientationSignals,
  PackCommands,
  PackModule,
} from "../schema/pack.js";

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  "vendor",
  "__pycache__",
  ".venv",
  "venv",
  "target",
]);

const LANG_BY_EXT: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".py": "Python",
  ".go": "Go",
  ".rs": "Rust",
  ".java": "Java",
  ".kt": "Kotlin",
  ".rb": "Ruby",
  ".php": "PHP",
  ".cs": "C#",
  ".cpp": "C++",
  ".c": "C",
  ".swift": "Swift",
  ".scala": "Scala",
};

function safeRead(path: string, max = 64_000): string | undefined {
  try {
    if (!existsSync(path)) return undefined;
    return readFileSync(path, "utf8").slice(0, max);
  } catch {
    return undefined;
  }
}

function listTopLevel(root: string): { dirs: string[]; files: string[] } {
  const entries = readdirSync(root, { withFileTypes: true });
  const dirs: string[] = [];
  const files: string[] = [];
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".github" && e.name !== ".claude") {
      continue;
    }
    if (IGNORE_DIRS.has(e.name)) continue;
    if (e.isDirectory()) dirs.push(e.name);
    else files.push(e.name);
  }
  return { dirs: dirs.sort(), files: files.sort() };
}

function walkFiles(root: string, maxFiles = 4000): string[] {
  const out: string[] = [];
  const stack = [root];
  while (stack.length && out.length < maxFiles) {
    const dir = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (IGNORE_DIRS.has(e.name)) continue;
      if (e.name === ".git") continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith(".") && e.name !== ".github" && e.name !== ".claude") {
          continue;
        }
        stack.push(full);
      } else if (e.isFile()) {
        out.push(relative(root, full).replace(/\\/g, "/"));
      }
    }
  }
  return out;
}

function detectPackageManager(root: string, files: Set<string>): string | undefined {
  if (files.has("pnpm-lock.yaml")) return "pnpm";
  if (files.has("yarn.lock")) return "yarn";
  if (files.has("bun.lockb") || files.has("bun.lock")) return "bun";
  if (files.has("package-lock.json") || files.has("package.json")) return "npm";
  if (files.has("poetry.lock") || files.has("pyproject.toml")) return "poetry/pip";
  if (files.has("Cargo.toml")) return "cargo";
  if (files.has("go.mod")) return "go";
  if (files.has("Gemfile")) return "bundler";
  if (existsSync(join(root, "requirements.txt"))) return "pip";
  return undefined;
}

function detectCommands(
  root: string,
  packageManager?: string,
): PackCommands {
  const commands: PackCommands = {};
  const pkgRaw = safeRead(join(root, "package.json"));
  if (pkgRaw) {
    try {
      const pkg = JSON.parse(pkgRaw) as {
        scripts?: Record<string, string>;
      };
      const scripts = pkg.scripts ?? {};
      const run =
        packageManager === "pnpm"
          ? "pnpm"
          : packageManager === "yarn"
            ? "yarn"
            : packageManager === "bun"
              ? "bun run"
              : "npm run";
      const install =
        packageManager === "pnpm"
          ? "pnpm install"
          : packageManager === "yarn"
            ? "yarn"
            : packageManager === "bun"
              ? "bun install"
              : "npm install";
      commands.install = install;
      if (scripts.test) commands.test = `${run} test`;
      if (scripts.build) commands.build = `${run} build`;
      if (scripts.lint) commands.lint = `${run} lint`;
      if (scripts.typecheck || scripts["type-check"]) {
        commands.typecheck = `${run} ${scripts.typecheck ? "typecheck" : "type-check"}`;
      }
      if (scripts.dev) commands.dev = `${run} dev`;
    } catch {
      /* ignore */
    }
  }

  if (existsSync(join(root, "Cargo.toml"))) {
    commands.build ??= "cargo build";
    commands.test ??= "cargo test";
  }
  if (existsSync(join(root, "go.mod"))) {
    commands.build ??= "go build ./...";
    commands.test ??= "go test ./...";
  }
  if (existsSync(join(root, "pyproject.toml")) || existsSync(join(root, "pytest.ini"))) {
    commands.test ??= "pytest";
  }
  if (existsSync(join(root, "Makefile"))) {
    const make = safeRead(join(root, "Makefile")) ?? "";
    if (/\btest\b/.test(make)) commands.test ??= "make test";
    if (/\bbuild\b/.test(make)) commands.build ??= "make build";
  }
  return commands;
}

function detectLanguages(relFiles: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of relFiles) {
    const dot = f.lastIndexOf(".");
    if (dot < 0) continue;
    const ext = f.slice(dot).toLowerCase();
    const lang = LANG_BY_EXT[ext];
    if (!lang) continue;
    counts[lang] = (counts[lang] ?? 0) + 1;
  }
  return counts;
}

function primaryLanguage(counts: Record<string, number>): string | undefined {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0];
}

function parseCiWorkflows(
  root: string,
): Array<{ path: string; name?: string; jobs: string[] }> {
  const dir = join(root, ".github", "workflows");
  if (!existsSync(dir)) return [];
  const out: Array<{ path: string; name?: string; jobs: string[] }> = [];
  for (const name of readdirSync(dir)) {
    if (!/\.ya?ml$/i.test(name)) continue;
    const path = join(dir, name);
    const rel = `.github/workflows/${name}`;
    const raw = safeRead(path);
    if (!raw) continue;
    try {
      const doc = parseYaml(raw) as {
        name?: string;
        jobs?: Record<string, unknown>;
      };
      out.push({
        path: rel,
        name: typeof doc.name === "string" ? doc.name : name,
        jobs: doc.jobs ? Object.keys(doc.jobs) : [],
      });
    } catch {
      out.push({ path: rel, jobs: [] });
    }
  }
  return out;
}

function buildModules(root: string, topDirs: string[]): PackModule[] {
  const modules: PackModule[] = [];
  const candidates = [
    "src",
    "lib",
    "app",
    "pkg",
    "cmd",
    "internal",
    "packages",
    "apps",
    "docs",
    "test",
    "tests",
    "__tests__",
  ];
  for (const dir of topDirs) {
    if (!candidates.includes(dir) && !dir.endsWith("-service")) continue;
    const path = dir;
    const readWhenTouching = [path];
    for (const sibling of ["README.md", "AGENTS.md", "package.json", "Cargo.toml", "go.mod"]) {
      const p = join(root, sibling);
      if (existsSync(p)) readWhenTouching.push(sibling);
    }
    if (existsSync(join(root, "docs"))) readWhenTouching.push("docs");
    modules.push({
      path,
      role: inferRole(dir),
      readWhenTouching: [...new Set(readWhenTouching)],
    });
  }
  if (modules.length === 0 && existsSync(join(root, "package.json"))) {
    modules.push({
      path: ".",
      role: "project root",
      readWhenTouching: ["package.json", "README.md"].filter((f) =>
        existsSync(join(root, f)),
      ),
    });
  }
  return modules;
}

function inferRole(dir: string): string {
  const map: Record<string, string> = {
    src: "primary source",
    lib: "library code",
    app: "application entry / UI",
    pkg: "Go packages",
    cmd: "CLI entrypoints",
    internal: "private packages",
    packages: "monorepo packages",
    apps: "monorepo apps",
    docs: "documentation",
    test: "tests",
    tests: "tests",
    __tests__: "tests",
  };
  return map[dir] ?? "module";
}

function buildBlastEdges(root: string, modules: PackModule[]): BlastEdge[] {
  const edges: BlastEdge[] = [];
  const hasSrc = modules.some((m) => m.path === "src");
  const hasTest = modules.some((m) => m.path === "test" || m.path === "tests");
  if (hasSrc && hasTest) {
    edges.push({
      from: "src",
      to: modules.find((m) => m.path === "test" || m.path === "tests")!.path,
      via: "unit/integration tests",
    });
  }
  if (existsSync(join(root, "package.json")) && hasSrc) {
    edges.push({ from: "package.json", to: "src", via: "scripts & deps" });
  }
  if (existsSync(join(root, ".github/workflows"))) {
    edges.push({
      from: ".github/workflows",
      to: hasSrc ? "src" : ".",
      via: "CI runs build/test",
    });
  }
  // Import-ish hints from package.json workspaces
  const pkgRaw = safeRead(join(root, "package.json"));
  if (pkgRaw) {
    try {
      const pkg = JSON.parse(pkgRaw) as { workspaces?: string[] | { packages?: string[] } };
      const ws = Array.isArray(pkg.workspaces)
        ? pkg.workspaces
        : pkg.workspaces?.packages ?? [];
      for (const w of ws.slice(0, 12)) {
        const clean = w.replace(/\/\*$/, "");
        if (existsSync(join(root, clean))) {
          edges.push({ from: clean, to: "package.json", via: "workspace" });
        }
      }
    } catch {
      /* ignore */
    }
  }
  return edges;
}

export function computeStructureHash(root: string): string {
  const parts: string[] = [];

  // Stable structural signals only — never include orientation pack outputs
  // (AGENTS.md, CLAUDE.md, docs/agent/*, .claude/skills/*, .github/GOOD_FIRST_AGENT.md).
  const interestDirs = [
    "src",
    "lib",
    "app",
    "apps",
    "packages",
    "pkg",
    "cmd",
    "internal",
    "test",
    "tests",
    "__tests__",
  ];
  for (const d of interestDirs) {
    parts.push(`dir:${d}:${existsSync(join(root, d)) ? "1" : "0"}`);
  }

  for (const f of [
    "package.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json",
    "bun.lock",
    "bun.lockb",
    "Cargo.toml",
    "go.mod",
    "pyproject.toml",
    "Makefile",
    "README.md",
    "tsconfig.json",
  ]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    try {
      const st = statSync(p);
      parts.push(`${f}:${st.size}`);
    } catch {
      parts.push(`${f}:missing`);
    }
  }

  const wf = join(root, ".github", "workflows");
  if (existsSync(wf)) {
    for (const name of readdirSync(wf).sort()) {
      if (!/\.ya?ml$/i.test(name)) continue;
      const p = join(wf, name);
      try {
        const st = statSync(p);
        parts.push(`wf:${name}:${st.size}`);
      } catch {
        /* ignore */
      }
    }
  }
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

export function analyzeRepo(root: string): OrientationSignals {
  const abs = root;
  const { dirs, files } = listTopLevel(abs);
  const fileSet = new Set(files);
  const allRel = walkFiles(abs);
  const languages = detectLanguages(allRel);
  const packageManager = detectPackageManager(abs, fileSet);
  const commands = detectCommands(abs, packageManager);
  const ciWorkflows = parseCiWorkflows(abs);
  const modules = buildModules(abs, dirs);
  const blastEdges = buildBlastEdges(abs, modules);

  let name: string | undefined;
  let description: string | undefined;
  const pkgRaw = safeRead(join(abs, "package.json"));
  if (pkgRaw) {
    try {
      const pkg = JSON.parse(pkgRaw) as { name?: string; description?: string };
      name = pkg.name;
      description = pkg.description;
    } catch {
      /* ignore */
    }
  }

  const notableFiles = [
    "README.md",
    "CONTRIBUTING.md",
    "package.json",
    "tsconfig.json",
    "Cargo.toml",
    "go.mod",
    "pyproject.toml",
    "Makefile",
    "Dockerfile",
  ].filter((f) => existsSync(join(abs, f)));

  const readme = safeRead(join(abs, "README.md"), 4000);

  return {
    root: abs,
    name,
    description,
    primaryLanguage: primaryLanguage(languages),
    languages,
    packageManager,
    commands,
    topLevelDirs: dirs,
    notableFiles,
    ciWorkflows,
    modules,
    blastEdges,
    readmeExcerpt: readme,
    hasAgentsMd: existsSync(join(abs, "AGENTS.md")),
    hasClaudeMd: existsSync(join(abs, "CLAUDE.md")),
    structureHash: computeStructureHash(abs),
  };
}

/** Proxy for how many discovery steps an agent needs without orientation */
export function estimateDiscoveryCost(signals: OrientationSignals): {
  filesToOpen: string[];
  estimatedToolCalls: number;
  hasOrientation: boolean;
} {
  const filesToOpen: string[] = [];
  if (!signals.hasAgentsMd && !signals.hasClaudeMd) {
    filesToOpen.push("README.md");
    if (signals.notableFiles.includes("CONTRIBUTING.md")) {
      filesToOpen.push("CONTRIBUTING.md");
    }
    if (signals.notableFiles.includes("package.json")) {
      filesToOpen.push("package.json");
    }
    filesToOpen.push(...signals.ciWorkflows.map((w) => w.path).slice(0, 3));
    filesToOpen.push(...signals.topLevelDirs.slice(0, 6).map((d) => `${d}/`));
  } else {
    if (signals.hasAgentsMd) filesToOpen.push("AGENTS.md");
    if (signals.hasClaudeMd) filesToOpen.push("CLAUDE.md");
    filesToOpen.push("docs/agent/architecture.md");
  }
  const unique = [...new Set(filesToOpen)];
  const hasOrientation = signals.hasAgentsMd || signals.hasClaudeMd;
  // Without orientation: more glob/grep thrash
  const estimatedToolCalls = hasOrientation
    ? unique.length + 2
    : unique.length + 8 + Math.min(signals.topLevelDirs.length, 10);
  return { filesToOpen: unique, estimatedToolCalls, hasOrientation };
}
