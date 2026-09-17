export const capabilities = {
  organize:'Coordinate work and make scope decisions', data:'Inspect data, units and quality',
  build:'Implement and debug a working prototype', design:'Design a usable, accessible interface',
  story:'Explain, write or present a clear story', science:'Review domain claims and validation',
  test:'Reproduce failures and check the whole flow'
};
export const roles = {
  lead:{name:'Lead', needs:['organize','story'], behavior:'I like making decisions and keeping people unblocked.', owns:'The clock, scope decisions, checkpoint schedule and submission confirmation.', proof:'Run a short planning session; name the owner and fallback for a blocked task.', deliver:'A shared plan, three owned cut lines and the exact local deadline.', agents:['team-architect','scope-planner'], skills:['team-building','hackathon-war-room'], caution:'Avoid also owning the hardest implementation task.'},
  data:{name:'Data', needs:['data','science'], behavior:'I check sources and assumptions before trusting a number.', owns:'A usable data slice, provenance, units, freshness and quality checks.', proof:'Open a small sample and explain units, missing values, latency and limits.', deliver:'A verified manifest and a cached real-data example.', agents:['data-scout','science-validator'], skills:['nasa-data-access'], caution:'A working webpage does not prove a usable data payload.'},
  core:{name:'Core', needs:['build','test'], behavior:'I enjoy debugging the hardest part and making it work.', owns:'The smallest end-to-end implementation and the main transform.', proof:'Show a small working path and explain how you test its output.', deliver:'One reproducible result and an honest account of shortcuts.', agents:['build-engineer','scope-planner'], skills:['hackathon-war-room'], caution:'Finish one demonstrable path before adding features.'},
  interface:{name:'Interface', needs:['design','build'], behavior:'I notice where a newcomer gets confused.', owns:'The experience judges see: input, output, loading, errors and accessibility.', proof:'Have a teammate use a small interface without coaching; fix a failure state.', deliver:'A clear demo with a known-good example and offline fallback.', agents:['build-engineer'], skills:['hackathon-war-room'], caution:'Legibility and reliable interactions come before polish.'},
  narrative:{name:'Narrative', needs:['story','design'], behavior:'I turn complex work into a short, understandable explanation.', owns:'The project page, storyboard, video, credits and pitch.', proof:'Explain the problem, user, evidence and limitation in 30 seconds.', deliver:'A sourced project page and rehearsed, truthful demo.', agents:['pitch-director','submission-auditor'], skills:['project-page-builder','demo-video','judge-simulation'], caution:'Start alongside the build; never invent evidence to finish the story.'},
  floater:{name:'Floater', needs:['test','organize'], behavior:'I switch context well and spot what nobody has checked.', owns:'Cross-checks, reproduction steps, integration and fallback rehearsal.', proof:'Try a fresh start, a bad input and an offline run; write actionable findings.', deliver:'A short issue list, tested links and a rehearsed backup.', agents:['science-validator','submission-auditor'], skills:['judge-simulation','session-handoff'], caution:'This is a named responsibility, not the person with nothing else to do.'}
};
export const checks = {event:'Registration & same event checked',harness:'Practised one harness workflow',tooling:'Tools for my role tested',docs:'Read shared rules & runbook'};
export function suggest(scores, preference) {
  return Object.entries(roles).map(([id,role])=>{
    const known=role.needs.filter(key=>scores[key]>0);
    return {id,score:known.reduce((sum,key)=>sum+scores[key],0)+(preference===id?1:0),known,
      reason:known.length ? known.map(key=>capabilities[key]).join(' + ') : 'No capability evidence supplied'};
  }).filter(item=>item.known.length).sort((a,b)=>b.score-a.score);
}
export function ready(member) {
  const required=[...Object.keys(checks),...['earthdata','api'].filter(key=>member.accounts[key]!=='not-needed')];
  const done=required.filter(key=>key in checks ? member.checks[key] : member.accounts[key]==='ready').length;
  return {done,total:required.length,complete:done===required.length};
}
export function coverage(members) {
  return Object.keys(roles).map(id=>({id,owners:members.filter(m=>m.roles.includes(id)).map(m=>m.name)}));
}
export function validateBoard(input) {
  if (!input || input.version!==1 || !Array.isArray(input.members) || input.members.length>6) throw new Error('Use a version 1 Flightdeck board with at most six people.');
  const ids=new Set(),names=new Set();
  const members=input.members.map(m=>{
    if (!m || typeof m.id!=='string' || !/^[a-zA-Z0-9-]{1,80}$/.test(m.id) || ids.has(m.id)) throw new Error('Invalid or duplicate member ID.');
    if (typeof m.name!=='string' || !m.name.trim() || m.name.length>40 || names.has(m.name.trim().toLowerCase())) throw new Error('Use unique names or aliases, up to 40 characters.');
    if (!Array.isArray(m.roles) || m.roles.length<1 || m.roles.length>6 || new Set(m.roles).size!==m.roles.length || m.roles.some(r=>!Object.hasOwn(roles,r))) throw new Error('Choose distinct valid roles per member.');
    const scores={},savedChecks={},accounts={};
    for(const key of Object.keys(capabilities)) {
      if(!Number.isInteger(m.scores?.[key]) || m.scores[key]<0 || m.scores[key]>3) throw new Error('Capability values must be 0–3.');
      scores[key]=m.scores[key];
    }
    for(const key of Object.keys(checks)) {
      if(typeof m.checks?.[key]!=='boolean') throw new Error('Readiness checks must be true or false.');
      savedChecks[key]=m.checks[key];
    }
    for(const key of ['earthdata','api']) {
      if(!['not-needed','pending','ready'].includes(m.accounts?.[key])) throw new Error('Invalid data-account readiness.');
      accounts[key]=m.accounts[key];
    }
    if(typeof m.evidence!=='string' || m.evidence.length>280) throw new Error('Evidence note must be at most 280 characters.');
    ids.add(m.id);names.add(m.name.trim().toLowerCase());
    return {id:m.id,name:m.name.trim(),roles:[...m.roles],scores,checks:savedChecks,accounts,evidence:m.evidence};
  });
  return {version:1,members};
}
