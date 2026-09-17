import {test} from 'node:test';
import assert from 'node:assert/strict';
import {capabilities,roles,checks,suggest,ready,coverage,validateBoard} from '../site/team-model.mjs';
const blank=()=>Object.fromEntries(Object.keys(capabilities).map(k=>[k,0]));
const member=()=>({id:'member-1',name:'Alex',roles:['data'],scores:blank(),checks:Object.fromEntries(Object.keys(checks).map(k=>[k,false])),accounts:{earthdata:'not-needed',api:'not-needed'},evidence:''});
const board=m=>({version:1,members:[m]});
test('unknown answers and preference alone do not invent evidence',()=>assert.deepEqual(suggest(blank(),'lead'),[]));
test('data/science capability favors Data, with explained inputs',()=>{const r=suggest({...blank(),data:3,science:3},'core');assert.equal(r[0].id,'data');assert.deepEqual(r[0].known,['data','science']);});
test('equal capabilities preserve ties',()=>{const r=suggest(Object.fromEntries(Object.keys(capabilities).map(k=>[k,2])),'');assert.equal(new Set(r.map(i=>i.score)).size,1);});
test('behavior adds only one point',()=>{const s=Object.fromEntries(Object.keys(capabilities).map(k=>[k,2]));const r=suggest(s,'narrative');assert.equal(r[0].id,'narrative');assert.equal(r[0].score,5);});
test('readiness excludes unneeded accounts',()=>{const m=member();assert.deepEqual(ready(m),{done:0,total:4,complete:false});m.checks=Object.fromEntries(Object.keys(checks).map(k=>[k,true]));assert.equal(ready(m).complete,true);});
test('pending account blocks readiness until tested',()=>{const m=member();m.checks=Object.fromEntries(Object.keys(checks).map(k=>[k,true]));m.accounts.earthdata='pending';assert.deepEqual(ready(m),{done:4,total:5,complete:false});m.accounts.earthdata='ready';assert.equal(ready(m).complete,true);});
test('coverage uses explicit assignments, not capabilities',()=>{const m=member();m.scores.build=3;const c=coverage([m]);assert.deepEqual(c.find(r=>r.id==='data').owners,['Alex']);assert.deepEqual(c.find(r=>r.id==='core').owners,[]);});
test('dual roles cover two responsibilities',()=>{const m=member();m.roles=['lead','core'];assert.equal(coverage([m]).filter(r=>r.owners.length).length,2);});
test('small teams can explicitly own every responsibility',()=>{const m=member();m.roles=Object.keys(roles);const b=validateBoard(board(m));assert.equal(coverage(b.members).filter(r=>r.owners.length).length,6);});
test('valid roundtrip preserves board',()=>{const b=board(member());assert.deepEqual(validateBoard(JSON.parse(JSON.stringify(b))),b);});
test('names remain literal data; no markup interpretation in model',()=>{const m=member();m.name='<img src=x onerror=alert(1)>';assert.equal(validateBoard(board(m)).members[0].name,m.name);});
for(const [label,change] of [
 ['invalid version',b=>b.version=2],['seventh member',b=>b.members=Array.from({length:7},(_,i)=>({...member(),id:`id-${i}`,name:`Person ${i}`}))],
 ['duplicate ID',b=>b.members.push({...member(),name:'Another'})],['duplicate alias',b=>b.members.push({...member(),id:'another',name:' alex '})],
 ['invalid role',b=>b.members[0].roles=['__proto__']],['duplicate role',b=>b.members[0].roles=['data','data']],
 ['missing scores',b=>delete b.members[0].scores],['invalid score',b=>b.members[0].scores.data=99],
 ['truthy check',b=>b.members[0].checks.event='yes'],['bad account',b=>b.members[0].accounts.api='yes'],
 ['long name',b=>b.members[0].name='a'.repeat(41)],['long note',b=>b.members[0].evidence='a'.repeat(281)]
])test(`import rejects ${label}`,()=>{const b=board(member());change(b);assert.throws(()=>validateBoard(b));});
test('unknown properties are dropped on import',()=>{const m=member();m.extra='ignored';assert.equal('extra' in validateBoard(board(m)).members[0],false);});
test('all human roles map to existing agents and skills',async()=>{const {existsSync}=await import('node:fs');for(const r of Object.values(roles)){for(const a of r.agents)assert.ok(existsSync(`plugins/spaceapps-harness/agents/${a}.md`));for(const s of r.skills)assert.ok(existsSync(`plugins/spaceapps-harness/skills/${s}/SKILL.md`));}});
