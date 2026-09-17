import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { Script } from 'node:vm';
const html = readFileSync('site/index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'duplicate HTML IDs');
for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (link.startsWith('#')) { if (link.length > 1) assert.ok(ids.includes(link.slice(1)), `missing anchor ${link}`); }
  else if (!link.startsWith('https:')) assert.ok(existsSync(resolve('site', link)), `missing asset ${link}`);
}
assert.match(html, /<html lang="en">/);
assert.match(html, /name="viewport"/);
assert.match(html, /rel="canonical"/);
assert.match(html, /role="status"/);
assert.match(html, /<noscript>/);
assert.doesNotMatch(html, /(?:src|href)="\//, 'site assets must work under the Pages project prefix');
assert.doesNotMatch(html, /<iframe|<form|googletagmanager|analytics\.js/i);
new Script(readFileSync('site/app.js', 'utf8'));
console.log('Site asset, anchor, metadata and JavaScript syntax checks passed. Rendered checks are separate.');
