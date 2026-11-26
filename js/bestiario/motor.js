/*
 AETERNALIS — BESTIARIO INTERACTIVO 2.0 · GITHUB PAGES
 HTML de la publicación: <div class="hidethisprofile"></div><div id="aeb-bestiary"></div>
 CSS: bloque <style id="aeb-bestiary-css"> de /h4-mapa-kawaii-css.
 Instalar SIN etiquetas <script> en Gestión de JavaScript, preferentemente «En los temas».
 NO instalar el motor antiguo ni los dos catálogos regionales. Este motor
 se carga desde GitHub Pages después de descargar ocho tomos JSON.
*/
(function(){
'use strict';
if (window.__AEB_BESTIARY_ENGINE_V11__ || window.__AEB_BESTIARY_ENGINE_GITHUB_V2__) return;
window.__AEB_BESTIARY_ENGINE_GITHUB_V2__=true;
const ROOT_ID='aeb-bestiary', CSS_PAGE='/h4-mapa-kawaii-css', STYLE_ID='aeb-bestiary-injected-css';
const REGION={
  bergheim:{name:'Bergheim',subtitle:'Cuatro montañas · Crónicas de los Ojopiedras',cover:4,paper:3,prev:20,next:13,separator:5,marker:24,emblem:21,chapter:'Cuadernos de las Cuatro Montañas',descriptions:['Fauna de bosques y montañas','Habitantes de los riscos','Ecos de piedra y aguas oscuras','Los fiordos, el abismo y los cielos']},
  yugen:{name:'Yūgen',subtitle:'Bosques, santuarios, costas y tormentas',cover:2,paper:1,prev:59,next:60,separator:45,marker:53,emblem:54,chapter:'Cuadernos de las Islas Yūgen',descriptions:['Los senderos del cerezo, la piedra y el barro','Barrancos, bosques antiguos y santuarios','Turberas, ríos y monstruos del litoral','Mar abierto, arrecifes y cielos']}
};
const ASSETS=window.__AEB_BESTIARY_ASSETS__;
const INDEX=window.__AEB_BESTIARY_INDEX__;
let app=null;
let initialParent=null, initialNext=null, docScroll='';
const cache={};
let state={view:'closed',region:'bergheim',volume:1,creature:0,search:'',busy:false};
const escapeHtml=s=>String(s===undefined||s===null?'':s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const dataAttr=s=>escapeHtml(s);
const assetId=n=>ASSETS[n]&&ASSETS[n].id_imgur||'';
// Usar versiones proporcionadas de Imgur: t=160px, m=320px, l=640px, h=1024px.
const imgurExtensionCache=new Map();
const assetTag=(n,cl,alt)=>`<img class="${cl||'aeb-art'}" data-aeb-img="${assetId(n)}" alt="${escapeHtml(alt||'Ornamento')}" loading="${/aeb-(?:page-image|cover-image|mini-cover)/.test(cl||'')?'eager':'lazy'}" decoding="async">`;
const urlImgur=id=>'https://imgur.com/'+encodeURIComponent(id);
function bindImages(scope){
  const local=window.__AEB_TEST_IMAGES__ || {};
  scope.querySelectorAll('img[data-aeb-img]').forEach(img=>{
    const id=img.dataset.aebImg, supplied=local[id];
    if(!id)return;
    if(supplied){img.src=supplied;return;}
    // Solo las ilustraciones de fauna usan miniaturas para acelerar la lectura.
    // Los 61 ornamentos/editoriales (papeles, marcos, portadas, runas y trofeos)
    // conservan el PNG original con su canal alfa. Las miniaturas generadas
    // automáticamente por Imgur pueden aplanar su transparencia.
    const size=img.classList.contains('aeb-creature-image')?'h':'';
    const known=imgurExtensionCache.get(id);
    const extensions=known?[known,...['png','jpg','jpeg','webp'].filter(e=>e!==known)]:['png','jpg','jpeg','webp'];
    let i=0;
    const source=()=> 'https://i.imgur.com/'+id+size+'.'+extensions[i];
    img.onload=()=>imgurExtensionCache.set(id,extensions[i]);
    img.onerror=()=>{
      ++i;
      if(i<extensions.length){img.src=source();return;}
      img.classList.add('aeb-image-broken');
      img.alt='Imagen no disponible en Imgur';
      const box=img.closest('.aeb-hero-frame,.aeb-cover-frame,.aeb-decor-frame');
      if(box&&!box.querySelector('.aeb-image-error')){
        let a=document.createElement('a');a.className='aeb-image-error';a.href=urlImgur(id);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Ver imagen en Imgur';box.appendChild(a);
      }
    };
    img.src=source();
  });
}
function statusMessage(message,kind){
  if(!app)return;
  app.innerHTML='<div class="aeb-error '+(kind||'')+'"><h3>Bestiario de Aeternalis</h3><p>'+escapeHtml(message)+'</p><button type="button" data-action="retry">Reintentar</button></div>';
}
function fetchStyles(){
  if(document.getElementById(STYLE_ID))return Promise.resolve();
  return fetch(CSS_PAGE,{credentials:'same-origin',cache:'no-store'}).then(r=>{
    if(!r.ok)throw Error('La página h4 devolvió HTTP '+r.status);return r.text();
  }).then(html=>{
    let doc=new DOMParser().parseFromString(html,'text/html');
    let node=doc.getElementById('aeb-bestiary-css');
    let css=node?node.textContent:'';
    if(!css){
      let from=html.indexOf('/* AEB_BESTIARY_CSS_START */');
      let to=html.indexOf('/* AEB_BESTIARY_CSS_END */',from+10);
      if(from>=0&&to>from)css=html.slice(from,to);
    }
    if(!css || !css.includes('#aeb-bestiary')||css.length<800)throw Error('Falta el bloque <style id="aeb-bestiary-css"> de este bestiario en h4.');
    let style=document.createElement('style');style.id=STYLE_ID;style.textContent=css;document.head.appendChild(style);
  });
}
// Los tomos se leen como JSON legible desde GitHub Pages antes de iniciar el motor.
async function loadVolume(region,volume){
  const key=region+'-'+volume;
  if(cache[key])return cache[key];
  const tomes=window.__AEB_BESTIARY_DATA__;
  const data=tomes && tomes[region] && tomes[region][volume];
  if(!data)throw Error('No se pudo obtener el tomo '+volume+' de '+REGION[region].name+' desde GitHub.');
  if(data.region!==region||Number(data.volume)!==Number(volume)||!Array.isArray(data.creatures)||data.creatures.length!==10){
    throw Error('Los datos del tomo '+volume+' de '+REGION[region].name+' no son válidos.');
  }
  cache[key]=data;
  return data;
}
function romanTome(region,volume){return ['I','II','III','IV','V','VI','VII','VIII'][Math.max(0,Math.min(7,volume-1+(region==='yugen'?4:0)))];}
function themeForVolume(region,volume){
  const index=Math.max(0,Math.min(3,volume-1));
  return region==='yugen'
    ? {separator:[45,46,47,61][index],emblem:[54,53,55,58][index],corner:[49,50,51,52][index]}
    : {separator:[5,15,6,5][index],emblem:[21,22,23,24][index],corner:7};
}
function imageFromSpecies(spec){return `<img class="aeb-creature-image" data-aeb-img="${dataAttr(spec.imgurId)}" alt="Ilustración: ${escapeHtml(spec.name)}" loading="eager" decoding="async" fetchpriority="high">`;}
function shellTop(){
  return `<div class="aeb-topline"><div><span class="aeb-sigil">✥</span> AETERNALIS <span class="aeb-top-muted">/ Registros naturalistas</span></div><button type="button" class="aeb-close" data-action="close" aria-label="Cerrar bestiario">✕ <span>Cerrar</span></button></div>`;
}
function renderLauncher(){
  app.className='aeb-host';
  app.innerHTML=`<div class="aeb-launch"><div class="aeb-launch-covers">${assetTag(4,'aeb-mini-cover','Bergheim')}${assetTag(2,'aeb-mini-cover','Yūgen')}</div><div class="aeb-launch-copy"><span>ARCHIVOS DE FAËANDIR</span><h2>Bestiario de Aeternalis</h2><p>Ochenta registros de fauna y criaturas de Bergheim y las Islas Yūgen.</p><button type="button" data-action="open">Abrir el bestiario <b>✧</b></button></div></div>`;
  bindImages(app);
}
function renderShelf(){
  return `<div class="aeb-shelf"><div class="aeb-shelf-title"><p>REGISTROS DE FAËANDIR · VOLUMENES ILUSTRADOS</p><h1>Bestiario de Aeternalis</h1><div>La memoria de los caminos, las huellas y las criaturas que los habitan.</div></div><div class="aeb-shelf-volumes">${Object.entries(REGION).map(([k,r])=>`<button type="button" class="aeb-region-card" data-action="choose-region" data-region="${k}"><span class="aeb-cover-frame">${assetTag(r.cover,'aeb-cover-image','Cubierta del tomo '+r.name)}</span><strong>${r.name}</strong><small>40 criaturas · 4 tomos</small></button>`).join('')}</div><p class="aeb-archive-note">Los textos se conservan según los ocho tomos originales. Las ilustraciones y la iconografía son recursos editoriales.</p></div>`;
}
function indexList(region){
  const names=INDEX[region];
  return names.map((m,n)=>`<button type="button" class="aeb-creature-link" data-action="go-creature" data-region="${region}" data-volume="${Math.floor(n/10)+1}" data-number="${n%10}" data-search="${dataAttr(m.name.toLocaleLowerCase())}"><span class="aeb-index-number">${String(m.number).padStart(2,'0')}</span><span class="aeb-index-name">${escapeHtml(m.name)}</span><span class="aeb-link-ornament">✧</span></button>`).join('');
}
function renderIndex(){
  const r=REGION[state.region];
  return `<div class="aeb-book"><div class="aeb-spread"><section class="aeb-page aeb-page-left"><div class="aeb-page-bg">${assetTag(r.paper,'aeb-page-image','Papel regional')}</div><div class="aeb-page-content"><p class="aeb-kicker">CÓDICE DE ${escapeHtml(r.name.toUpperCase())}</p><h2>${escapeHtml(r.chapter)}</h2><div class="aeb-decor-frame aeb-divider">${assetTag(r.separator,'aeb-divider-image','Separador')}</div><div class="aeb-intro"><p>${escapeHtml(r.subtitle)}</p><p>Este archivo reúne cuarenta especies repartidas en cuatro tomos. Elige el registro que deseas consultar.</p></div><div class="aeb-region-seal">${assetTag(r.emblem,'aeb-emblem','Sello regional')}</div><div class="aeb-volume-grid">${r.descriptions.map((description,i)=>`<div class="aeb-volume-item"><button type="button" data-action="open-volume" data-volume="${i+1}"><span>TOMO ${romanTome(state.region,i+1)}</span><small>${escapeHtml(description)}</small></button><button class="aeb-prologue-link" type="button" data-action="show-prologue" data-volume="${i+1}">Leer prólogo</button></div>`).join('')}</div></div></section><section class="aeb-page aeb-page-right"><div class="aeb-page-bg">${assetTag(r.paper,'aeb-page-image','Papel regional')}</div><div class="aeb-page-content aeb-index-content"><p class="aeb-kicker">ÍNDICE DE ESPECIES · ${escapeHtml(r.name.toUpperCase())}</p><h2>Registros de campo</h2><label class="aeb-search-label">Buscar una criatura <input id="aeb-search" type="search" placeholder="Nombre de la especie…" value="${dataAttr(state.search)}" autocomplete="off"></label><div class="aeb-creature-index" id="aeb-index-list">${indexList(state.region)}</div><p class="aeb-index-counter" id="aeb-index-counter">40 especies</p></div></section></div><div class="aeb-page-turner" aria-hidden="true"></div></div>`;
}
function renderPrologue(){
  const data=cache[state.region+'-'+state.volume];
  if(!data)return '<p class="aeb-waiting">Cargando prólogo…</p>';
  const r=REGION[state.region];
  const themed=themeForVolume(state.region,state.volume);
  const paragraphs=(data.preface||[]).map(text=>'<p>'+escapeHtml(text)+'</p>').join('');
  return `<div class="aeb-book"><div class="aeb-spread"><section class="aeb-page aeb-page-left"><div class="aeb-page-bg">${assetTag(r.paper,'aeb-page-image','Papel regional')}</div><div class="aeb-page-content aeb-illustration-page"><p class="aeb-kicker">TOMO ${romanTome(state.region,state.volume)} · ${escapeHtml(r.name.toUpperCase())}</p><h2>${escapeHtml(r.descriptions[state.volume-1])}</h2>${assetTag(r.cover,'aeb-prologue-image','Cubierta del tomo')}<div class="aeb-decor-frame aeb-divider">${assetTag(themed.separator,'aeb-divider-image','Separador regional')}</div></div></section><section class="aeb-page aeb-page-right"><div class="aeb-page-bg">${assetTag(r.paper,'aeb-page-image','Papel regional')}</div><div class="aeb-page-content aeb-record-page"><p class="aeb-kicker">ARCHIVOS DE FAËANDIR · INTRODUCCIÓN</p><h2>Palabras del explorador</h2><div class="aeb-prologue-scroll"><p class="aeb-prologue-intro">${escapeHtml(r.descriptions[state.volume-1])}</p>${paragraphs||'<p>No se registró una introducción adicional en este tomo.</p>'}</div><button type="button" class="aeb-prologue-next" data-action="start-volume">Comenzar a leer · Lámina ${(state.volume-1)*10+1}</button></div></section></div><div class="aeb-page-turner" aria-hidden="true"></div></div>`;
}
function renderDetails(){
  const data=cache[state.region+'-'+state.volume];
  if(!data)return '<p class="aeb-waiting">Cargando registros del tomo…</p>';
  const spec=data.creatures[state.creature];
  if(!spec)return '<p class="aeb-waiting">El registro solicitado no existe en este tomo.</p>';
  const r=REGION[state.region];
  const themed=themeForVolume(state.region,state.volume);
  const icons=chooseTrophies(spec);
  const facts=spec.facts.map(([k,v])=>`<div class="aeb-fact"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('');
  const blocks=spec.blocks.map(b=>b.type==='h'?`<h3>${escapeHtml(b.text)}</h3>`:`<p>${escapeHtml(b.text)}</p>`).join('');
  return `<div class="aeb-book"><div class="aeb-spread"><section class="aeb-page aeb-page-left"><div class="aeb-page-bg">${assetTag(r.paper,'aeb-page-image','Papel del tomo')}</div><div class="aeb-page-content aeb-illustration-page"><p class="aeb-kicker">LÁMINA ${String(spec.number).padStart(2,'0')} · TOMO ${romanTome(state.region,state.volume)}</p><h2>${escapeHtml(spec.name)}</h2><div class="aeb-hero-frame">${imageFromSpecies(spec)}</div><div class="aeb-creature-caption">${escapeHtml(spec.subtitle||'Observación de campo')}</div><div class="aeb-trophy-row"><span class="aeb-trophy-label">Rastros del cazador</span><div class="aeb-trophies">${icons.map(k=>`<div class="aeb-trophy" title="${escapeHtml(ASSETS[k].nombre)}">${assetTag(k,'aeb-trophy-icon',ASSETS[k].nombre)}<span>${escapeHtml(shortTrophyName(ASSETS[k].nombre))}</span></div>`).join('')}</div></div><div class="aeb-notloot">Iconografía de estudio · no equivale a materiales obtenibles en el juego</div></div></section><section class="aeb-page aeb-page-right"><div class="aeb-page-bg">${assetTag(r.paper,'aeb-page-image','Papel del tomo')}</div><div class="aeb-page-content aeb-record-page"><p class="aeb-kicker">REGISTROS NATURALISTAS · ${escapeHtml(r.name.toUpperCase())}</p><h2>${escapeHtml(spec.name)}</h2><div class="aeb-details-scroll" id="aeb-reader"><p class="aeb-creature-subtitle">${escapeHtml(spec.subtitle)}</p><div class="aeb-divider aeb-decor-frame">${assetTag(themed.separator,'aeb-divider-image','Separador ornamental')}</div>${facts?`<dl class="aeb-facts">${facts}</dl>`:''}<div class="aeb-natural-history">${blocks}</div></div><div class="aeb-reading-foot">CUADERNO DEL EXPLORADOR · ${escapeHtml(spec.number)}/40 · ${escapeHtml(r.name)}</div></div></section></div><div class="aeb-page-turner" aria-hidden="true"></div></div>`;
}
function chooseTrophies(spec){
  const t=(spec.name+' '+spec.subtitle+' '+spec.facts.map(a=>a.join(' ')).join(' ')).toLocaleLowerCase();
  if(/ave|cuervo|águila|murciélago|tengu|valravn|garza|basan|halcón|pájaro|emplumad/.test(t))return [28,33,32];
  if(/lobo|huargo|amarok|garm|canino|perro|zorro|kitsune|okuri/.test(t))return [25,35,40];
  if(/felino|lince|tigre|gato|nekomata|dientesable/.test(t))return [26,31,35];
  if(/alce|cabra|ciervo|uro|bóvido|caprin|cérvid|baku|kirin/.test(t))return [27,35,40];
  if(/serpiente|dragón|saurio|reptil|basilisco|lagarto|lindwurm|gusano|mizuchi|wani/.test(t))return [29,34,39];
  if(/araña|ciempiés|insecto|caparazón|escarabajo|crustáceo|cangrejo/.test(t))return [37,36,31];
  if(/oso|grendel|oni|trol|krampus|simio|yamawaro/.test(t))return [40,35,31];
  if(/mar|pez|kraken|pulpo|tiburón|cetáceo|ballena|calamar|acuático|selkie|foca/.test(t))return [34,36,39];
  return [31,39,44];
}
function shortTrophyName(name){return name.replace(/^Cráneo (de |con )?/,'Cráneo ').replace(/^Fragmento de /,'').replace(/^Trozo de /,'').slice(0,24);}
function renderNav(){
  const isShelf=state.view==='shelf';
  const r=REGION[state.region];
  const canPrev=state.view==='detail';
  const canNext=state.view==='detail';
  return `<nav class="aeb-nav"><button type="button" data-action="prev" ${canPrev?'':'disabled'} aria-label="Página anterior">${assetTag(r.prev,'aeb-nav-rune','Anterior')}<span>Anterior</span></button><div class="aeb-nav-center"><button data-action="to-shelf" type="button">✥ Regiones</button><button data-action="to-index" type="button" ${isShelf?'disabled':''}>☷ Índice</button><span>${state.view==='detail'?'Lámina '+(state.creature+1+10*(state.volume-1))+' de 40':state.view==='index'?r.name:state.view==='prologue'?'Prólogo del tomo '+state.volume:'Biblioteca'}</span></div><button type="button" data-action="next" ${canNext?'':'disabled'} aria-label="Página siguiente"><span>Siguiente</span>${assetTag(r.next,'aeb-nav-rune','Siguiente')}</button></nav>`;
}
function renderFull(){
  if(!app)return;
  app.className='aeb-host is-open';
  app.innerHTML=`<main class="aeb-overlay" data-region="${state.region}">${shellTop()}<div class="aeb-header"><span>EL BESTIARIO</span><strong>${state.view==='shelf'?'Biblioteca de las criaturas':state.view==='index'?REGION[state.region].chapter:'Registro de fauna'}</strong><span>FAËANDIR · AETERNALIS</span></div><div class="aeb-stage">${state.view==='shelf'?renderShelf():state.view==='index'?renderIndex():state.view==='prologue'?renderPrologue():renderDetails()}</div>${renderNav()}<p class="aeb-footnote">Las cifras y descripciones proceden de los tomos aportados; el canon definitivo requiere revisión editorial.</p></main>`;
  bindImages(app);
  if(state.view==='index'&&state.search)filterIndex(state.search);
}
function filterIndex(query){
  const val=String(query||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  let count=0;
  app.querySelectorAll('.aeb-creature-link').forEach(btn=>{
    const hay=btn.dataset.search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const show=!val||hay.includes(val);btn.hidden=!show;if(show)++count;
  });
  const counter=app.querySelector('#aeb-index-counter');if(counter)counter.textContent=count+' especies encontradas';
}
function open(){
  if(state.view!=='closed')return;
  initialParent=app.parentNode;
  initialNext=app.nextSibling;
  docScroll=document.body.style.overflow;
  if(initialParent)initialParent.removeChild(app);
  document.body.appendChild(app);
  document.body.style.overflow='hidden';
  state.view='shelf';state.region='bergheim';renderFull();
}
function close(){
  if(state.view==='closed')return;
  state.view='closed';document.body.style.overflow=docScroll;
  if(initialParent){if(initialNext&&initialNext.parentNode===initialParent)initialParent.insertBefore(app,initialNext);else initialParent.appendChild(app);}
  renderLauncher();
}
function pageTurn(fn,dir){
  if(state.busy)return;
  const book=app.querySelector('.aeb-book');
  if(!book){fn();renderFull();return;}
  state.busy=true;
  book.classList.add(dir==='prev'?'aeb-turn-prev':'aeb-turn-next');
  window.setTimeout(()=>{fn();renderFull();const newbook=app.querySelector('.aeb-book');if(newbook)newbook.classList.add('aeb-turn-finish');},390);
  window.setTimeout(()=>{state.busy=false;const b=app.querySelector('.aeb-book');if(b)b.classList.remove('aeb-turn-finish');},820);
}
async function selectCreature(region,volume,number,animated){
  if(state.busy)return;
  app.setAttribute('aria-busy','true');
  try{
    const data=await loadVolume(region,volume);
    if(!data.creatures[number])throw Error('Esta especie aún no figura en el tomo.');
    const change=()=>{state.region=region;state.volume=volume;state.creature=number;state.view='detail';state.search='';};
    if(animated)pageTurn(change,number<state.creature?'prev':'next');else {change();renderFull();}
  }catch(err){console.error('[Aeternalis/bestiario]',err);alert('No se pudo abrir este tomo. '+err.message);}
  finally{app.removeAttribute('aria-busy');}
}
async function selectPrologue(region,volume){
  if(state.busy)return;
  app.setAttribute('aria-busy','true');
  try{
    await loadVolume(region,volume);
    pageTurn(()=>{state.region=region;state.volume=volume;state.view='prologue';state.search='';},'next');
  }catch(err){console.error('[Aeternalis/bestiario]',err);alert('No se pudo abrir el prólogo. '+err.message);}
  finally{app.removeAttribute('aria-busy');}
}
function registerEvents(){
  app.addEventListener('click',event=>{
    const b=event.target.closest('[data-action]');if(!b)return;
    event.preventDefault();
    const action=b.dataset.action;
    if(action==='open')return open();
    if(action==='close')return close();
    if(action==='retry'){statusMessage('Comprobando estilos…');fetchStyles().then(renderLauncher).catch(e=>statusMessage(e.message,'aeb-failed'));return;}
    if(action==='choose-region'){state.region=b.dataset.region;state.search='';state.view='index';renderFull();return;}
    if(action==='to-shelf'){state.view='shelf';state.search='';renderFull();return;}
    if(action==='to-index'){if(state.view!=='shelf'){pageTurn(()=>{state.view='index';state.search='';},'prev');}return;}
    if(action==='open-volume')return selectCreature(state.region,Number(b.dataset.volume),0,true);
    if(action==='show-prologue')return selectPrologue(state.region,Number(b.dataset.volume));
    if(action==='start-volume')return selectCreature(state.region,state.volume,0,true);
    if(action==='go-creature')return selectCreature(b.dataset.region,Number(b.dataset.volume),Number(b.dataset.number),true);
    if(action==='prev'||action==='next'){
      if(state.view!=='detail'||state.busy)return;
      const count=state.volume*10+state.creature-9;
      const target=action==='prev'?count-1:count+1;
      if(target<1){pageTurn(()=>{state.view='index';},'prev');return;}
      if(target>40){pageTurn(()=>{state.view='index';},'next');return;}
      const n=Math.ceil(target/10);const j=(target-1)%10;
      return selectCreature(state.region,n,j,true);
    }
  });
  app.addEventListener('input',evt=>{if(evt.target.id==='aeb-search'){state.search=evt.target.value;filterIndex(state.search);}});
  document.addEventListener('keydown',evt=>{
    if(state.view==='closed')return;
    if(evt.key==='Escape')close();
    else if(!/input|textarea/i.test(document.activeElement&&document.activeElement.tagName||'')&&state.view==='detail'){
      if(evt.key==='ArrowLeft'){evt.preventDefault();app.querySelector('[data-action="prev"]')?.click();}
      if(evt.key==='ArrowRight'){evt.preventDefault();app.querySelector('[data-action="next"]')?.click();}
    }
  });
}
function attemptStart(){
  if(app)return;
  const root=document.getElementById(ROOT_ID);if(!root)return;
  app=root;
  app.textContent='Cargando estilos del bestiario desde h4…';
  registerEvents();
  fetchStyles().then(()=>{renderLauncher();}).catch(err=>{console.error('[Aeternalis/bestiario]',err);statusMessage(err.message,'aeb-failed');});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attemptStart,{once:true});
attemptStart();
if(!app){
  const observer=new MutationObserver(()=>{attemptStart();if(app)observer.disconnect();});
  observer.observe(document.documentElement,{subtree:true,childList:true});
  window.setTimeout(()=>observer.disconnect(),30000);
}
})();