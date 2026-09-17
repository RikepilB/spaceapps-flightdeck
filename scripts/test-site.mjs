import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { Script } from 'node:vm';
const pages = {'index.html':'en','index.es.html':'es','crew.html':'en','crew.es.html':'es'};
for (const [page,lang] of Object.entries(pages)) {
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
assert.match(html, new RegExp(`<html lang="${lang}">`));
assert.match(html, /name="viewport"/);
assert.match(html, /rel="canonical"/);
for (const alternate of ['en','es','x-default']) assert.match(html, new RegExp(`hreflang="${alternate}"`));
assert.equal([...html.matchAll(/data-theme="(?:light|dark)"/g)].length, 2, `${page} needs both theme controls`);
assert.match(html, /role="status"/);
assert.match(html, /<noscript>/);
assert.doesNotMatch(html, /(?:src|href)="\//, 'site assets must work under the Pages project prefix');
assert.doesNotMatch(html, /<iframe|googletagmanager|analytics\.js/i);
assert.doesNotMatch(html, /<form[^>]+action=/i, 'local planner must not post user data');
}
new Script(readFileSync('site/app.js', 'utf8'));
new Script(readFileSync('site/theme-init.js', 'utf8'));
assert.match(readFileSync('site/index.es.html','utf8'), /href="\.\/crew\.es\.html"/);
assert.match(readFileSync('site/crew.es.html','utf8'), /href="\.\/index\.es\.html"/);
assert.match(readFileSync('site/crew.html','utf8'), /ADVICE FROM A PAST WINNER/);
assert.match(readFileSync('site/crew.es.html','utf8'), /CONSEJOS DE UN GANADOR ANTERIOR/);
assert.match(readFileSync('site/robots.txt','utf8'), /Sitemap: https:\/\/rikepilb\.github\.io\/spaceapps-flightdeck\/sitemap\.xml/);
const sitemap=readFileSync('site/sitemap.xml','utf8');
for(const page of ['/','/index.es.html','/crew.html','/crew.es.html']) assert.match(sitemap,new RegExp(`<loc>https://rikepilb\\.github\\.io/spaceapps-flightdeck${page.replaceAll('.','\\.')}</loc>`));
console.log('Bilingual site assets, anchors, metadata, theme controls and classic JavaScript syntax passed. Rendered checks are separate.');
