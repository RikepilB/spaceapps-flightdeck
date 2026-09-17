import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { createHash } from 'node:crypto';

// Explicit snapshot, not a history rewrite. Never copy the source .git or sessions.
const source = process.cwd();
const target = resolve(source, '../spaceapps-flightdeck');
if (existsSync(target)) throw new Error(`Refusing to overwrite existing directory: ${target}`);
const files = ['.gitattributes','.gitignore','AGENTS.md','CLAUDE.md','CODEX.md','CONTRIBUTING.md','LICENSE','README.md','package.json'];
const trees = ['.claude-plugin','.github','plugins','scripts','site','evals/fixtures','evals/keys','evals/prompts'];
const docs = ['AUDIT.md','AUDIT-PLAN.md','ONBOARDING.md','PUBLISHING.md','TEAM-RUNBOOK.md','SUPPLY-CHAIN.md'];
for (const file of [...files,...docs.map(d=>`docs/${d}`),'evals/README.md','evals/scenarios.json','evals/run-behavioral.ps1','evals/run-evals.ts']) {
  if (!existsSync(join(source,file))) throw new Error(`Missing release file ${file}`);
}
mkdirSync(target);
for (const item of [...files,...trees,...docs.map(d=>`docs/${d}`),'evals/README.md','evals/scenarios.json','evals/run-behavioral.ps1','evals/run-evals.ts']) {
  mkdirSync(resolve(target,item,'..'),{recursive:true});
  cpSync(join(source,item),join(target,item),{recursive:true});
}
mkdirSync(join(target,'evals/results'),{recursive:true});
writeFileSync(join(target,'evals/results/.gitkeep'),'');
mkdirSync(join(target,'docs/handoff'),{recursive:true});
writeFileSync(join(target,'docs/handoff/HANDOFF.md'),'# Flightdeck handoff\n\n## Current state\n\nPublic source snapshot, v0.5.0. Start with docs/AUDIT.md and docs/PUBLISHING.md.\nPrivate predecessor transcripts and history were deliberately excluded.\n\n## Session index\n\n| Date | Summary |\n|---|---|\n| 2026-09-17 | Initial public snapshot: portable guidance, stress tests and Pages tutorial |\n');

const inventory=[];
function inspect(dir) {
  for (const item of readdirSync(dir,{withFileTypes:true})) {
    const path=join(dir,item.name);
    if (item.isSymbolicLink()) throw new Error(`Symlinks excluded: ${path}`);
    if (item.isDirectory()) { inspect(path); continue; }
    const rel=relative(target,path).replaceAll('\\','/');
    const data=readFileSync(path);
    const text=data.toString('utf8');
    if (/(?:-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|sk-ant-[A-Za-z0-9_-]{20,})/.test(text)) throw new Error(`Potential secret: ${rel}; publication stopped`);
    inventory.push({path:rel,sha256:createHash('sha256').update(data).digest('hex')});
  }
}
inspect(target);
mkdirSync(join(source,'docs/evidence-local'),{recursive:true});
writeFileSync(join(source,'docs/evidence-local/public-inventory.json'),JSON.stringify(inventory,null,2));
console.log(`Prepared ${inventory.length} reviewed-scope files in ${target}; no source Git history copied.`);
