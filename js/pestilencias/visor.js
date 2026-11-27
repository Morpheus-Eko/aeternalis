/* AETERNALIS · Códice de las Pestilencias v1.0 · CSS y reglamento separados. */
(function codexModule(){
'use strict';
const root=document.getElementById('ae-pestilencias');
if(!root||root.dataset.aepBoot)return;
root.dataset.aepBoot='loading';
const BASE='https://morpheus-eko.github.io/aeternalis/';
const ASSET=BASE+'assets/pestilencias/';
const DATA=BASE+'data/pestilencias/enfermedades.json?v=1.0.0';
const state={data:null,id:'fd',tab:'sintomas',race:'humano',vit:15,prior:0,potion:false,spell:false,sequela:0,report:null,message:''};
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
function badge(item){
 return '<button type="button" class="aep-case '+(item.id===state.id?'is-active':'')+'" data-disease="'+esc(item.id)+'" aria-pressed="'+(item.id===state.id?'true':'false')+'">'+
 '<span class="aep-case__seal"><img src="'+ASSET+esc(item.emblem)+'" alt="" loading="lazy" decoding="async"></span>'+
 '<span class="aep-case__copy"><small>REG. '+esc(item.code)+' · ARCHIVO RESERVADO</small><strong>'+esc(item.name)+'</strong><em>'+esc(item.region)+'</em></span>'+
 '<span class="aep-case__arrow" aria-hidden="true">⌁</span></button>';
}
function tabs(){
 const labels=[['sintomas','boton-sintomas.webp','Síntomas'],['exposicion','boton-exposicion.webp','Exposición'],['expediente','boton-expediente.webp','Expediente']];
 return '<div class="aep-tabbar" role="group" aria-label="Secciones del expediente">'+labels.map(([key,img,label])=>
 '<button type="button" class="aep-tab '+(state.tab===key?'is-active':'')+'" data-tab="'+key+'" aria-pressed="'+(state.tab===key?'true':'false')+'" aria-label="'+label+'"><img src="'+ASSET+img+'" alt="'+label+'" loading="lazy"></button>').join('')+'</div>';
}
function symptoms(){
 const disease=d();
 return '<div class="aep-sheet__intro"><span class="aep-kicker">ACTA DE OBSERVACIÓN / '+esc(disease.code)+'</span><h3>Manifestaciones documentadas</h3>'+
 '<p class="aep-dropcap">'+esc(disease.narrative)+'</p><p class="aep-highlight">'+esc(disease.summary)+'</p>'+
 '<h4>Hipótesis y procedencia</h4><p>'+esc(disease.uncertainty)+'</p>'+
 '<h4>Progresión de las secuelas</h4><ol class="aep-stage-list">'+disease.stages.map(stage=>
 '<li class="aep-stage '+(stage.count===disease.deathAt?'is-fatal':'')+'"><span class="aep-stage__number">'+fmt(stage.count).padStart(2,'0')+'</span><div><strong>'+esc(stage.title)+'</strong><p>'+esc(stage.effect)+'</p></div></li>'
 ).join('')+'</ol></div>';
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
function render(){
 const item=d();
 root.style.setProperty('--aep-disease',item.color);
 root.dataset.aepBoot='ready';
 root.innerHTML='<section class="aep-gabinete" aria-label="El Códice de las Pestilencias">'+
 '<header class="aep-header"><span class="aep-header__overline">AETERNALIS · ARCHIVO DE CONTENCIÓN</span><img src="'+ASSET+'cabecera-codice-pestilencias.webp" alt="El Códice de las Pestilencias" decoding="async"><p>No todo mal tiene nombre. No todo nombre conduce a una cura.</p></header>'+
 '<div class="aep-layout"><aside class="aep-index" aria-label="Índice de afecciones"><div class="aep-index__head"><span>ARMARIO DE MUESTRAS</span><strong>Índice de contagios</strong><small>III expedientes bajo custodia</small></div>'+
 state.data.diseases.map(badge).join('')+
 '<p class="aep-index__end">«Donde termina el conocimiento, comienza la cuarentena»</p></aside>'+
 '<main class="aep-dossier"><div class="aep-dossier__top"><div><span class="aep-kicker">FICHA '+esc(item.code)+' · '+esc(item.origin)+'</span><h2>'+esc(item.name)+'</h2><p>'+esc(item.subtitle)+'</p><div class="aep-dossier__tags"><span>'+esc(item.region)+'</span><span>Umbral > '+item.target+'</span><span>Riesgo mortal: '+item.deathAt+' secuelas</span></div></div><img class="aep-dossier__emblem" src="'+ASSET+esc(item.emblem)+'" alt="Emblema de '+esc(item.name)+'" fetchpriority="low"></div>'+
 tabs()+
 '<article class="aep-sheet" aria-label="'+(state.tab==='sintomas'?'Síntomas':state.tab==='exposicion'?'Exposición':'Expediente')+'">'+chapter()+'</article>'+
 '<div class="aep-dossier__foot"><span>ARCHIVO ABIERTO · '+esc(item.code)+'</span><span>Observación y supervivencia</span></div></main>'+
 '<aside class="aep-sidebar"><span class="aep-kicker">CONTROL DE CONTAGIO</span><h3>Protocolo de cuarentena</h3><p>Esta dolencia forma parte de las expediciones excepcionales de Aeternalis. Sus reglas se aplican cuando se cumplen las condiciones de exposición previstas.</p>'+
 '<div class="aep-stat"><span>Dado de resistencia</span><strong>1d100</strong></div><div class="aep-stat"><span>Inmunidad</span><strong>'+item.immunity+' exposiciones</strong></div>'+
 '<div class="aep-stat"><span>Desenlace mortal</span><strong>'+item.deathAt+' secuelas</strong></div><p class="aep-sidebar__notice">Solo el dado oficial y las decisiones del staff producen efectos válidos para la ficha. Esta interfaz es una herramienta de consulta.</p>'+
 '<div class="aep-seal" aria-hidden="true">⛨<small>SUB SIGILLO</small></div></aside></div>'+
 '<footer class="aep-footer"><span>OBSERVATORIO DE PESTILENCIAS</span><span>Tratado en construcción · Reglamento original preservado</span></footer>'+
 '<div id="aep-feedback" class="aep-feedback" role="status" aria-live="polite">'+esc(state.message)+'</div></section>';
}
function notify(message){state.message=message;const n=root.querySelector('#aep-feedback');if(n)n.textContent=message;}
root.addEventListener('click',function(ev){
 const select=ev.target.closest('[data-disease]');
 if(select){state.id=select.dataset.disease;state.tab='sintomas';state.sequela=0;state.report=null;state.message='';render();return;}
 const tab=ev.target.closest('[data-tab]');
 if(tab){state.tab=tab.dataset.tab;state.report=null;state.message='';render();return;}
 const action=ev.target.closest('[data-action]');
 if(!action)return;
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
 state.data=data;render();window.AeternalisCodicePestilencias={version:'1.0.0',getState:()=>({disease:state.id,tab:state.tab,loaded:true})};})
 .catch(e=>{root.dataset.aepBoot='error';root.innerHTML='<div class="aep-error" role="alert"><h2>No se pudo abrir el Códice.</h2><p>'+esc(e.message)+'</p><button type="button" data-action="retry">Reintentar</button></div>';console.error('[Aeternalis/Pestilencias]',e)});
}
root.addEventListener('click',ev=>{if(ev.target.closest('[data-action="retry"]'))load()});
load();
})();
