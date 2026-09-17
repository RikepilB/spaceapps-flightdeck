import {capabilities,roles,checks,suggest,ready,coverage,validateBoard} from './team-model.mjs';
const $=selector=>document.querySelector(selector);
const key='flightdeck-crew-v1';
let board={version:1,members:[]},editing=null;
const levels=['Not assessed','Learning / need support','Can do independently','Can guide someone else'];
function node(tag,text,className) {const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function option(value,label) {const el=node('option',label);el.value=value;return el;}
function link(path,label) {const el=node('a',label);el.href=`https://github.com/RikepilB/spaceapps-flightdeck/blob/main/plugins/spaceapps-harness/${path}`;return el;}
function persist() {
  try {localStorage.setItem(key,JSON.stringify(board));$('#storage-status').textContent='Saved locally. Export a backup before clearing browser data.';}
  catch {$('#storage-status').textContent='Browser storage unavailable: changes last only while this page is open. Export to keep them.';}
}
try {
  const saved=localStorage.getItem(key);
  if(saved)board=validateBoard(JSON.parse(saved));
  $('#storage-status').textContent='Local storage available. No team synchronization.';
} catch {$('#storage-status').textContent='Saved data could not be loaded or storage is unavailable. An empty board is shown; export any new work.';}

for(const [id,role] of Object.entries(roles)) {
  const article=node('article');article.append(node('h3',role.name),node('p',role.owns));
  article.append(node('p',`Try this: ${role.proof}`,'micro'),node('p',`Deliver: ${role.deliver}`,'micro'));
  const agents=node('p', 'AI helpers: ','micro');
  role.agents.forEach((name,i)=>{if(i)agents.append(' · ');agents.append(link(`agents/${name}.md`,name));});
  const skills=node('p','Workflows: ','micro');
  role.skills.forEach((name,i)=>{if(i)skills.append(' · ');skills.append(link(`skills/${name}/SKILL.md`,name));});
  article.append(agents,skills,node('p',role.caution,'role-caution'));$('#role-guide').append(article);
  $('#primary-role').append(option(id,role.name));
  const extraLabel=node('label',undefined,'check-label'),extra=node('input');extra.type='checkbox';extra.name='secondary';extra.value=id;extraLabel.append(extra,document.createTextNode(role.name));$('#secondary-roles').append(extraLabel);
  $('#preference').append(option(id,role.behavior));
}
for(const [id,label] of Object.entries(capabilities)) {
  const row=node('div',undefined,'capability-row');const caption=node('label',label);caption.htmlFor=`cap-${id}`;
  const select=node('select');select.id=`cap-${id}`;
  levels.forEach((level,i)=>select.append(option(String(i),level)));
  select.addEventListener('change',renderSuggestions);row.append(caption,select);$('#capability-fields').append(row);
}
function scores() {return Object.fromEntries(Object.keys(capabilities).map(id=>[id,Number($(`#cap-${id}`).value)]));}
function renderSuggestions() {
  const ranked=suggest(scores(),$('#preference').value),out=$('#suggestions');out.replaceChildren(node('h3','Roles worth exploring'));
  if(!ranked.length) {out.append(node('p','Rate a capability to see suggestions. You can still choose any role and plan support.'));return;}
  const best=ranked[0].score,top=ranked.filter(r=>r.score===best);
  out.append(node('p',top.length>1?'Several roles tie on your self-report. Choose by team need and discuss an example.':'Start here, then check the fit with a teammate.','micro'));
  for(const item of ranked.slice(0,3)) {
    const block=node('div',undefined,'suggestion');block.append(node('strong',roles[item.id].name),node('p',item.reason,'micro'));
    const choose=node('button',`Choose ${roles[item.id].name}`);choose.type='button';choose.addEventListener('click',()=>{$('#primary-role').value=item.id;$('#form-status').textContent=`${roles[item.id].name} selected. Add a name or alias, then save.`;});block.append(choose);out.append(block);
  }
  out.append(node('p','Method: add the two relevant capability levels; a matching work preference adds one point. Unassessed capabilities contribute no evidence. Ratings are not verified.','micro'));
}
$('#preference').addEventListener('change',renderSuggestions);
function resetForm() {editing=null;$('#member-form').reset();$('#save-member').textContent='Add to team';$('#cancel-edit').hidden=true;renderSuggestions();}
$('#cancel-edit').addEventListener('click',()=>{resetForm();$('#form-status').textContent='Edit cancelled.';});
$('#member-form').addEventListener('submit',event=>{
  event.preventDefault();
  const old=board.members.find(m=>m.id===editing);
  const primary=$('#primary-role').value;
  const member={id:old?.id??crypto.randomUUID(),name:$('#member-name').value.trim(),roles:[primary,...[...document.querySelectorAll('[name=secondary]:checked')].map(el=>el.value).filter(id=>id!==primary)].filter(Boolean),scores:scores(),evidence:$('#evidence').value,
    checks:old?.checks??Object.fromEntries(Object.keys(checks).map(c=>[c,false])),accounts:old?.accounts??{earthdata:'not-needed',api:'not-needed'}};
  const members=editing?board.members.map(m=>m.id===editing?member:m):[...board.members,member];
  try {board=validateBoard({version:1,members});persist();renderBoard();resetForm();$('#form-status').textContent=`Saved ${member.name}. Update their readiness checks in the team board.`;}
  catch(error){$('#form-status').textContent=error.message;}
});
function renderBoard() {
  const cov=$('#coverage');cov.replaceChildren(node('h3','Responsibility coverage'));
  const assignments=coverage(board.members),missing=assignments.filter(r=>!r.owners.length);
  cov.append(node('p',missing.length?`Unowned: ${missing.map(r=>roles[r.id].name).join(', ')}.`:'All six responsibilities have an owner. Check workload and actual capability together.'));
  const list=node('div',undefined,'coverage-list');
  assignments.forEach(r=>list.append(node('span',`${roles[r.id].name}: ${r.owners.join(', ')||'unowned'}`,r.owners.length?'covered':'uncovered')));cov.append(list);
  if(board.members.some(m=>m.roles.includes('lead')&&m.roles.includes('core')))cov.append(node('p','Workload risk: Lead also owns Core. Agree who watches the clock during deep implementation.','role-caution'));
  const members=$('#team-members');members.replaceChildren();
  if(!board.members.length)members.append(node('p','No crew yet. Start with your own capabilities above, then discuss roles with teammates.','empty-board'));
  for(const member of board.members) {
    const card=node('article',undefined,'member-card');const header=node('div',undefined,'member-header');const heading=node('h3',member.name);
    const progress=ready(member);header.append(heading,node('span',`${progress.done}/${progress.total} setup checks${progress.complete?' · Ready':''}`));card.append(header,node('p',member.roles.map(r=>roles[r].name).join(' + ')));
    if(member.evidence)card.append(node('p',member.evidence,'micro'));
    const skills=node('p',Object.entries(member.scores).filter(([,v])=>v>0).map(([id,v])=>`${capabilities[id]}: ${levels[v]}`).join(' · ')||'Capabilities not yet assessed.','micro');card.append(skills);
    const fieldset=node('fieldset');fieldset.append(node('legend',`Readiness for ${member.name}`));
    for(const [id,label] of Object.entries(checks)) {
      const line=node('label',undefined,'check-label'),input=node('input');input.type='checkbox';input.checked=member.checks[id];
      input.addEventListener('change',()=>{member.checks[id]=input.checked;persist();updateProgress();});line.append(input,document.createTextNode(label));fieldset.append(line);
    }
    for(const [id,label] of [['earthdata','Earthdata access'],['api','NASA API access']]) {
      const line=node('label',label,'account-label'),select=node('select');
      for(const [value,text] of [['not-needed','Not needed for my role'],['pending','Needed — not tested'],['ready','Needed — tested']])select.append(option(value,text));
      select.value=member.accounts[id];select.addEventListener('change',()=>{member.accounts[id]=select.value;persist();updateProgress();});line.append(select);fieldset.append(line);
    }
    function updateProgress(){const p=ready(member);header.lastChild.textContent=`${p.done}/${p.total} setup checks${p.complete?' · Ready':''}`;$('#board-status').textContent=`Updated readiness for ${member.name}.`;}
    const actions=node('div',undefined,'crew-actions');const edit=node('button',`Edit ${member.name}`),remove=node('button',`Remove ${member.name}`);edit.type=remove.type='button';
    edit.addEventListener('click',()=>{editing=member.id;$('#member-name').value=member.name;$('#primary-role').value=member.roles[0];document.querySelectorAll('[name=secondary]').forEach(el=>el.checked=member.roles.slice(1).includes(el.value));$('#evidence').value=member.evidence;$('#preference').value='';for(const id of Object.keys(capabilities))$(`#cap-${id}`).value=String(member.scores[id]);$('#save-member').textContent='Save member';$('#cancel-edit').hidden=false;$('#form-status').textContent=`Editing ${member.name}. Existing readiness is preserved.`;renderSuggestions();$('#member-name').focus();});
    remove.addEventListener('click',()=>{if(!confirm(`Remove ${member.name} from this local board?`))return;board.members=board.members.filter(m=>m.id!==member.id);if(editing===member.id)resetForm();persist();renderBoard();$('#board-status').textContent=`Removed ${member.name}.`;});
    actions.append(edit,remove);card.append(fieldset,actions);members.append(card);
  }
}
$('#export-board').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(board,null,2)],{type:'application/json'}));
  const a=node('a');a.href=url;a.download='flightdeck-team.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('#board-status').textContent='Team file exported. It contains names, self-reports and readiness. Share only with the intended teammates.';
});
$('#import-board').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try {
    if(file.size>100000)throw new Error('File too large. Maximum 100 KB.');
    const incoming=validateBoard(JSON.parse(await file.text()));
    if(!confirm(`Replace this local board with ${incoming.members.length} people from the file? Export first if you need the current board.`))return;
    board=incoming;resetForm();persist();renderBoard();$('#board-status').textContent='Team snapshot imported. This is a local copy, not a live shared board.';
  }catch(error){$('#board-status').textContent=`Import rejected; current board unchanged. ${error.message}`;}
  finally {event.target.value='';}
});
renderSuggestions();renderBoard();
