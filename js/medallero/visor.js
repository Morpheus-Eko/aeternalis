/* Aeternalis · Salón del Medallero v1.1.0 */
(function(){
'use strict';
var root=document.getElementById('ae-medallero-app');
if(!root||root.dataset.amLoaded)return;
root.dataset.amLoaded='loading';
var BASE='https://morpheus-eko.github.io/aeternalis/';
var ASSETS=BASE+'assets/';
var emblemPaths=[
 "codex/estandartes/estrella_01.webp",
 "codex/estandartes/libro_01.webp",
 "naval/progresion/insignia_tripulacion_veterana.webp",
 "codex/estandartes/dragon_01.webp",
 "codex/estandartes/arbol_01.webp",
 "codex/estandartes/castillo_01.webp",
 "naval/progresion/insignia_flota_legendaria.webp",
 "codex/armamento/escudos/escudo_heraldico_estrella_azul_01.webp"
];
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function clean(x){return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function awards(x){var found=String(x||'').match(/\b\d+(?:[.,]\d+)?\s*(?:PE|MO|PO|TR)\b/gi)||[];return found.slice(0,4)}
function init(db){
 if(!db||!Array.isArray(db.medallas)||!Array.isArray(db.grupos))throw Error('Catálogo inválido');
 var medals=db.medallas,groups=db.grupos;
 var current=groups[0].id,query='',page=1,perPage=9,prevFocus=null,oldScroll='';
 function medalIcon(m){if(!m.icono)return '<span class="am-medal am-medal--empty"><span class="am-glyph" aria-hidden="true">✥</span></span>';return '<span class="am-medal"><img class="am-medal-image" src="'+esc(BASE+m.icono)+'" alt="" loading="lazy" decoding="async"></span>'}
 function tags(m){var arr=awards(m.premio);return arr.length?arr.map(function(x){return '<span class="am-reward">'+esc(x)+'</span>'}).join(''):'<span class="am-reward">Recompensa especial</span>'}
 function nav(g,i){return '<button type="button" data-group="'+esc(g.id)+'" class="'+(g.id===current?'is-active':'')+'" aria-pressed="'+(g.id===current)+'"><span class="am-nav-emblem" style="background-image:url(&quot;'+ASSETS+emblemPaths[i%emblemPaths.length]+'&quot;)"></span><span class="am-nav-text"><strong>'+esc(g.nombre)+'</strong><small>'+medals.filter(function(m){return m.grupo===g.id}).length+' distinciones</small></span></button>'}
 function card(m){return '<button class="am-card" type="button" data-medal="'+esc(m.id)+'" aria-label="Ver distinción '+esc(m.nombre)+'">'+medalIcon(m)+'<span class="am-card-content"><span class="am-serial">DISTINCIÓN Nº '+String(m.numero).padStart(2,'0')+'</span><span class="am-card-name">'+esc(m.nombre)+'</span><span class="am-teaser">'+esc(m.descripcion)+'</span><span class="am-rewards">'+tags(m)+'</span></span></button>'}
 root.innerHTML='<header class="am-header"><div class="am-standard am-standard--left" aria-hidden="true"><img alt="" src="'+ASSETS+'codex/estandartes/estrella_01.webp"></div><div class="am-heading"><img class="am-header-emblem" alt="" src="'+ASSETS+'codex/cabeceras/estrella_cinta_01.webp"><p class="am-kicker">Aeternalis · Galería de los honores</p><h1>El Medallero</h1><p class="am-subtitle">Salón de las Distinciones</p><p class="am-intro">Honores, proezas y recuerdos de quienes escriben las historias de Aeternalis.</p></div><div class="am-standard am-standard--right" aria-hidden="true"><img alt="" src="'+ASSETS+'codex/estandartes/dragon_01.webp"></div></header>'+
 '<div class="am-stats"><div class="am-stat"><b>'+medals.length+'</b><small>Distinciones</small></div><div class="am-stat"><b>'+medals.filter(function(m){return !!m.icono}).length+'</b><small>Ilustradas</small></div><div class="am-stat"><b>'+groups.length+'</b><small>Capítulos</small></div></div>'+
 '<div class="am-nav-wrap"><p class="am-nav-head">✦ Índice de los honores ✦</p><nav class="am-nav" aria-label="Categorías del medallero"></nav></div>'+
 '<div class="am-tools"><label class="am-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar distinción, requisito o premio…" aria-label="Buscar distinción" autocomplete="off"></label><span class="am-count"></span></div>'+
 '<div class="am-main"><div class="am-chapter"></div><div class="am-cards"></div><nav class="am-pages" aria-label="Paginación de medallas"></nav></div>'+
 '<footer class="am-footer">Catálogo elaborado a partir del Medallero original. Los capítulos son una clasificación editorial; las condiciones y los premios se conservan.</footer>'+
 '<div class="am-overlay" hidden><section class="am-dialog" role="dialog" aria-modal="true" aria-labelledby="am-detail-heading"><button class="am-close" aria-label="Cerrar detalle" type="button">×</button><div class="am-dialog-detail"></div></section></div>';
 var navEl=root.querySelector('.am-nav'),input=root.querySelector('.am-search input'),cards=root.querySelector('.am-cards'),chapter=root.querySelector('.am-chapter'),counter=root.querySelector('.am-count'),pager=root.querySelector('.am-pages'),overlay=root.querySelector('.am-overlay'),detail=root.querySelector('.am-dialog-detail');
 function filtered(){return medals.filter(function(m){return (query||m.grupo===current)&&clean(m.nombre+' '+m.descripcion+' '+m.premio+' '+(m.nota||'')).includes(clean(query))})}
 function render(){
  navEl.innerHTML=groups.map(nav).join('');
  var results=filtered(),total=Math.max(1,Math.ceil(results.length/perPage));page=Math.max(1,Math.min(page,total));
  var g=groups.find(function(x){return x.id===current})||groups[0];
  chapter.innerHTML='<div><h2>'+esc(query?'Resultados de búsqueda':g.nombre)+'</h2><p>'+esc(query?'Coincidencias en todo el catálogo':g.descripcion)+'</p></div><span class="am-chapter-insignia" aria-hidden="true" style="background-image:url(&quot;'+ASSETS+emblemPaths[Math.max(0,groups.indexOf(g))%emblemPaths.length]+'&quot;)"></span>';
  counter.textContent=results.length+' distinciones'+(query?' encontradas':' en este capítulo');
  var shown=results.slice((page-1)*perPage,page*perPage);
  cards.innerHTML=shown.length?shown.map(card).join(''):'<div class="am-empty">No se encontraron distinciones con ese criterio.</div>';
  pager.innerHTML=total>1?'<button data-page="prev" type="button"'+(page===1?' disabled':'')+'>❮</button><span>Folio '+page+' de '+total+'</span><button data-page="next" type="button"'+(page===total?' disabled':'')+'>❯</button>':'';
 }
 function open(m){
  prevFocus=document.activeElement;oldScroll=document.body.style.overflow;
  var group=groups.find(function(x){return x.id===m.grupo});
  detail.innerHTML='<div class="am-dialog-top">'+medalIcon(m)+'<div><div class="am-dialog-label">Distinción nº '+String(m.numero).padStart(2,'0')+' · '+esc(group?group.nombre:'Medallero')+'</div><h3 id="am-detail-heading">'+esc(m.nombre)+'</h3><div class="am-rewards">'+tags(m)+'</div></div></div><div class="am-detail"><h4>Requisitos de obtención</h4><p>'+esc(m.descripcion)+'</p><h4>Recompensa original</h4><p>'+esc(m.premio)+'</p>'+(m.nota?'<h4>Observaciones del Excel</h4><p>'+esc(m.nota)+'</p>':'')+(m.nivel?'<h4>Rango consignado</h4><p>'+esc(m.nivel)+'</p>':'')+'</div>';
  overlay.hidden=false;document.body.style.overflow='hidden';root.querySelector('.am-close').focus();
 }
 function close(){overlay.hidden=true;document.body.style.overflow=oldScroll;if(prevFocus&&prevFocus.focus)prevFocus.focus()}
 root.addEventListener('click',function(e){
  var control=e.target.closest&&e.target.closest('[data-group],[data-medal],[data-page]');if(!control||!root.contains(control))return;
  if(control.hasAttribute('data-group')){current=control.dataset.group;query='';page=1;input.value='';render()}
  else if(control.hasAttribute('data-medal')){var m=medals.find(function(x){return x.id===control.dataset.medal});if(m)open(m)}
  else if(control.dataset.page){page+=control.dataset.page==='next'?1:-1;render();chapter.scrollIntoView({block:'start',behavior:'smooth'})}
 });
 root.addEventListener('error',function(e){var img=e.target;if(img&&img.classList&&img.classList.contains('am-medal-image')){img.style.display='none';var glyph=document.createElement('span');glyph.className='am-glyph';glyph.textContent='✥';glyph.setAttribute('aria-hidden','true');img.parentElement.classList.add('am-medal--empty');img.parentElement.appendChild(glyph)}},true);
 input.addEventListener('input',function(){query=input.value.trim();page=1;render()});
 root.querySelector('.am-close').addEventListener('click',close);
 overlay.addEventListener('click',function(e){if(e.target===overlay)close()});
 document.addEventListener('keydown',function(e){if(overlay.hidden)return;if(e.key==='Escape')close();else if(e.key==='Tab'){var controls=overlay.querySelectorAll('button:not([disabled]),a[href]');if(controls.length===1){e.preventDefault();controls[0].focus()}}});
 render();root.dataset.amLoaded='ready';
}
fetch(BASE+'data/medallero.json?v=1.1.0',{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(init).catch(function(e){root.dataset.amLoaded='error';root.innerHTML='<p>No fue posible cargar el medallero. <a href="'+BASE+'medallero-preview.html">Abrir la vista de respaldo</a>.</p>';console.error('[Aeternalis/Medallero]',e)});
})();