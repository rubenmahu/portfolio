// PreToolUse hook (Bash): runs `npm run build` before a commit, push or PR is
// created. Skips the build when nothing that affects it changed since the
// last successful one. Exit code 2 blocks the command and shows the error.
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const DELIVERY = /\bgit\s+(commit|push)\b|\bgh\s+pr\s+create\b/;
const STAMP = ".next/build-gate-stamp";
const BUILD_INPUTS = [
  "src",
  "content",
  "public",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
];

function readCommand() {
  try {
    return JSON.parse(readFileSync(0, "utf8")).tool_input?.command ?? "";
  } catch {
    return "";
  }
}

function fingerprint() {
  const files = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", ...BUILD_INPUTS],
    { encoding: "utf8" },
  )
    .split("\0")
    .filter((file) => file && existsSync(file))
    .sort();

  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file).update(readFileSync(file));
  }
  return hash.digest("hex");
}

if (!DELIVERY.test(readCommand())) {
  process.exit(0);
}

process.chdir(process.env.CLAUDE_PROJECT_DIR ?? process.cwd());

const current = fingerprint();
const previous = existsSync(STAMP) ? readFileSync(STAMP, "utf8") : "";

if (current === previous) {
  process.exit(0);
}

const build = spawnSync("npm", ["run", "build"], {
  encoding: "utf8",
  env: { ...process.env, NODE_ENV: "production" },
  shell: true,
});

if (build.status !== 0) {
  const output = `${build.stdout}\n${build.stderr}`.trim().split("\n").slice(-40);
  console.error("npm run build failed. Fix it before this command can run.\n");
  console.error(output.join("\n"));
  process.exit(2);
}

mkdirSync(".next", { recursive: true });
writeFileSync(STAMP, current);
