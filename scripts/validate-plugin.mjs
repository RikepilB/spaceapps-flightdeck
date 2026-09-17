#!/usr/bin/env node
/**
 * Structural validation for the marketplace and the plugin it ships.
 *
 * Deliberately dependency-free so CI needs no install step: a validator that is slow to
 * run is a validator people skip.
 *
 * Checks the things that fail silently at install or trigger time — a name that does not
 * match its directory, a missing frontmatter field, a version that disagrees between the
 * plugin manifest and the marketplace entry — rather than anything about content quality,
 * which is what evals/ is for.
 */
import { readFileSync, readdirSync, existsSync, statSync, realpathSync } from "node:fs";
import { join, resolve, relative, isAbsolute, sep } from "node:path";

const ROOT = process.cwd();
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const AGENT_COLORS = new Set(["blue", "cyan", "green", "yellow", "magenta", "red"]);
const AGENT_MODELS = new Set(["inherit", "sonnet", "opus", "haiku"]);
const MAX_SKILL_WORDS = 3000;

const errors = [];
const warnings = [];
const passes = [];

const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const pass = (m) => passes.push(m);

/** Frontmatter is delimited by --- lines; return the raw block or null. */
function frontmatter(text) {
  text = text.replace(/\r\n/g, "\n");
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  return end === -1 ? null : text.slice(4, end);
}

/**
 * Strict-enough YAML check for frontmatter, without a YAML dependency.
 *
 * This exists because the first version of this validator only checked that fields
 * were PRESENT — it regex-matched `^model:` anywhere in the block — so nine agent
 * files whose frontmatter did not parse at all sailed through with 22 green ticks.
 * The real loader rejected every one of them.
 *
 * The failure was a plain scalar followed by raw `<example>` blocks at column 0:
 *
 *     description: Use this agent when...
 *
 *     <example>            <-- YAML sees a key here, finds no colon, gives up
 *
 * So the rule enforced here: inside frontmatter every non-blank line is either
 * indented (a continuation) or a `key:` at column 0. Nothing else is legal, and that
 * one rule catches the whole class.
 *
 * Returns { fields, errors } — `fields` maps a top-level key to its inline value.
 */
function checkFrontmatter(fm) {
  const errors = [];
  const fields = Object.create(null);
  const KEY = /^([A-Za-z_][A-Za-z0-9_-]*):(.*)$/;
  let current = null;

  fm.split("\n").forEach((line, i) => {
    const lineNo = i + 2; // +1 for 0-index, +1 for the opening ---
    if (line.trim() === "") return;
    if (line.includes("\t")) errors.push(`line ${lineNo}: tabs are not permitted in frontmatter`);
    if (/^[ \t]/.test(line)) {
      // A continuation line. Legal only once a key has opened.
      if (current === null) errors.push(`line ${lineNo}: indented text before any key`);
      return;
    }
    const m = KEY.exec(line);
    if (!m) {
      errors.push(
        `line ${lineNo}: "${line.slice(0, 40)}" is neither indented nor a "key:" — ` +
          `frontmatter is not valid YAML. A multi-line value must use a block scalar ` +
          `(e.g. "description: |") with every line indented.`,
      );
      current = null;
      return;
    }
    if (m[1] in fields) errors.push(`line ${lineNo}: duplicate key "${m[1]}"`);
    current = m[1];
    fields[current] = m[2].trim();
    const value = fields[current];
    const toolList = current === "tools" && /^\[(?:"[A-Za-z0-9_]+"(?:,\s*)?)+\]$/.test(value);
    if ((!toolList && /^[\[\]{},&*!]/.test(value)) || (/^["']/.test(value) && value.at(-1) !== value[0])) {
      errors.push(`line ${lineNo}: unsupported or malformed scalar for ${current}`);
    }
    if (!/^[|>"']/.test(value) && /:\s/.test(value)) {
      errors.push(`line ${lineNo}: quote scalar values containing colon-space`);
    }
  });

  for (const key of ["name", "description"]) {
    if (!fields[key] || /^(null|~|''|"")$/.test(fields[key])) errors.push(`${key} must be nonempty`);
  }
  if (/^[|>][-+]?$/.test(fields.description ?? "")) {
    const description = fm.match(/^description:.*\r?\n((?:[ \t]+[^\n]*\n?|\r?\n)*)/m)?.[1];
    if (!description?.trim()) errors.push("description block must be nonempty");
  }

  return { fields, errors };
}

function readJson(path) {
  try {
    const value = JSON.parse(readFileSync(path, "utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("expected a JSON object");
    return value;
  } catch (err) {
    fail(`${path}: invalid JSON — ${err.message}`);
    return null;
  }
}

// --- marketplace -----------------------------------------------------------
const marketplacePath = join(ROOT, ".claude-plugin", "marketplace.json");
if (!existsSync(marketplacePath)) {
  fail("missing .claude-plugin/marketplace.json");
}
const marketplace = existsSync(marketplacePath) ? readJson(marketplacePath) : null;

if (marketplace) {
  if (typeof marketplace !== "object" || Array.isArray(marketplace)) {
    fail("marketplace.json: must be an object");
  }
  for (const key of ["name", "owner", "plugins"]) {
    if (!(key in marketplace)) fail(`marketplace.json: missing required field "${key}"`);
  }
  if (marketplace.name && !KEBAB.test(marketplace.name)) {
    fail(`marketplace.json: name "${marketplace.name}" is not kebab-case`);
  }
  if (marketplace.owner && !marketplace.owner.name) {
    fail("marketplace.json: owner.name is required");
  }
  if (Array.isArray(marketplace.plugins)) {
    pass(`marketplace "${marketplace.name}" lists ${marketplace.plugins.length} plugin(s)`);
  }
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    fail("marketplace.json: plugins must be a nonempty array");
  }
  if (typeof marketplace.name !== "string" || !marketplace.name) fail("marketplace.json: name must be nonempty");
  if (!marketplace.owner || typeof marketplace.owner.name !== "string" || !marketplace.owner.name.trim()) fail("marketplace.json: owner.name must be nonempty");
}

// --- each plugin -----------------------------------------------------------
const seen = new Set();
for (const entry of Array.isArray(marketplace?.plugins) ? marketplace.plugins : []) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    fail("marketplace.json: each plugin must be an object");
    continue;
  }
  if (seen.has(entry.name)) fail(`duplicate plugin: ${entry.name}`);
  seen.add(entry.name);
  if (!entry.name || !entry.source) {
    fail(`marketplace.json: plugin entry needs both "name" and "source"`);
    continue;
  }
  // Only local-path sources are resolvable from here; a github source is someone
  // else's repo to validate.
  if (typeof entry.source !== "string") {
    fail(`${entry.name}: this repository requires a local source path`);
    continue;
  }

  const dir = resolve(ROOT, entry.source);
  const rel = relative(ROOT, dir);
  if (!entry.source.startsWith("./plugins/") || isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`)) {
    fail(`${entry.name}: source path must stay inside ./plugins/`);
    continue;
  }
  if (!existsSync(dir)) {
    fail(`${entry.name}: source path ${entry.source} does not exist`);
    continue;
  }
  const realRelative = relative(realpathSync(ROOT), realpathSync(dir));
  if (isAbsolute(realRelative) || realRelative === ".." || realRelative.startsWith(`..${sep}`)) {
    fail(`${entry.name}: source resolves outside repository`);
    continue;
  }

  const manifestPath = join(dir, ".claude-plugin", "plugin.json");
  if (!existsSync(manifestPath)) {
    fail(`${entry.name}: missing .claude-plugin/plugin.json`);
    continue;
  }
  const manifest = readJson(manifestPath);
  if (!manifest) continue;
  if (typeof manifest !== "object" || Array.isArray(manifest)) { fail(`${entry.name}: manifest must be an object`); continue; }
  const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
  if (!semver.test(manifest.version ?? "")) fail(`${entry.name}: version must be semver`);
  if (!semver.test(entry.version ?? "")) fail(`${entry.name}: marketplace version must be semver`);
  if (typeof manifest.description !== "string" || !manifest.description.trim()) fail(`${entry.name}: manifest description must be nonempty`);
  const pkg = readJson(join(ROOT, "package.json"));
  if (pkg && pkg.version !== manifest.version) fail(`${entry.name}: package version mismatch`);

  if (!manifest.name) fail(`${entry.name}: plugin.json has no name`);
  else if (!KEBAB.test(manifest.name)) fail(`${entry.name}: plugin name is not kebab-case`);
  else if (manifest.name !== entry.name) {
    fail(`${entry.name}: plugin.json name "${manifest.name}" disagrees with marketplace entry`);
  }

  // Drift between these two is the classic confusing-install bug: the marketplace
  // advertises one version and the installed plugin reports another.
  if (entry.version && manifest.version && entry.version !== manifest.version) {
    fail(
      `${entry.name}: version mismatch — marketplace ${entry.version} vs plugin.json ${manifest.version}`,
    );
  } else if (manifest.version) {
    pass(`${entry.name} v${manifest.version}`);
  }

  // --- skills
  const skillsDir = join(dir, "skills");
  if (!existsSync(skillsDir) || readdirSync(skillsDir).length === 0) fail(`${entry.name}: missing or empty skills directory`);
  if (existsSync(skillsDir)) {
    for (const name of readdirSync(skillsDir)) {
      const skillDir = join(skillsDir, name);
      if (!statSync(skillDir).isDirectory()) continue;
      const skillFile = join(skillDir, "SKILL.md");
      if (!existsSync(skillFile)) {
        fail(`skill ${name}: no SKILL.md`);
        continue;
      }
      const text = readFileSync(skillFile, "utf8");
      const fm = frontmatter(text);
      if (!fm) {
        fail(`skill ${name}: no YAML frontmatter`);
        continue;
      }
      if (!text.slice(text.indexOf("\n---", 3) + 4).trim()) fail(`skill ${name}: empty body`);
      const { fields, errors: fmErrors } = checkFrontmatter(fm);
      if (fmErrors.length) {
        for (const e of fmErrors) fail(`skill ${name}: ${e}`);
        continue;
      }
      if (fields.name !== name) {
        fail(`skill ${name}: frontmatter name "${fields.name}" does not match directory`);
      }
      // The description is the entire trigger mechanism. A skill with none never fires.
      if (!("description" in fields)) fail(`skill ${name}: no description`);


      const words = text.split(/\s+/).filter(Boolean).length;
      if (words > MAX_SKILL_WORDS) {
        warn(`skill ${name}: ${words} words, over the ${MAX_SKILL_WORDS} guideline — move detail to references/`);
      } else {
        pass(`skill ${name} (${words}w)`);
      }
    }
  }

  // --- agents
  const agentsDir = join(dir, "agents");
  if (!existsSync(agentsDir) || !readdirSync(agentsDir).some(f => f.endsWith(".md"))) fail(`${entry.name}: missing or empty agents directory`);
  if (existsSync(agentsDir)) {
    for (const file of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
      const stem = file.replace(/\.md$/, "");
      const fm = frontmatter(readFileSync(join(agentsDir, file), "utf8"));
      if (!fm) {
        fail(`agent ${stem}: no YAML frontmatter`);
        continue;
      }
      const { fields, errors: fmErrors } = checkFrontmatter(fm);
      if (fmErrors.length) {
        for (const e of fmErrors) fail(`agent ${stem}: ${e}`);
        continue;
      }
      if (fields.name !== stem) fail(`agent ${stem}: frontmatter name does not match filename`);
      if (!("description" in fields)) fail(`agent ${stem}: no description`);
      if (!KEBAB.test(stem) || stem.length < 3 || stem.length > 50) {
        fail(`agent ${stem}: name must be kebab-case, 3-50 chars`);
      }

      const model = fields.model;
      const color = fields.color;
      if (!model) fail(`agent ${stem}: missing model`);
      else if (!AGENT_MODELS.has(model)) fail(`agent ${stem}: invalid model "${model}"`);
      if (!color) fail(`agent ${stem}: missing color`);
      else if (!AGENT_COLORS.has(color)) fail(`agent ${stem}: invalid color "${color}"`);

      // A description carrying <example> blocks must be a block scalar or the file
      // does not parse at all. Catch the near-miss where the examples are written
      // but the "|" is forgotten.
      const hasExamples = fm.includes("<example>");
      if (hasExamples && !/^[|>]/.test(fields.description ?? "")) {
        fail(
          `agent ${stem}: description contains <example> blocks but is not a block ` +
            `scalar - write "description: |" and indent the body two spaces`,
        );
      }
      // Examples are what teach the router when to reach for this agent.
      if (!hasExamples) warn(`agent ${stem}: description has no <example> block`);

      if (model && color) pass(`agent ${stem} (${model}/${color})`);
    }
  }
}

// --- report ----------------------------------------------------------------
for (const p of passes) console.log(`  ok    ${p}`);
for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  FAIL  ${e}`);

console.log(
  `\n${passes.length} passed, ${warnings.length} warning(s), ${errors.length} error(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
