/* Aeternalis · muestra aislada de los folios raciales, sin reglas nuevas */
(()=>{
'use strict';
const $=id=>document.getElementById(id),ROOT='../';
const urls=['../data/codice-salud/compendio.json?v=2.0.0','../assets/medicina/tomo-v02/catalogo-tematico.json?v=1.1.0','../assets/medicina/atlas-recortes-v01/indice-visor-racial.json?v=1.0.0'];
let entries=[],position=0,atlas={};
const validPath=path=>typeof path==='string'&&path.startsWith('assets/')&&!path.includes('..')&&/\.(webp|png|jpg)$/.test(path);
const src=path=>/^https?:\/\//.test(path||'')?path:ROOT+path;
function set(id,value){$(id).textContent=value||'';}
function picture(id,path,alt=''){const el=$(id);el.src=src(path);el.alt=alt;}
function renderAtlas(race){
 const host=$('ae-atlas-preview');host.replaceChildren();const sexes=atlas[race.id]||{};
 for(const sex of ['femenino','masculino']){
  if(race.id==='amarant'&&sex==='masculino')continue;
  const record=sexes[sex],file=record&&record.figura&&record.figura.pergamino;
  if(!validPath(file)||!file.startsWith('assets/medicina/atlas-recortes-v01/recortes/'))continue;
  const figure=document.createElement('figure'),link=document.createElement('a'),image=document.createElement('img'),caption=document.createElement('figcaption');
  const label=sex==='femenino'?'Mujer':'Hombre';
  link.href=src(file);link.target='_blank';link.rel='noopener noreferrer';link.title='Ampliar estudio anatómico';
  image.src=src(file);image.alt='Estudio anatómico '+label.toLowerCase()+' · '+race.title;image.loading='lazy';image.decoding='async';link.appendChild(image);
  caption.textContent=label+' · estudio anatómico provisional';
  figure.append(link,caption);host.appendChild(figure);
 }
 $('ae-legacy-anatomy').hidden=host.childElementCount>0;
}
function update(){
const item=entries[position];if(!item)return;
const {theme,race}=item,accent=/^#[\da-f]{6}$/i.test(theme.accent||'')?theme.accent:'#865839';
for(const id of ['ae-folio-left','ae-folio-right']){$(id).style.setProperty('--folio-background','url("'+src(theme.path)+'")');$(id).style.setProperty('--accent',accent);$(id).dataset.theme=theme.id;}
set('ae-race-name',race.title);set('ae-race-subtitle',race.subtitle);set('ae-shape',race.shape);set('ae-measure',race.measure);set('ae-habitat',race.habitat);set('ae-life',race.life);set('ae-habits',race.habits);set('ae-risks',race.risks);
set('ae-caption',race.detailTitle||'Lámina anatómica de estudio');set('ae-status',(race.status==='ilustración provisional'?'Ilustración provisional: no constituye canon anatómico.':'Estudio ilustrado de referencia. ')+' Ninguna lámina crea resistencias, estadísticas o inmunidades nuevas.');
picture('ae-figure',race.image,'Estudio de la anatomía: '+race.title);$('ae-figure-link').href=src(race.image);renderAtlas(race);
picture('ae-crest-left',theme.ornament);picture('ae-crest-right',theme.ornament);picture('ae-divider-left',theme.divider);picture('ae-divider-right',theme.divider);
for(const b of $('ae-race-menu').querySelectorAll('button'))b.setAttribute('aria-current',String(b.dataset.race===theme.id));
set('ae-race-status',(position+1)+' de '+entries.length+' · '+race.title+' · El mismo libro, con folios, emblemas y separadores propios.');
const book=$('ae-book');book.classList.remove('is-turning');void book.offsetWidth;book.classList.add('is-turning');
}
function move(delta){position=(position+delta+entries.length)%entries.length;update();}
$('ae-previous').addEventListener('click',()=>move(-1));$('ae-next').addEventListener('click',()=>move(1));
Promise.all(urls.map((u,i)=>fetch(u).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).catch(err=>{if(i===2)return null;throw err;}))).then(([book,themes,index])=>{
if(!Array.isArray(book.races)||!Array.isArray(themes.themes))throw Error('Catálogos no compatibles');
atlas=index&&index.schema==='aeternalis-medicina-indice-racial-v1'&&index.razas||{};
const byRace=new Map(book.races.map(x=>[x.id,x]));
entries=themes.themes.filter(t=>t.scope==='race'&&t.ready&&validPath(t.path)&&validPath(t.ornament)&&validPath(t.divider)&&byRace.has(t.id)).sort((a,b)=>a.order-b.order).map(theme=>({theme,race:byRace.get(theme.id)}));
if(entries.length!==8)throw Error('Se esperaban ocho folios raciales publicados; hay '+entries.length);
for(const item of entries){const button=document.createElement('button');button.type='button';button.dataset.race=item.theme.id;button.textContent=item.race.title;button.addEventListener('click',()=>{position=entries.indexOf(item);update();});$('ae-race-menu').appendChild(button);}
update();
}).catch(e=>set('ae-race-status','No se pudo abrir la biblioteca: '+e.message));
})();
