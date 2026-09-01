import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = resolve(rootDir, "package.json");

let packageMetadata;
try {
  packageMetadata = JSON.parse(readFileSync(packageJsonPath, "utf8"));
} catch (error) {
  console.error(`Unable to read the root package metadata at ${packageJsonPath}.`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const packageManager = packageMetadata.packageManager;
const packageManagerMatch =
  typeof packageManager === "string" &&
  /^pnpm@([^+]+)(?:\+.*)?$/.exec(packageManager);

if (!packageManagerMatch) {
  console.error(
    'The root package.json must declare the supported pnpm release as "packageManager": "pnpm@<version>".',
  );
  process.exit(1);
}

const expectedVersion = packageManagerMatch[1];
let activeVersion;
try {
  activeVersion = execFileSync("pnpm", ["--version"], {
    cwd: rootDir,
    encoding: "utf8",
  }).trim();
} catch (error) {
  console.error(
    `Unable to determine the active pnpm version. Install or activate pnpm@${expectedVersion}, then rerun pnpm run check:security.`,
  );
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (activeVersion !== expectedVersion) {
  console.error(
    `Dependency security checks require pnpm@${expectedVersion}, but the active pnpm is ${activeVersion || "unknown"}.`,
  );
  console.error(
    `Install or activate pnpm@${expectedVersion}, then rerun pnpm run check:security.`,
  );
  process.exit(1);
}

console.log(`Using the supported pnpm@${expectedVersion} for dependency security checks.`);