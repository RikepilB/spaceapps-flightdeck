#!/usr/bin/env node
/**
 * Regression test for the validator itself.
 *
 * v0.4.0 shipped nine agents whose frontmatter did not parse as YAML, and the
 * validator gave all of them a green tick — it checked that `model:` and `color:`
 * appeared somewhere in the block, never that the block was valid. The loader
 * rejected every one.
 *
 * So: a validator that only passes on good input is untested. This reintroduces the
 * exact defect into a throwaway copy and asserts the validator rejects it.
 *
 *   node scripts/test-validator.mjs
 */
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const work = mkdtempSync(join(tmpdir(), "harness-vtest-"));
let failures = 0;

const check = (label, ok, detail = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures += 1;
};

/** Run the validator in `cwd`; return its exit code and combined output. */
function runValidator(cwd) {
  try {
    // Capture stderr too, so the child validator's expected FAIL lines do not
    // leak into this test's output and read as if the test itself failed.
    const stdout = execFileSync("node", [join(ROOT, "scripts/validate-plugin.mjs")], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out: stdout };
  } catch (err) {
    return { code: err.status ?? 1, out: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

try {
  for (const item of [".claude-plugin", "plugins", "package.json"]) {
    cpSync(join(ROOT, item), join(work, item), { recursive: true });
  }

  // 1. The real tree must pass.
  const clean = runValidator(work);
  check("clean tree passes", clean.code === 0, clean.code !== 0 ? "exit " + clean.code : "");

  // 2. Reintroduce the v0.4.0 defect: a plain scalar description followed by raw
  //    <example> blocks at column 0.
  const victim = join(work, "plugins/spaceapps-harness/agents/data-scout.md");
  const text = readFileSync(victim, "utf8");
  const end = text.indexOf("\n---", 4);
  const body = text.slice(end + 4);
  const unindented = text
    .slice(4, end)
    .split("\n")
    .filter((l) => l.startsWith("  ") || l.trim() === "")
    .map((l) => l.replace(/^ {2}/, ""));
  const broken = [
    "---",
    "name: data-scout",
    "description: " + unindented[0],
    ...unindented.slice(1),
    "model: opus",
    "color: green",
    "---",
  ].join("\n");
  writeFileSync(victim, broken + body);

  const dirty = runValidator(work);
  check("broken frontmatter is rejected", dirty.code !== 0, "exit " + dirty.code);
  check(
    "error names the file and the fix",
    /data-scout/.test(dirty.out) && /block scalar/.test(dirty.out),
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(`\n${failures === 0 ? "validator regression test passed" : `${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
