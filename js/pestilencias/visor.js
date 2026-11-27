/* AETERNALIS · Códice de las Pestilencias v1.1 · CSS y reglamento separados. */
(function codexModule(){
'use strict';
const root=document.getElementById('ae-pestilencias');
if(!root||root.dataset.aepBoot)return;
root.dataset.aepBoot='loading';
const BASE='https://morpheus-eko.github.io/aeternalis/';
const ASSET=BASE+'assets/pestilencias/';
const DATA=BASE+'data/pestilencias/enfermedades.json?v=1.0.0';
const state={data:null,id:'fd',tab:'sintomas',mode:'indice',race:'humano',vit:15,prior:0,potion:false,spell:false,sequela:0,report:null,message:''};
function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function d(){return state.data.diseases.find(item=>item.id===state.id)||state.data.diseases[0];}
function sign(n){return n>0?'+'+n:String(n);}
function fmt(n){return Number(n).toLocaleString('es-CL');}
function calc(){
 const entry=d(),modifier=state.vit+5*state.prior+(entry.raceBonus[state.race]||0)+(state.potion?entry.potion:0)+(state.spell?entry.spell:0);
 const minimum=Math.floor(entry.target-modifier)+1;
 const probability=Math.max(0,Math.min(100,101-Math.max(1,minimum)));
 return {modifier,minimum,probability,threshold:entry.target,penalty:100-probability};
}

function badge(item,index){
 const roman=['I','II','III'][index]||String(index+1);
 return '<button type="button" class="aep-entry" data-disease="'+esc(item.id)+'" aria-label="Abrir expediente: '+esc(item.name)+'">'+
 '<span class="aep-entry__number">'+roman+'</span>'+
 '<span class="aep-entry__seal"><img src="'+ASSET+esc(item.emblem)+'" alt="" loading="lazy" decoding="async"></span>'+
 '<span class="aep-entry__text"><small>FOLIO '+roman+' · '+esc(item.origin)+'</small><strong>'+esc(item.name)+'</strong><em>'+esc(item.summary)+'</em></span>'+
 '<span class="aep-entry__link" aria-hidden="true">Abrir legajo <b>›</b></span></button>';
}
function tabs(){
 const labels=[['sintomas','boton-sintomas.webp','Síntomas'],['exposicion','boton-exposicion.webp','Exposición'],['expediente','boton-expediente.webp','Expediente']];
 return '<nav class="aep-tabbar" aria-label="Pliegos del expediente">'+labels.map(([key,img,label])=>
 '<button type="button" class="aep-tab '+(state.tab===key?'is-active':'')+'" data-tab="'+key+'" aria-current="'+(state.tab===key?'page':'false')+'" aria-label="Abrir pliego: '+label+'"><img src="'+ASSET+img+'" alt="'+label+'" loading="lazy"></button>').join('')+'</nav>';
}
function symptoms(){
 const disease=d();
 const stages=disease.stages.map(stage=>
 '<details class="aep-note aep-note--stage '+(stage.count===disease.deathAt?'is-fatal':'')+'"><summary><span class="aep-note__number">'+String(stage.count).padStart(2,'0')+'</span><span>'+esc(stage.title)+'</span><span class="aep-note__hint">Abrir observación</span></summary><div class="aep-note__body"><p>'+esc(stage.effect)+'</p></div></details>').join('');
 return '<span class="aep-kicker">PLIEGO I · HISTORIA CLÍNICA / '+esc(disease.code)+'</span>'+
 '<h3>Observaciones del facultativo</h3>'+
 '<p class="aep-dropcap aep-prose-lead">'+esc(disease.narrative)+'</p>'+
 '<p class="aep-pullquote">'+esc(disease.summary)+'</p>'+
 '<div class="aep-manuscript-division"><span>NOTAS DEL GALENO · SE ABREN BAJO CONSULTA</span></div>'+
 '<details class="aep-note"><summary><span class="aep-note__number">I</span><span>De la procedencia y naturaleza del mal</span><span class="aep-note__hint">Leer nota</span></summary><div class="aep-note__body"><p>'+esc(disease.uncertainty)+'</p></div></details>'+
 '<details class="aep-note"><summary><span class="aep-note__number">II</span><span>De las circunstancias de exposición</span><span class="aep-note__hint">Leer nota</span></summary><div class="aep-note__body"><p>'+esc(disease.exposure)+'</p></div></details>'+
 '<details class="aep-note aep-note--chapter"><summary><span class="aep-note__number">III</span><span>Registro de las secuelas conocidas</span><span class="aep-note__hint">Desplegar registros</span></summary><div class="aep-note__body"><p>Cada anotación corresponde a un contador de secuela descrito en el reglamento. Abre las observaciones para consultar su efecto.</p><div class="aep-note__nested">'+stages+'</div></div></details>'+
 '<div class="aep-handwriting">«No atribuir certeza a aquello que solo conocemos por testimonio.»</div>';
}

function exposure(){
 const disease=d(),races=state.data.races;
 const option=(value,label,selected)=>'<option value="'+esc(value)+'" '+(String(selected)===String(value)?'selected':'')+'>'+esc(label)+'</option>';
 return '<div class="aep-sheet__intro"><span class="aep-kicker">BANCO DE PRUEBAS / 1D100</span><h3>La cámara de exposición</h3>'+
 '<p>'+esc(disease.exposure)+'</p><p class="aep-rule">Umbral original: superar <strong>'+disease.target+'</strong> en 1d100 después de aplicar los modificadores. Un resultado que no supere el umbral añade un contador de secuela.</p>'+
 '<div class="aep-form"><label>Vitalidad (VIT)<input data-field="vit" type="number" inputmode="numeric" min="0" max="9999" value="'+state.vit+'"></label>'+
 '<label>Raza<select data-field="race">'+races.map(r=>option(r.id,r.label,state.race)).join('')+'</select></label>'+
 '<label>Exposiciones anteriores<select data-field="prior">'+[0,1,2,3,4].map(n=>option(n,n+' previa'+(n===1?'':'s'),state.prior)).join('')+'</select></label>'+
 '<fieldset><legend>Protecciones declaradas</legend>'+
 '<label class="aep-check"><input type="checkbox" data-field="potion" '+(state.potion?'checked':'')+'><span>Poción de Ouriler <b>+'+disease.potion+'</b></span></label>'+
 '<label class="aep-check"><input type="checkbox" data-field="spell" '+(state.spell?'checked':'')+'><span>Velo de Astarax <b>+'+disease.spell+'</b></span></label></fieldset></div>'+
 '<button type="button" class="aep-calc" data-action="calculate" aria-label="Calcular exposición"><img src="'+ASSET+'boton-calcular-exposicion.webp" alt="Calcular exposición"></button>'+
 '<div class="aep-result" id="aep-result" aria-live="polite">'+(state.report?reportMarkup(state.report):'<p>Completa la muestra y activa la placa para conocer el modificador y la probabilidad de superar el umbral.</p>')+'</div>'+
 '<p class="aep-smallprint">'+esc(state.data.rules.calculatorDisclaimer)+'</p></div>';
}
function reportMarkup(r){
 const needed=r.minimum<1?'cualquier resultado':r.minimum>100?'ningún resultado':'un '+r.minimum+' o más';
 return '<div class="aep-result__numbers"><div><small>MODIFICADOR</small><b>'+sign(r.modifier)+'</b></div>'+
 '<div><small>DADO REQUERIDO</small><b>'+esc(needed)+'</b></div>'+
 '<div><small>OPORTUNIDAD</small><b>'+r.probability+' %</b></div></div><p>La tirada debe ser estrictamente mayor que '+r.threshold+' después de sumar los modificadores. Probabilidad de sumar una secuela: '+r.penalty+' %.</p>';
}
function expediente(){
 const disease=d();
 const current=state.sequela>=1?disease.stages[state.sequela-1]:null;
 return '<div class="aep-sheet__intro"><span class="aep-kicker">LEGAJO CLÍNICO / CONSULTA</span><h3>Ficha de secuelas</h3>'+
 '<p>Selecciona el número de contadores adquiridos para consultar las consecuencias según el reglamento. Esta consulta no escribe datos en tu ficha ni guarda información personal.</p>'+
 '<label class="aep-counter">Contadores de secuela<select data-field="sequela">'+Array.from({length:disease.deathAt+1},(_,n)=>
 '<option value="'+n+'" '+(n===state.sequela?'selected':'')+'>'+n+' / '+disease.deathAt+'</option>').join('')+'</select></label>'+
 '<div class="aep-prognosis"><span class="aep-kicker">DICTAMEN DE ESTADO</span><h4>'+(current?esc(current.title):'Sin secuelas acumuladas')+'</h4>'+
 '<p>'+(current?esc(current.effect):'Sin consecuencias atribuidas a esta enfermedad en el expediente de consulta.')+'</p></div>'+
 '<h4>Inmunidad</h4><p>'+esc(disease.immunityText)+'</p>'+
 '<p class="aep-rule">El reglamento contempla al menos cinco exposiciones para adquirir inmunidad. No aclara expresamente si la quinta tirada debe resolverse antes de que esta comience; debe confirmarlo el staff.</p>'+
 '<h4>Precisión sobre el rol</h4><p>Las secuelas con porcentaje se aplican a los atributos efectivos, incluidos los puntos obtenidos posteriormente, con redondeo hacia arriba. El reglamento permite continuar temas cronológicamente anteriores a la expedición.</p>'+
 '<button type="button" class="aep-copy" data-action="copy">Copiar resumen del expediente</button></div>';
}
function chapter(){return state.tab==='exposicion'?exposure():state.tab==='expediente'?expediente():symptoms();}

function indexPage(){
 const entries=state.data.diseases.map(badge).join('');
 return '<main class="aep-volume aep-volume--index" aria-label="Índice de las pestilencias">'+
 '<div class="aep-volume__index-head"><span class="aep-kicker">VOLUMEN I · ARCHIVO SANITARIO DE AETERNALIS</span><h1>Índice de las afecciones</h1>'+
 '<p>Los casos aquí reunidos proceden de testimonios, exploraciones y observaciones de quienes sobrevivieron al contagio. Selecciona un legajo para abrir sus notas médicas.</p>'+
 '<div class="aep-ink-divider" aria-hidden="true">✥　✥　✥</div></div>'+
 '<div class="aep-entry-list">'+entries+'</div>'+
 '<aside class="aep-index-marginalia"><b>ADVERTENCIA DEL ARCHIVISTA</b><p>Las notas conservan los límites del conocimiento de quienes las escribieron. El origen de algunas afecciones sigue siendo una conjetura. Ninguna de estas páginas sustituye las resoluciones del staff ni los dados oficiales.</p></aside>'+
 '<div class="aep-index-foot">TERMINA EL ÍNDICE · COMIENZAN LAS OBSERVACIONES</div></main>';
}
function readerPage(){
 const item=d(),next=state.tab==='sintomas'?'exposicion':state.tab==='exposicion'?'expediente':'indice';
 const nextTitle=next==='exposicion'?'Pasar al pliego II: Exposición':next==='expediente'?'Pasar al pliego III: Expediente':'Cerrar expediente y volver al índice';
 return '<div class="aep-bookbar"><button class="aep-bookbar__back" type="button" data-action="index">‹ Volver al índice</button>'+
 '<span>REGISTRO '+esc(item.code)+' · LEGAJO BAJO CUSTODIA</span></div>'+
 '<main class="aep-volume aep-volume--reader" aria-label="Expediente médico de '+esc(item.name)+'">'+
 '<header class="aep-volume__reader-head"><img class="aep-volume__emblem" src="'+ASSET+esc(item.emblem)+'" alt="" decoding="async">'+
 '<div><span class="aep-kicker">EXPEDIENTE '+esc(item.code)+' · '+esc(item.origin)+'</span>'+
 '<h2>'+esc(item.name)+'</h2><p>'+esc(item.subtitle)+'</p></div></header>'+
 '<div class="aep-ribbon"><span>'+esc(item.region)+'</span><span>Umbral de resistencia: > '+item.target+'</span><span>'+item.deathAt+' secuelas mortales</span></div>'+
 tabs()+
 '<article class="aep-sheet" aria-label="'+(state.tab==='sintomas'?'Observaciones clínicas':state.tab==='exposicion'?'Cámara de exposición':'Expediente de secuelas')+'">'+
 '<div class="aep-sheet__intro">'+chapter()+'</div></article>'+
 '<div class="aep-page-turn"><span>EL CÓDICE · '+(state.tab==='sintomas'?'PLIEGO I':state.tab==='exposicion'?'PLIEGO II':'PLIEGO III')+'</span>'+
 '<button type="button" data-action="'+(next==='indice'?'index':'next')+'">'+nextTitle+' <span aria-hidden="true">›</span></button></div>'+
 '<p class="aep-reader-disclaimer">Consulta orientativa. El resultado de los dados oficiales y las decisiones del staff prevalecen.</p>'+
 '</main>';
}
function render(){
 const item=d();
 root.style.setProperty('--aep-disease',item.color);
 root.dataset.aepBoot='ready';
 root.innerHTML='<section class="aep-gabinete '+(state.mode==='indice'?'aep-gabinete--index':'aep-gabinete--reading')+'" aria-label="El Códice de las Pestilencias">'+
 '<header class="aep-header"><span class="aep-header__overline">AETERNALIS · TRATADO DE AFECCIONES</span>'+
 '<img src="'+ASSET+'cabecera-codice-pestilencias.webp" alt="El Códice de las Pestilencias" decoding="async">'+
 '<p>No todo mal tiene nombre. No todo nombre conduce a una cura.</p></header>'+
 (state.mode==='indice'?indexPage():readerPage())+
 '<footer class="aep-footer"><span>EL CÓDICE DE LAS PESTILENCIAS</span><span>Manuscrito bajo observación · Edición en construcción</span></footer>'+
 '<div id="aep-feedback" class="aep-feedback" role="status" aria-live="polite">'+esc(state.message)+'</div>'+
 '</section>';
}
function returnToTop(){
 if(typeof root.scrollIntoView==='function'){
  try{root.scrollIntoView({behavior:'instant',block:'start'});}catch(_){root.scrollIntoView();}
 }
}

function notify(message){state.message=message;const n=root.querySelector('#aep-feedback');if(n)n.textContent=message;}
root.addEventListener('click',function(ev){
 const select=ev.target.closest('[data-disease]');
 if(select){state.id=select.dataset.disease;state.mode='lectura';state.tab='sintomas';state.sequela=0;state.report=null;state.message='';render();returnToTop();return;}
 const tab=ev.target.closest('[data-tab]');
 if(tab){state.tab=tab.dataset.tab;state.report=null;state.message='';render();returnToTop();return;}
 const action=ev.target.closest('[data-action]');
 if(!action)return;
 if(action.dataset.action==='index'){state.mode='indice';state.tab='sintomas';state.message='';state.report=null;render();returnToTop();return;}
 if(action.dataset.action==='next'){state.tab=state.tab==='sintomas'?'exposicion':'expediente';state.report=null;state.message='';render();returnToTop();return;}
 if(action.dataset.action==='calculate'){state.report=calc();const n=root.querySelector('#aep-result');if(n)n.innerHTML=reportMarkup(state.report);notify('Cálculo orientativo actualizado.');return;}
 if(action.dataset.action==='copy'){
  const disease=d(),effect=state.sequela>0?disease.stages[state.sequela-1].effect:'Sin secuelas.';
  const summary='Aeternalis · '+disease.name+'\nExposiciones anteriores: '+state.prior+'\nSecuelas: '+state.sequela+'\nEfectos: '+effect+'\nNota: registro orientativo, no validado por el staff.';
  if(navigator.clipboard&&navigator.clipboard.writeText){
   navigator.clipboard.writeText(summary).then(()=>notify('Resumen copiado. No es un registro oficial.')).catch(()=>notify('El navegador impidió copiar. Puedes seleccionar y copiar el texto manualmente.'));
  }else notify('La copia automática no está disponible en este navegador.');
 }
});
root.addEventListener('change',function(ev){
 const field=ev.target.closest('[data-field]');if(!field)return;
 const key=field.dataset.field;
 if(key==='vit')state.vit=Math.max(0,Math.min(9999,Math.trunc(Number(field.value)||0)));
 if(key==='prior')state.prior=Math.max(0,Math.min(4,Math.trunc(Number(field.value)||0)));
 if(key==='race')state.race=field.value;
 if(key==='potion'||key==='spell')state[key]=field.checked;
 if(key==='sequela'){state.sequela=Math.max(0,Math.min(d().deathAt,Math.trunc(Number(field.value)||0)));render();return;}
 state.report=null;const output=root.querySelector('#aep-result');if(output)output.innerHTML='<p>Datos actualizados. Vuelve a calcular para obtener el dictamen.</p>';
});
function load(){
 root.innerHTML='<p class="aep-loading" role="status">Abriendo los expedientes lacrados…</p>';
 fetch(DATA,{mode:'cors',credentials:'omit',cache:'default'}).then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.json();})
 .then(data=>{if(data.schema!=='aeternalis-pestilencias-v1'||!Array.isArray(data.diseases)||data.diseases.length!==3)throw Error('Datos del Códice no compatibles');
 state.data=data;render();window.AeternalisCodicePestilencias={version:'1.1.0',getState:()=>({disease:state.id,tab:state.tab,loaded:true})};})
 .catch(e=>{root.dataset.aepBoot='error';root.innerHTML='<div class="aep-error" role="alert"><h2>No se pudo abrir el Códice.</h2><p>'+esc(e.message)+'</p><button type="button" data-action="retry">Reintentar</button></div>';console.error('[Aeternalis/Pestilencias]',e)});
}
root.addEventListener('click',ev=>{if(ev.target.closest('[data-action="retry"]'))load()});
load();
})();
