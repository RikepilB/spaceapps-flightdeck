import {capabilities,roles,checks,suggest,ready,coverage,validateBoard} from './team-model.mjs';

const $=selector=>document.querySelector(selector);
const es=document.documentElement.lang==='es';
const key='flightdeck-crew-v1';
let board={version:1,members:[]},editing=null;

const capabilityCopy=es?{
  organize:'Coordinar el trabajo y decidir el alcance',data:'Inspeccionar datos, unidades y calidad',
  build:'Implementar y depurar un prototipo funcional',design:'Diseñar una interfaz útil y accesible',
  story:'Explicar, escribir o presentar una historia clara',science:'Revisar afirmaciones del dominio y su validación',
  test:'Reproducir fallos y comprobar el recorrido completo'
}:capabilities;

const roleCopy=es?{
  lead:{name:'Liderazgo',behavior:'Me gusta tomar decisiones y evitar que el equipo se bloquee.',owns:'El tiempo, las decisiones de alcance, el calendario de puntos de control y la confirmación de entrega.',proof:'Dirige una sesión breve de planificación; nombra al responsable y la alternativa para una tarea bloqueada.',deliver:'Un plan compartido, tres líneas de corte con responsables y la fecha límite local exacta.',caution:'Evita encargarte también de la implementación más difícil.'},
  data:{name:'Datos',behavior:'Compruebo las fuentes y los supuestos antes de confiar en un número.',owns:'Una muestra de datos utilizable, procedencia, unidades, vigencia y controles de calidad.',proof:'Abre una muestra pequeña y explica unidades, valores ausentes, latencia y límites.',deliver:'Un manifiesto verificado y un ejemplo real de datos en caché.',caution:'Una página web funcional no demuestra que la carga de datos sea utilizable.'},
  core:{name:'Desarrollo',behavior:'Disfruto depurar la parte más difícil hasta que funcione.',owns:'La implementación mínima de principio a fin y la transformación principal.',proof:'Muestra un recorrido pequeño que funcione y explica cómo compruebas el resultado.',deliver:'Un resultado reproducible y una explicación honesta de los atajos.',caution:'Termina un recorrido demostrable antes de añadir funciones.'},
  interface:{name:'Interfaz',behavior:'Noto dónde se confunde una persona nueva.',owns:'La experiencia que ven los jueces: entrada, salida, carga, errores y accesibilidad.',proof:'Pide a un compañero que use una interfaz pequeña sin ayuda y corrige un estado de error.',deliver:'Una demo clara con un ejemplo conocido y una alternativa sin conexión.',caution:'La legibilidad y las interacciones fiables van antes que el acabado.'},
  narrative:{name:'Narrativa',behavior:'Convierto trabajo complejo en una explicación breve y comprensible.',owns:'La página del proyecto, storyboard, video, créditos y presentación.',proof:'Explica el problema, usuario, evidencia y limitación en 30 segundos.',deliver:'Una página con fuentes y una demo veraz ensayada.',caution:'Empieza junto al desarrollo; nunca inventes evidencia para terminar la historia.'},
  floater:{name:'Apoyo',behavior:'Cambio bien de contexto y detecto lo que nadie ha comprobado.',owns:'Comprobaciones cruzadas, pasos de reproducción, integración y ensayo de alternativas.',proof:'Prueba un inicio limpio, una entrada incorrecta y una ejecución sin conexión; escribe hallazgos accionables.',deliver:'Una lista breve de problemas, enlaces probados y una alternativa ensayada.',caution:'Es una responsabilidad definida, no la persona que se quedó sin tarea.'}
}:roles;

const checkCopy=es?{
  event:'Registro y mismo evento comprobados',harness:'Practicó un flujo del harness',
  tooling:'Probó las herramientas de su rol',docs:'Leyó las reglas y el manual compartidos'
}:checks;
const levels=es?['Sin evaluar','Aprendiendo / necesito apoyo','Puedo hacerlo de forma independiente','Puedo guiar a otra persona']:['Not assessed','Learning / need support','Can do independently','Can guide someone else'];
const validationEs={
  'Use a version 1 Flightdeck board with at most six people.':'Usa un tablero Flightdeck versión 1 con un máximo de seis personas.',
  'Invalid or duplicate member ID.':'El identificador de una persona no es válido o está duplicado.',
  'Use unique names or aliases, up to 40 characters.':'Usa nombres o alias únicos de hasta 40 caracteres.',
  'Choose distinct valid roles per member.':'Elige roles válidos y distintos para cada persona.',
  'Capability values must be 0–3.':'Los valores de capacidad deben estar entre 0 y 3.',
  'Readiness checks must be true or false.':'Las comprobaciones de preparación deben ser verdaderas o falsas.',
  'Invalid data-account readiness.':'El estado de acceso a datos no es válido.',
  'Evidence note must be at most 280 characters.':'La nota de evidencia debe tener como máximo 280 caracteres.'
};
const ui=es?{
  storageSaved:'Guardado localmente. Exporta una copia antes de borrar los datos del navegador.',storageUnavailable:'El almacenamiento del navegador no está disponible: los cambios solo duran mientras esta página permanezca abierta. Exporta para conservarlos.',storageAvailable:'Almacenamiento local disponible. No hay sincronización del equipo.',storageBroken:'Los datos guardados no pudieron cargarse o el almacenamiento no está disponible. Se muestra un tablero vacío; exporta cualquier trabajo nuevo.',
  tryThis:'Prueba esto: ',deliver:'Entrega: ',helpers:'Asistentes de IA: ',workflows:'Flujos: ',rolesWorth:'Roles para explorar',rateFirst:'Evalúa una capacidad para ver sugerencias. Aun así puedes elegir cualquier rol y planificar apoyo.',tie:'Varios roles empatan según tu autoevaluación. Elige según la necesidad del equipo y conversa sobre un ejemplo.',startHere:'Empieza aquí y luego comprueba el encaje con un compañero.',choose:name=>`Elegir ${name}`,selected:name=>`${name} seleccionado. Añade un nombre o alias y guarda.`,method:'Método: suma los dos niveles de capacidad relevantes; una preferencia de trabajo coincidente añade un punto. Las capacidades sin evaluar no aportan evidencia. Las valoraciones no están verificadas.',
  addTeam:'Añadir al equipo',editCancelled:'Edición cancelada.',saved:name=>`${name} guardado. Actualiza sus comprobaciones en el tablero.`,coverage:'Cobertura de responsabilidades',unowned:names=>`Sin responsable: ${names}.`,allOwned:'Las seis responsabilidades tienen responsable. Revisen juntos la carga y la capacidad real.',unownedWord:'sin responsable',workload:'Riesgo de carga: Liderazgo también tiene Desarrollo. Acuerden quién controla el tiempo durante la implementación profunda.',empty:'Todavía no hay equipo. Empieza con tus capacidades y luego conversa los roles con tus compañeros.',setup:(done,total,complete)=>`${done}/${total} comprobaciones${complete?' · Listo':''}`,noCapabilities:'Capacidades todavía sin evaluar.',readiness:name=>`Preparación de ${name}`,earthdata:'Acceso a Earthdata',api:'Acceso a NASA API',notNeeded:'No es necesario para mi rol',pending:'Necesario — sin probar',accountReady:'Necesario — probado',updated:name=>`Preparación de ${name} actualizada.`,edit:name=>`Editar ${name}`,remove:name=>`Eliminar ${name}`,editing:name=>`Editando a ${name}. Se conserva su preparación actual.`,saveMember:'Guardar persona',removeConfirm:name=>`¿Eliminar a ${name} de este tablero local?`,removed:name=>`${name} eliminado.`,
  exported:'Archivo del equipo exportado. Contiene nombres, autoevaluaciones y preparación. Compártelo solo con los compañeros previstos.',tooLarge:'El archivo es demasiado grande. Máximo 100 KB.',replace:count=>`¿Reemplazar este tablero local con ${count} personas del archivo? Exporta primero si necesitas el tablero actual.`,imported:'Copia del equipo importada. Es una copia local, no un tablero compartido en vivo.',importRejected:error=>`Importación rechazada; el tablero actual no cambió. ${error}`
}:{
  storageSaved:'Saved locally. Export a backup before clearing browser data.',storageUnavailable:'Browser storage unavailable: changes last only while this page is open. Export to keep them.',storageAvailable:'Local storage available. No team synchronization.',storageBroken:'Saved data could not be loaded or storage is unavailable. An empty board is shown; export any new work.',
  tryThis:'Try this: ',deliver:'Deliver: ',helpers:'AI helpers: ',workflows:'Workflows: ',rolesWorth:'Roles worth exploring',rateFirst:'Rate a capability to see suggestions. You can still choose any role and plan support.',tie:'Several roles tie on your self-report. Choose by team need and discuss an example.',startHere:'Start here, then check the fit with a teammate.',choose:name=>`Choose ${name}`,selected:name=>`${name} selected. Add a name or alias, then save.`,method:'Method: add the two relevant capability levels; a matching work preference adds one point. Unassessed capabilities contribute no evidence. Ratings are not verified.',
  addTeam:'Add to team',editCancelled:'Edit cancelled.',saved:name=>`Saved ${name}. Update their readiness checks in the team board.`,coverage:'Responsibility coverage',unowned:names=>`Unowned: ${names}.`,allOwned:'All six responsibilities have an owner. Check workload and actual capability together.',unownedWord:'unowned',workload:'Workload risk: Lead also owns Core. Agree who watches the clock during deep implementation.',empty:'No crew yet. Start with your own capabilities above, then discuss roles with teammates.',setup:(done,total,complete)=>`${done}/${total} setup checks${complete?' · Ready':''}`,noCapabilities:'Capabilities not yet assessed.',readiness:name=>`Readiness for ${name}`,earthdata:'Earthdata access',api:'NASA API access',notNeeded:'Not needed for my role',pending:'Needed — not tested',accountReady:'Needed — tested',updated:name=>`Updated readiness for ${name}.`,edit:name=>`Edit ${name}`,remove:name=>`Remove ${name}`,editing:name=>`Editing ${name}. Existing readiness is preserved.`,saveMember:'Save member',removeConfirm:name=>`Remove ${name} from this local board?`,removed:name=>`Removed ${name}.`,
  exported:'Team file exported. It contains names, self-reports and readiness. Share only with the intended teammates.',tooLarge:'File too large. Maximum 100 KB.',replace:count=>`Replace this local board with ${count} people from the file? Export first if you need the current board.`,imported:'Team snapshot imported. This is a local copy, not a live shared board.',importRejected:error=>`Import rejected; current board unchanged. ${error}`
};

function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function option(value,label){const el=node('option',label);el.value=value;return el;}
function link(path,label){const el=node('a',label);el.href=`https://github.com/RikepilB/spaceapps-flightdeck/blob/main/plugins/spaceapps-harness/${path}`;return el;}
function roleText(id){return roleCopy[id];}
function validateLocalized(input){try{return validateBoard(input);}catch(error){throw new Error(es?(validationEs[error.message]??error.message):error.message);}}
function persist(){
  try{localStorage.setItem(key,JSON.stringify(board));$('#storage-status').textContent=ui.storageSaved;}
  catch{$('#storage-status').textContent=ui.storageUnavailable;}
}
try{
  const saved=localStorage.getItem(key);
  if(saved)board=validateLocalized(JSON.parse(saved));
  $('#storage-status').textContent=ui.storageAvailable;
}catch{$('#storage-status').textContent=ui.storageBroken;}

for(const [id,role] of Object.entries(roles)){
  const local=roleText(id),article=node('article');article.append(node('h3',local.name),node('p',local.owns));
  article.append(node('p',ui.tryThis+local.proof,'micro'),node('p',ui.deliver+local.deliver,'micro'));
  const agents=node('p',ui.helpers,'micro');
  role.agents.forEach((name,i)=>{if(i)agents.append(' · ');agents.append(link(`agents/${name}.md`,name));});
  const skills=node('p',ui.workflows,'micro');
  role.skills.forEach((name,i)=>{if(i)skills.append(' · ');skills.append(link(`skills/${name}/SKILL.md`,name));});
  article.append(agents,skills,node('p',local.caution,'role-caution'));$('#role-guide').append(article);
  $('#primary-role').append(option(id,local.name));
  const extraLabel=node('label',undefined,'check-label'),extra=node('input');extra.type='checkbox';extra.name='secondary';extra.value=id;extraLabel.append(extra,document.createTextNode(local.name));$('#secondary-roles').append(extraLabel);
  $('#preference').append(option(id,local.behavior));
}
for(const [id,label] of Object.entries(capabilityCopy)){
  const row=node('div',undefined,'capability-row'),caption=node('label',label);caption.htmlFor=`cap-${id}`;
  const select=node('select');select.id=`cap-${id}`;
  levels.forEach((level,i)=>select.append(option(String(i),level)));
  select.addEventListener('change',renderSuggestions);row.append(caption,select);$('#capability-fields').append(row);
}
function scores(){return Object.fromEntries(Object.keys(capabilities).map(id=>[id,Number($(`#cap-${id}`).value)]));}
function renderSuggestions(){
  const ranked=suggest(scores(),$('#preference').value),out=$('#suggestions');out.replaceChildren(node('h3',ui.rolesWorth));
  if(!ranked.length){out.append(node('p',ui.rateFirst));return;}
  const best=ranked[0].score,top=ranked.filter(r=>r.score===best);
  out.append(node('p',top.length>1?ui.tie:ui.startHere,'micro'));
  for(const item of ranked.slice(0,3)){
    const local=roleText(item.id),block=node('div',undefined,'suggestion');
    block.append(node('strong',local.name),node('p',item.known.map(id=>capabilityCopy[id]).join(' + '),'micro'));
    const choose=node('button',ui.choose(local.name));choose.type='button';choose.addEventListener('click',()=>{$('#primary-role').value=item.id;$('#form-status').textContent=ui.selected(local.name);});block.append(choose);out.append(block);
  }
  out.append(node('p',ui.method,'micro'));
}
$('#preference').addEventListener('change',renderSuggestions);
function resetForm(){editing=null;$('#member-form').reset();$('#save-member').textContent=ui.addTeam;$('#cancel-edit').hidden=true;renderSuggestions();}
$('#cancel-edit').addEventListener('click',()=>{resetForm();$('#form-status').textContent=ui.editCancelled;});
$('#member-form').addEventListener('submit',event=>{
  event.preventDefault();
  const old=board.members.find(m=>m.id===editing),primary=$('#primary-role').value;
  const member={id:old?.id??crypto.randomUUID(),name:$('#member-name').value.trim(),roles:[primary,...[...document.querySelectorAll('[name=secondary]:checked')].map(el=>el.value).filter(id=>id!==primary)].filter(Boolean),scores:scores(),evidence:$('#evidence').value,
    checks:old?.checks??Object.fromEntries(Object.keys(checks).map(c=>[c,false])),accounts:old?.accounts??{earthdata:'not-needed',api:'not-needed'}};
  const members=editing?board.members.map(m=>m.id===editing?member:m):[...board.members,member];
  try{board=validateLocalized({version:1,members});persist();renderBoard();resetForm();$('#form-status').textContent=ui.saved(member.name);}
  catch(error){$('#form-status').textContent=error.message;}
});
function renderBoard(){
  const cov=$('#coverage');cov.replaceChildren(node('h3',ui.coverage));
  const assignments=coverage(board.members),missing=assignments.filter(r=>!r.owners.length);
  cov.append(node('p',missing.length?ui.unowned(missing.map(r=>roleText(r.id).name).join(', ')):ui.allOwned));
  const list=node('div',undefined,'coverage-list');
  assignments.forEach(r=>list.append(node('span',`${roleText(r.id).name}: ${r.owners.join(', ')||ui.unownedWord}`,r.owners.length?'covered':'uncovered')));cov.append(list);
  if(board.members.some(m=>m.roles.includes('lead')&&m.roles.includes('core')))cov.append(node('p',ui.workload,'role-caution'));
  const members=$('#team-members');members.replaceChildren();
  if(!board.members.length)members.append(node('p',ui.empty,'empty-board'));
  for(const member of board.members){
    const card=node('article',undefined,'member-card'),header=node('div',undefined,'member-header'),heading=node('h3',member.name),progress=ready(member);
    header.append(heading,node('span',ui.setup(progress.done,progress.total,progress.complete)));card.append(header,node('p',member.roles.map(r=>roleText(r).name).join(' + ')));
    if(member.evidence)card.append(node('p',member.evidence,'micro'));
    card.append(node('p',Object.entries(member.scores).filter(([,v])=>v>0).map(([id,v])=>`${capabilityCopy[id]}: ${levels[v]}`).join(' · ')||ui.noCapabilities,'micro'));
    const fieldset=node('fieldset');fieldset.append(node('legend',ui.readiness(member.name)));
    for(const [id,label] of Object.entries(checkCopy)){
      const line=node('label',undefined,'check-label'),input=node('input');input.type='checkbox';input.checked=member.checks[id];
      input.addEventListener('change',()=>{member.checks[id]=input.checked;persist();updateProgress();});line.append(input,document.createTextNode(label));fieldset.append(line);
    }
    for(const [id,label] of [['earthdata',ui.earthdata],['api',ui.api]]){
      const line=node('label',label,'account-label'),select=node('select');
      for(const [value,text] of [['not-needed',ui.notNeeded],['pending',ui.pending],['ready',ui.accountReady]])select.append(option(value,text));
      select.value=member.accounts[id];select.addEventListener('change',()=>{member.accounts[id]=select.value;persist();updateProgress();});line.append(select);fieldset.append(line);
    }
    function updateProgress(){const p=ready(member);header.lastChild.textContent=ui.setup(p.done,p.total,p.complete);$('#board-status').textContent=ui.updated(member.name);}
    const actions=node('div',undefined,'crew-actions'),edit=node('button',ui.edit(member.name)),remove=node('button',ui.remove(member.name));edit.type=remove.type='button';
    edit.addEventListener('click',()=>{editing=member.id;$('#member-name').value=member.name;$('#primary-role').value=member.roles[0];document.querySelectorAll('[name=secondary]').forEach(el=>el.checked=member.roles.slice(1).includes(el.value));$('#evidence').value=member.evidence;$('#preference').value='';for(const id of Object.keys(capabilities))$(`#cap-${id}`).value=String(member.scores[id]);$('#save-member').textContent=ui.saveMember;$('#cancel-edit').hidden=false;$('#form-status').textContent=ui.editing(member.name);renderSuggestions();$('#member-name').focus();});
    remove.addEventListener('click',()=>{if(!confirm(ui.removeConfirm(member.name)))return;board.members=board.members.filter(m=>m.id!==member.id);if(editing===member.id)resetForm();persist();renderBoard();$('#board-status').textContent=ui.removed(member.name);});
    actions.append(edit,remove);card.append(fieldset,actions);members.append(card);
  }
}
$('#export-board').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(board,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='flightdeck-team.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#board-status').textContent=ui.exported;
});
$('#import-board').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  $('#import-file-name').textContent=file.name;
  try{
    if(file.size>100000)throw new Error(ui.tooLarge);
    const incoming=validateLocalized(JSON.parse(await file.text()));
    if(!confirm(ui.replace(incoming.members.length)))return;
    board=incoming;resetForm();persist();renderBoard();$('#board-status').textContent=ui.imported;
  }catch(error){$('#board-status').textContent=ui.importRejected(error.message);}
  finally{event.target.value='';$('#import-file-name').textContent=es?'Ningún archivo seleccionado':'No file selected';}
});
renderSuggestions();renderBoard();
