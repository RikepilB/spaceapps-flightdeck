import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';
const base = 'plugins/spaceapps-harness';
const agents = readdirSync(`${base}/agents`).filter(f => f.endsWith('.md'));
const skills = readdirSync(`${base}/skills`);
const cases = JSON.parse(readFileSync('evals/scenarios.json', 'utf8'));
assert.equal(agents.length, 9);
assert.equal(skills.length, 11);
for (const [kind, names] of [['agents', agents.map(f => f.slice(0, -3))], ['skills', skills]]) {
  for (const name of names) {
    const path = kind === 'agents' ? `${base}/agents/${name}.md` : `${base}/skills/${name}/SKILL.md`;
    const text = readFileSync(path, 'utf8');
    assert.match(text, /shared evidence and authority contract/);
    assert.ok(cases.some(c => c[kind].includes(name)), `no behavioral scenario for ${kind}/${name}`);
    for (const match of text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      if (!/^https?:/.test(match[1])) assert.ok(existsSync(resolve(dirname(path), match[1])), `broken reference ${path}: ${match[1]}`);
    }
    console.log(`ok contract + scenario coverage: ${kind}/${name}`);
  }
}
for (const path of ['AGENTS.md','CODEX.md','CLAUDE.md',join(base,'SAFETY.md')]) assert.ok(existsSync(path));
console.log('20 component contract checks passed; this is not behavioral acceptance.');
