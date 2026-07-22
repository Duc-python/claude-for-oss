/**
 * Orientation Pack schema — shared TypeScript types + JSON Schema mirror.
 * Paths cited in generated docs must exist on disk at generation time.
 */

export const PACK_VERSION = "1.0.0" as const;

/** Files that make up a Claude-for-OSS orientation pack */
export const PACK_PATHS = {
  agents: "AGENTS.md",
  claude: "CLAUDE.md",
  architecture: "docs/agent/architecture.md",
  blastRadius: "docs/agent/blast-radius.md",
  goodFirstAgent: ".github/GOOD_FIRST_AGENT.md",
  meta: "docs/agent/pack.meta.json",
  skillOrient: ".claude/skills/orient/SKILL.md",
  skillFindTest: ".claude/skills/find-test/SKILL.md",
} as const;

export type PackPathKey = keyof typeof PACK_PATHS;

export interface PackCommands {
  install?: string;
  build?: string;
  test?: string;
  lint?: string;
  typecheck?: string;
  dev?: string;
}

export interface PackModule {
  /** Directory or entry path that exists in the repo */
  path: string;
  role: string;
  /** Related paths an agent should read when touching this module */
  readWhenTouching: string[];
}

export interface BlastEdge {
  from: string;
  to: string;
  via?: string;
}

export interface OrientationPackMeta {
  packVersion: typeof PACK_VERSION | string;
  generatedAt: string;
  generator: string;
  /** Hash of structural signals used for staleness checks */
  structureHash: string;
  root: string;
  primaryLanguage?: string;
  packageManager?: string;
  commands: PackCommands;
  topLevelDirs: string[];
  ciWorkflows: string[];
}

export interface OrientationSignals {
  root: string;
  name?: string;
  description?: string;
  primaryLanguage?: string;
  languages: Record<string, number>;
  packageManager?: string;
  commands: PackCommands;
  topLevelDirs: string[];
  notableFiles: string[];
  ciWorkflows: Array<{ path: string; name?: string; jobs: string[] }>;
  modules: PackModule[];
  blastEdges: BlastEdge[];
  readmeExcerpt?: string;
  hasAgentsMd: boolean;
  hasClaudeMd: boolean;
  structureHash: string;
}

export interface GeneratedPackFile {
  relativePath: string;
  content: string;
}

export interface GeneratedPack {
  meta: OrientationPackMeta;
  files: GeneratedPackFile[];
}
