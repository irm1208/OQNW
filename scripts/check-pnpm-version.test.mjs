import assert from "node:assert/strict";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import test from "node:test";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptsDir, "..");
const checkScriptPath = join(scriptsDir, "check-pnpm-version.mjs");
const packageMetadata = JSON.parse(
  readFileSync(join(rootDir, "package.json"), "utf8"),
);
const declaredVersion = packageMetadata.packageManager.match(
  /^pnpm@([^+]+)(?:\+.*)?$/,
)?.[1];

assert.ok(declaredVersion, "The root package.json must declare a pnpm version");

function runCheckWithActivePnpmVersion(activeVersion) {
  const fakePnpmDir = mkdtempSync(join(tmpdir(), "check-pnpm-version-"));
  const fakePnpmPath = join(
    fakePnpmDir,
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  );

  if (process.platform === "win32") {
    writeFileSync(fakePnpmPath, `@echo off\r\necho ${activeVersion}\r\n`);
  } else {
    writeFileSync(
      fakePnpmPath,
      `#!/usr/bin/env node\nconsole.log(${JSON.stringify(activeVersion)});\n`,
    );
    chmodSync(fakePnpmPath, 0o755);
  }

  try {
    const path = [fakePnpmDir, process.env.PATH]
      .filter(Boolean)
      .join(delimiter);
    const result = spawnSync(process.execPath, [checkScriptPath], {
      cwd: rootDir,
      encoding: "utf8",
      env: { ...process.env, PATH: path },
    });

    if (result.error) {
      throw result.error;
    }

    return result;
  } finally {
    rmSync(fakePnpmDir, { recursive: true, force: true });
  }
}

test("accepts the pnpm version declared by the root package metadata", () => {
  const result = runCheckWithActivePnpmVersion(declaredVersion);

  assert.equal(result.status, 0, result.stderr);
  assert.ok(
    result.stdout.includes(
      `Using the supported pnpm@${declaredVersion} for dependency security checks.`,
    ),
  );
});

test("rejects a mismatched pnpm version with declared-version remediation", () => {
  const mismatchedVersion =
    declaredVersion === "0.0.0" ? "999.999.999" : "0.0.0";
  const result = runCheckWithActivePnpmVersion(mismatchedVersion);

  assert.notEqual(result.status, 0);
  assert.ok(
    result.stderr.includes(
      `Dependency security checks require pnpm@${declaredVersion}, but the active pnpm is ${mismatchedVersion}.`,
    ),
  );
  assert.ok(
    result.stderr.includes(
      `Install or activate pnpm@${declaredVersion}, then rerun pnpm run check:security.`,
    ),
  );
});
