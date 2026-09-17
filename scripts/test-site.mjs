import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { Script } from 'node:vm';
for (const page of ['index.html','crew.html']) {
const html = readFileSync(`site/${page}`, 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'duplicate HTML IDs');
for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (link.startsWith('#')) { if (link.length > 1) assert.ok(ids.includes(link.slice(1)), `missing anchor ${link}`); }
  else if (!link.startsWith('https:')) {
    const [path,hash]=link.split('#');
    assert.ok(existsSync(resolve('site', path)), `missing asset ${link}`);
    if(hash)assert.ok(readFileSync(resolve('site',path),'utf8').includes(`id="${hash}"`),`missing target ${link}`);
  }
}
assert.match(html, /<html lang="en">/);
assert.match(html, /name="viewport"/);
assert.match(html, /rel="canonical"/);
assert.match(html, /role="status"/);
assert.match(html, /<noscript>/);
assert.doesNotMatch(html, /(?:src|href)="\//, 'site assets must work under the Pages project prefix');
assert.doesNotMatch(html, /<iframe|googletagmanager|analytics\.js/i);
assert.doesNotMatch(html, /<form[^>]+action=/i, 'local planner must not post user data');
}
new Script(readFileSync('site/app.js', 'utf8'));
console.log('Site asset, anchor, metadata and JavaScript syntax checks passed. Rendered checks are separate.');
