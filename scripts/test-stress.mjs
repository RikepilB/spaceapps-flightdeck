import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const work = mkdtempSync(join(tmpdir(), 'spaceapps-stress-'));
const marketplace = '.claude-plugin/marketplace.json';
const plugin = 'plugins/spaceapps-harness';
const agent = `${plugin}/agents/data-scout.md`;
const skill = `${plugin}/skills/nasa-data-access/SKILL.md`;
const write = (path, text) => writeFileSync(join(work, path), text);
const edit = (path, transform) => write(path, transform(readFileSync(join(work, path), 'utf8')));
const json = (path, transform) => edit(path, text => JSON.stringify(transform(JSON.parse(text))));
const cases = [
  ['clean tree', () => {}, true],
  ['CRLF frontmatter', () => edit(agent, s => s.replace(/\r?\n/g, '\r\n')), true],
  ['invalid JSON', () => write(marketplace, '{')],
  ['null marketplace', () => write(marketplace, 'null')],
  ['scalar marketplace', () => write(marketplace, '42')],
  ['array marketplace', () => write(marketplace, '[]')],
  ['plugins object', () => json(marketplace, m => ({ ...m, plugins: {} }))],
  ['plugins empty', () => json(marketplace, m => ({ ...m, plugins: [] }))],
  ['null entry', () => json(marketplace, m => ({ ...m, plugins: [null] }))],
  ['duplicate plugin', () => json(marketplace, m => ({ ...m, plugins: [...m.plugins, m.plugins[0]] }))],
  ['empty owner', () => json(marketplace, m => ({ ...m, owner: { name: '' } }))],
  ['path traversal', () => json(marketplace, m => { m.plugins[0].source = '../outside'; return m; })],
  ['absolute path', () => json(marketplace, m => { m.plugins[0].source = resolve(root, plugin); return m; })],
  ['remote source skipped', () => json(marketplace, m => { m.plugins[0].source = { source: 'github' }; return m; })],
  ['missing source', () => json(marketplace, m => { m.plugins[0].source = './plugins/missing'; return m; })],
  ['missing manifest', () => rmSync(join(work, plugin, '.claude-plugin/plugin.json'))],
  ['missing version', () => json(`${plugin}/.claude-plugin/plugin.json`, m => { delete m.version; return m; })],
  ['version drift', () => json(`${plugin}/.claude-plugin/plugin.json`, m => ({ ...m, version: '99.0.0' }))],
  ['package drift', () => json('package.json', m => ({ ...m, version: '99.0.0' }))],
  ['missing agents', () => rmSync(join(work, plugin, 'agents'), { recursive: true })],
  ['empty skills', () => { rmSync(join(work, plugin, 'skills'), { recursive: true }); mkdirSync(join(work, plugin, 'skills')); }],
  ['missing SKILL.md', () => rmSync(join(work, skill))],
  ['empty description', () => edit(agent, s => s.replace(/description: \|[\s\S]*?\nmodel:/, 'description: ""\nmodel:'))],
  ['empty block', () => edit(agent, s => s.replace(/description: \|[\s\S]*?\nmodel:/, 'description: |\nmodel:'))],
  ['duplicate YAML key', () => edit(agent, s => s.replace('model: opus', 'model: opus\nmodel: haiku'))],
  ['broken quote', () => edit(skill, s => s.replace('name: nasa-data-access', 'name: "nasa-data-access'))],
  ['tab indentation', () => edit(agent, s => s.replace('  Use this agent', '\tUse this agent'))],
  ['wrong skill name', () => edit(skill, s => s.replace('name: nasa-data-access', 'name: wrong-name'))],
  ['empty skill body', () => edit(skill, s => s.slice(0, s.indexOf('\n---', 3) + 4))],
  ['bad model', () => edit(agent, s => s.replace('model: opus', 'model: imaginary-model'))],
  ['bad color', () => edit(agent, s => s.replace('color: green', 'color: invisible'))],
];

try {
  for (const [name, mutate, valid = false] of cases) {
    // Only reset files created by this test under its own temporary directory.
    for (const item of ['.claude-plugin', 'plugins', 'package.json']) {
      const path = join(work, item);
      rmSync(path, { recursive: true, force: true });
      cpSync(join(root, item), path, { recursive: true });
    }
    mutate();
    const result = spawnSync(process.execPath, [join(root, 'scripts/validate-plugin.mjs')], { cwd: work, encoding: 'utf8' });
    assert.equal(result.status, valid ? 0 : 1, `${name}: ${result.stdout}\n${result.stderr}`);
    assert.doesNotMatch(result.stderr, /TypeError|SyntaxError|ReferenceError/, `${name}: validator must report rather than crash`);
    console.log(`ok ${name}`);
  }
  console.log(`${cases.length} adversarial validator cases passed`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
