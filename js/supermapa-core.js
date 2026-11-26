/*
 AETERNALIS · SUPERMAPA LEAFLET v1.7 · sigilos medievales, red de caminos y navegación provisional
 HTML: <div class="hidethisprofile"></div><div id="aeternalis-atlas"></div>
 CSS: sustituir el contenido del Atlas en https://aeternalis.foroactivo.com/h5-supermapa2-0. No usar h4.
 Coordenadas cartográficas: 2048 × 1571, independientes de la resolución de la imagen.
 La red contiene conexiones PROPUESTAS, sujetas a validación con los mapas; ninguna equivale a vía oficial.
 Modo Cartógrafo: cambios locales y exportación JSON (NO escribe en el foro automáticamente).
*/
(()=>{
'use strict';
const CONFIG={
 CSS_PAGE:(location.hostname.endsWith('github.io')?'/aeternalis/css/supermapa-v1.7-h5.html':'/h5-supermapa2-0'), CSS_ID:'ae-leaflet-css-source',
 LEAFLET_CSS:'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
 LEAFLET_CDN:['https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'],
 STORAGE_KEY:'AETERNALIS_CARTOGRAFIA_BORRADOR_V16_EXPLORADOR',
 // Mapa de alta resolución de Aeternalis. Reemplaza solo esta URL si cambias de alojamiento.
 MAP_URL:'https://2img.net/i.imgur.com/sS5W8pV.jpeg',
 // Mapa anterior como respaldo público si falla la carga del anterior.
 MAP_FALLBACK:'https://i.postimg.cc/Dw9BBzXc/Mapa-3-21.png',
 LOGICAL_WIDTH:2048,LOGICAL_HEIGHT:1571,
 HEX_RADIUS:9.3333,HEX_PHASE_X:0,HEX_PHASE_Y:0,
 CLIMATE_STACKING:'multiplicativo' // Provisional: dos modificadores se multiplican.
};
const STATS={foot:{land:48,road:24},horse:{land:24,road:12},boat:{sea:24},air:{air:4}};
const SLEEP=Math.min;
// RED INICIAL NO CANONICA. Solo se confirma cada conexión desde el modo Cartógrafo.
const INITIAL_EDGES=window.__AETERNALIS_ATLAS_EDGES__;
function afterRoot(callback){
 let complete=false;
 const apply=()=>{if(complete)return;const r=document.getElementById('aeternalis-atlas');if(!r)return;complete=true;obs.disconnect();callback(r)};
 const obs=new MutationObserver(apply);obs.observe(document.documentElement,{childList:true,subtree:true});apply();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
}
function loadAtlasCSSFromH5(){
 // Acepta el CSS de h5 dentro de <style id="ae-leaflet-css-source">.
 // Compatibilidad con páginas HTML antiguas que muestran CSS como texto bruto.
 if(document.getElementById('ae-leaflet-active-css'))return Promise.resolve();
 return fetch(CONFIG.CSS_PAGE,{credentials:'same-origin',cache:'no-cache'}).then(response=>{
  if(!response.ok)throw Error('La página h5 devolvió HTTP '+response.status);
  return response.text();
 }).then(html=>{
  const doc=new DOMParser().parseFromString(html,'text/html');
  let css=doc.getElementById(CONFIG.CSS_ID)?.textContent||'';
  if(!css){
   const marker=html.match(/<!--\s*AE_LEAFLET_ATLAS_CSS_BEGIN\s*-->\s*<style[^>]*>([\s\S]*?)<\/style>\s*<!--\s*AE_LEAFLET_ATLAS_CSS_END\s*-->/i);
   if(marker)css=marker[1];
  }
  if(!css){
   const element=[...doc.querySelectorAll('style')].find(s=>s.textContent?.includes('#aeternalis-atlas'));
   if(element)css=element.textContent;
  }
  if(!css){
   // Página h5 con CSS sin etiqueta <style> (como algunas páginas existentes).
   const text=doc.body?.textContent||'';
   if(text.includes('#aeternalis-atlas')&&text.includes('{')&&text.includes('}'))css=text;
  }
  css=css.replace(/^\uFEFF/,'').trim();
  if(!css || !css.includes('#aeternalis-atlas'))throw Error('No se encontró CSS del Atlas en h5. Pega el archivo CSS completo para h5, incluyendo el <style id="ae-leaflet-css-source">.');
  const style=document.createElement('style');
  style.id='ae-leaflet-active-css';
  style.textContent=css;
  document.head.appendChild(style);
 });
}
function leafletCSS(){if(document.getElementById('ae-leaflet-lib-css'))return;
 const l=document.createElement('link');l.id='ae-leaflet-lib-css';l.rel='stylesheet';l.href=CONFIG.LEAFLET_CSS;document.head.appendChild(l);
}
function loadLeaflet(){leafletCSS();if(window.L&&window.L.CRS?.Simple)return Promise.resolve(window.L);
 return new Promise((resolve,reject)=>{
  let i=0;const next=()=>{if(i>=CONFIG.LEAFLET_CDN.length){reject(Error('Leaflet no se pudo cargar desde los dos CDN'));return}
   const s=document.createElement('script');s.src=CONFIG.LEAFLET_CDN[i++];s.onload=()=>window.L?resolve(window.L):next();s.onerror=next;document.head.appendChild(s)
  };next();
 });
}
function boot(root){
 if(root.dataset.aeLeafReady==='1')return;root.dataset.aeLeafReady='1';
 // Evitamos que la skin recorte el mapa, igual que en el Atlas anterior.
 if(root.parentElement!==document.body)document.body.appendChild(root);
 document.body.classList.add('ae-atlas-page');
 root.innerHTML='<div class="ae-leaf-status-err" style="padding:20px;background:#221e1b;color:#f0d9ad">Iniciando Atlas Leaflet de Aeternalis…</div>';
 Promise.all([loadAtlasCSSFromH5(),loadLeaflet()]).then(()=>start(root)).catch(err=>{
 root.innerHTML='<div class="ae-leaf-status-err" style="padding:24px;background:#321e1c;color:#f4d5b5">No se pudo iniciar el Atlas: '+escapeText(err.message)+'<p>Verifica el CSS de h5, que los cargadores anteriores estén desactivados y que los CDN de Leaflet sean accesibles.</p></div>';
 console.error('[Aeternalis Leaflet]',err);});
}
function escapeText(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const ATLAS_DATA=window.__AETERNALIS_ATLAS_DATA__;

function start(root){
 const D=ATLAS_DATA;
 const L=window.L;
 const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
 const viewportDate='Atlas Leaflet v1.7 · sigilos umbríos y rutas';
 let lastFocused=null;
 const byId=id=>document.getElementById(id);
 const esc=escapeText;
 const regionById=new Map(D.regions.map(r=>[r.id,r]));
 const ORIGINAL_COORDS=Object.fromEntries(D.places.map(p=>[p.id,{x:p.x,y:p.y}]));
 const ORIGINAL_REGIONS=Object.fromEntries(D.regions.map(r=>[r.id,r.points]));
 const cityById=new Map(D.places.map(c=>[c.id,c]));
 const factionNames={nordic:'Montaraces',human:'Humanos',dwarf:'Enanos',elf:'Elfos',pirate:'Archipiélago',independent:'Territorio independiente'};
 const iconPaths={nordic:'<path d="m4 7 7 7-7 7m10-18 6 6-6 6"/>',human:'<path d="M12 2.5 20 5v6.5c0 5.3-3.1 8.2-8 10-4.9-1.8-8-4.7-8-10V5Z"/>',dwarf:'<path d="m4 19 15-15M9 4l11 11"/>',elf:'<path d="M20 3C9 4 4 9 4 17c7 1 16-4 16-14Z"/>',pirate:'<path d="M12 3v16m-4-9h8"/>',independent:'<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z"/>'};
 const svgIcon=faction=>`<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${iconPaths[faction]||iconPaths.independent}</svg>`;
 root.innerHTML=`
 <section class="ae-atlas" aria-label="Supermapa de Aeternalis con Leaflet">
  <header class="ae-atlas__toolbar">
   <div class="ae-atlas__brand"><span class="ae-atlas__kicker">ATLAS DE LOS REINOS · CARTOGRAFÍA v1.7</span><h1>Aeternalis</h1></div>
   <div class="ae-atlas__search-box"><label for="ae-map-search" class="ae-sr-only">Buscar localidad</label><input id="ae-map-search" type="search" placeholder="Buscar ciudad o región…" autocomplete="off" aria-expanded="false" aria-controls="ae-map-results"><div id="ae-map-results" class="ae-atlas__results" hidden></div></div>
   <div class="ae-leaf-toolbar-actions" role="group" aria-label="Capas y navegación del atlas">
     <button id="ae-toggle-route" class="ae-toolbar-primary" type="button" aria-pressed="false" title="Planificar viaje entre localidades">✦ Planificar viaje</button>
     <button id="ae-toggle-roads" type="button" aria-pressed="true" title="Mostrar u ocultar las conexiones existentes">⌁ Caminos</button>
     <button id="ae-toggle-regions" type="button" aria-pressed="false" title="Mostrar polígonos territoriales">◈ Regiones</button>
     <button id="ae-toggle-grid" type="button" aria-pressed="true" title="Mostrar cuadrícula hexagonal">⬡ Hexágonos</button>
     <button id="ae-map-legend-toggle" type="button" aria-expanded="false" title="Significado de iconos y trazados">ⓘ Leyenda</button>
     <button id="ae-toggle-editor" class="ae-cartographer-only" type="button" aria-pressed="false" title="Herramientas avanzadas: cambios locales">✎ Cartógrafo</button>
    </div>
   <div class="ae-atlas__buttons"><button type="button" id="ae-map-reset" title="Mostrar mapa completo">⌖</button><a class="ae-atlas__exit" href="/" title="Regresar al foro">↩ Foro</a></div>
  </header>
  <div class="ae-atlas__viewport" id="ae-map-viewport">
   <div id="ae-leaflet-map" role="application" aria-label="Mapa cartográfico interactivo de Aeternalis"></div>
   <div class="ae-leaf-badge" id="ae-coordinate-output">Coordenadas lógicas (2048×1571) · Hexágono —</div>
   <div class="ae-leaf-banner" id="ae-leaf-banner" hidden></div>
   <aside class="ae-map-legend-panel" id="ae-map-legend-panel" hidden aria-label="Leyenda de Aeternalis">
     <div class="ae-legend-title"><strong>Leyenda cartográfica</strong><button type="button" id="ae-map-legend-close" aria-label="Cerrar leyenda">✕</button></div>
     <div class="ae-legend-entries">
      <span>♛ Capital</span><span>♜ Ciudad</span><span>⌂ Pueblo</span><span>✦ Ícono provisional para lugares sin clasificar</span>
      <span>♜ Academia o fortaleza</span><span>◉ Lugar singular</span>
      <span><i class="ae-legend-stroke ae-legend-road"></i> Camino</span><span><i class="ae-legend-stroke ae-legend-trail"></i> Senda</span>
      <span><i class="ae-legend-stroke ae-legend-sea"></i> Ruta marítima</span><span><i class="ae-legend-stroke ae-legend-selected"></i> Itinerario calculado</span>
     </div><p>Las líneas discontinuas representan conexiones propuestas, pendientes de validación cartográfica.</p>
   </aside>
   <aside id="ae-leaf-route-panel" class="ae-leaf-side" hidden aria-label="Planificador de expediciones"></aside>
   <aside id="ae-leaf-editor-panel" class="ae-leaf-side" hidden aria-label="Editor cartográfico"></aside>
  </div>
  <footer class="ae-atlas__footer"><span>${D.places.filter(p=>!p.atlasArchiveReason).length} lugares visibles · ${D.regions.length} regiones · Hexágonos calibrables · Cambios editoriales locales</span><span class="ae-atlas__legend">♛ Capital · ♜ Ciudad · ⌂ Pueblo · ✦ Ícono provisional · Conexiones propuestas indicadas con guiones</span></footer>
 </section>
 <div class="ae-atlas__modal-backdrop" id="ae-map-modal" hidden><section class="ae-atlas__dialog" role="dialog" aria-modal="true" aria-labelledby="ae-map-modal-title"><button type="button" class="ae-atlas__modal-close" id="ae-map-close" aria-label="Cerrar tablilla">✕</button><div id="ae-map-modal-body"></div></section></div>`;
 const modal=byId('ae-map-modal'),modalBody=byId('ae-map-modal-body'),search=byId('ae-map-search'),results=byId('ae-map-results');
 const routePanel=byId('ae-leaf-route-panel'), editorPanel=byId('ae-leaf-editor-panel');
 const map=L.map('ae-leaflet-map',{crs:L.CRS.Simple,minZoom:-4,maxZoom:3,zoomSnap:0.25,zoomDelta:0.5,zoomControl:true,attributionControl:true,maxBoundsViscosity:0.7,preferCanvas:true});
 const bounds=L.latLngBounds([-D.map.height,0],[0,D.map.width]);map.setMaxBounds(bounds.pad(.35));
 const atlasShell=root.querySelector('.ae-atlas');
 const cartographerEnabled=(new URLSearchParams(window.location.search).get('cartografo')==='1');
 if(!cartographerEnabled)byId('ae-toggle-editor').hidden=true;
 const legend=byId('ae-map-legend-panel');
 byId('ae-map-legend-toggle').addEventListener('click',()=>{legend.hidden=!legend.hidden;byId('ae-map-legend-toggle').setAttribute('aria-expanded',String(!legend.hidden))});
 byId('ae-map-legend-close').addEventListener('click',()=>{legend.hidden=true;byId('ae-map-legend-toggle').setAttribute('aria-expanded','false')});
 const base=L.imageOverlay(CONFIG.MAP_URL,bounds,{alt:'Mapa actual de Aeternalis',className:'ae-leaf-map-image',interactive:false}).addTo(map);
 base.on('error',()=>{if(base.getElement()?.getAttribute('src')===CONFIG.MAP_URL){base.setUrl(CONFIG.MAP_FALLBACK);banner('No se pudo cargar la imagen de alta resolución. Se muestra temporalmente el mapa de respaldo.')}});
 map.fitBounds(bounds,{padding:[10,10]});
 const syncPinLabels=()=>atlasShell.classList.toggle('ae-leaf-show-labels',map.getZoom()>=0.35);map.on('zoomend',syncPinLabels);syncPinLabels();
 function XY(x,y){return L.latLng(-y,x)}
 const pinLayer=L.layerGroup().addTo(map),regionLayer=L.layerGroup(),routeLayer=L.layerGroup().addTo(map),chosenLayer=L.layerGroup().addTo(map);
 const pinRefs=new Map(),regionRefs=new Map();
 const regionEditLayer=L.layerGroup().addTo(map);
 let activeRegionId='',addingRegionVertex=false,regionEditPolygon=null;
 const readPoints=r=>r.points.split(/\s+/).map(t=>t.split(',').map(Number)).filter(a=>a.length===2&&a.every(Number.isFinite));
 const writePoints=(r,points)=>{r.points=points.map(p=>Math.round(p[0]*10)/10+','+Math.round(p[1]*10)/10).join(' ');regionRefs.get(r.id)?.setLatLngs(points.map(p=>XY(p[0],p[1])));saveDraft();};
 function distSegment(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay;
  const t=dx*dx+dy*dy?Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy))):0;
  return (px-ax-t*dx)**2+(py-ay-t*dy)**2;
 }
 function renderRegionVertices(){
  regionEditLayer.clearLayers();if(!activeRegionId || !editorEnabled)return;
  const r=regionById.get(activeRegionId);if(!r)return;
  const pts=readPoints(r);
  pts.forEach(([x,y],index)=>{
   const handle=L.marker(XY(x,y),{draggable:true,keyboard:true,zIndexOffset:2500,
     icon:L.divIcon({className:'ae-region-vertex',html:'<span class="ae-region-vertex-dot" title="Arrastra para mover; doble clic para borrar">'+(index+1)+'</span>',iconSize:[20,20],iconAnchor:[10,10]})}).addTo(regionEditLayer);
   handle.on('drag',e=>{const ll=e.target.getLatLng();const updated=readPoints(r);updated[index]=[ll.lng,-ll.lat];regionRefs.get(r.id)?.setLatLngs(updated.map(p=>XY(p[0],p[1])))});
   handle.on('dragend',e=>{const ll=e.target.getLatLng();const updated=readPoints(r);updated[index]=[Math.max(0,Math.min(D.map.width,ll.lng)),Math.max(0,Math.min(D.map.height,-ll.lat))];writePoints(r,updated);renderRegionVertices();});
   handle.on('dblclick',e=>{L.DomEvent.stop(e);const updated=readPoints(r);if(updated.length<=3){banner('Un polígono necesita al menos 3 vértices',2700);return}updated.splice(index,1);writePoints(r,updated);renderRegionVertices()});
  });
  const num=document.getElementById('ae-region-vertex-count');if(num)num.textContent='Vértices editables: '+pts.length;
 }
 function addRegionVertex(x,y){const r=regionById.get(activeRegionId);if(!r)return;const pts=readPoints(r);let best=Infinity,idx=pts.length;
   for(let i=0;i<pts.length;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%pts.length];const score=distSegment(x,y,ax,ay,bx,by);if(score<best){best=score;idx=i+1}}
   pts.splice(idx,0,[x,y]);writePoints(r,pts);addingRegionVertex=false;renderRegionVertices();banner('Vértice añadido al borde; arrástralo para el ajuste fino',3200);
 }
 
 function banner(s,ms=0){const e=byId('ae-leaf-banner');e.textContent=s;e.hidden=!s;if(ms){setTimeout(()=>{if(e.textContent===s)e.hidden=true},ms)}}
 function pointFromEvent(ev){return {x:clamp(ev.latlng.lng,0,D.map.width),y:clamp(-ev.latlng.lat,0,D.map.height)}}
  // Supermapa 1.7 · Marcadores discretos de fantasía medieval oscura.
  // La iconografía de lugares pendientes es SOLO visual y no altera su clasificación.
  // Fijamos la elección con el id para que no cambie entre visitas ni por navegador.
  function provisionalIconFor(p){
    const choices=['village','city','fortress','ruins','watchtower'];
    const seed=String(p.id||p.name||'aeternalis');
    let hash=2166136261;
    for(let i=0;i<seed.length;i++){
      hash^=seed.charCodeAt(i);
      hash=Math.imul(hash,16777619);
    }
    return choices[(hash>>>0)%choices.length];
  }
  function markerIconCategory(p){
    const n=String(p.name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(n.includes('salones dorados'))return 'golden-halls';
    if(n.includes('torre blanca'))return 'white-tower';
    if(n.includes('academia njfarell')||n.includes('academia de niefhel')||n.includes('academia nifhel'))return 'magic-academy';
    if(n.includes('laberinto'))return 'labyrinth';
    if(n.includes('cavernas')||n.includes('cueva')||n.includes('gruta'))return 'cave';
    if(n.includes('bahia hirion')||n.includes('puerto')||n.includes('faro'))return 'port';
    if(n.includes('fortaleza')||n.includes('fuerte')||n.includes('bastion'))return 'fortress';
    if(n.includes('santuario')||n.includes('templo'))return 'sanctuary';
    if(n.includes('ruinas'))return 'ruins';
    const known={capital:'capital',ciudad:'city',pueblo:'village',especial:'special'}[p.symbolType];
    return known||provisionalIconFor(p);
  }
  // Trazos de inspiración heráldica y xilográfica, creados para el Atlas.
  // Todos los glifos son SVG inline: sin dependencias ni imágenes externas.
  const markerArt={
    capital:'<path d="M3 9l4.5 2 4.5-7 4.5 7 4.5-2-2 10H5z"/><path d="M5 20h14M9 15h6M12 2v2"/>',
    city:'<path d="M3 21V10l3-2 3 2V5l3-3 3 3v5l3-2 3 2v11z"/><path d="M10 21v-5a2 2 0 014 0v5M5 13h2m10 0h2"/>',
    village:'<path d="M3 12l9-8 9 8M5 11v10h14V11M10 21v-6h4v6M7 14h1m8 0h1"/>',
    special:'<path d="M12 2l2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/><path d="M12 7v10M7 12h10"/>',
    watchtower:'<path d="M8 21V6h8v15M6 6l2-3h3l1 2 1-2h3l2 3M5 21h14M11 21v-5h2v5M10 10h4M10 13h4"/>',
    'golden-halls':'<path d="M2 21h20M4 20V10l8-6 8 6v10M8 20v-8h8v8M10 9h4M12 1v3"/><path d="M5 15h3m8 0h3"/>',
    'white-tower':'<path d="M7 21V6h10v15M6 6l2-4 4 2 4-2 2 4M5 21h14M11 21v-5h2v5M9 10h2m3 0h2M9 13h2m3 0h2"/>',
    'magic-academy':'<path d="M4 21V9l8-6 8 6v12M7 21h10M12 8v11M7.5 13h9M9 10l6 6m0-6-6 6"/>',
    labyrinth:'<path d="M3 3h18v18H3zM7 3v5h5v4H7v5h10v-5h4M12 3v2m0 16v-5M3 12h4"/>',
    cave:'<path d="M2 21L8 5l4 4 4-7 6 19H2zM9 21v-4q3-6 6 0v4"/>',
    port:'<path d="M12 2v15m-6-9 6-6 6 6M3 16q9 7 18 0M5 20q7 3 14 0"/>',
    fortress:'<path d="M3 21V8h4V5h4v3h2V5h4v3h4v13H3zM9 21v-6h6v6M6 12h2m8 0h2"/>',
    sanctuary:'<path d="M12 2 3 9v12h18V9zM7 21v-8h10v8M12 6v10m-3-6h6"/>',
    ruins:'<path d="M3 21h18M5 20V8h4v6m6 6V7h4v13M4 8h16M6 4h12M10 16l3-3"/>'
  };
  function pinIcon(p){
    const type=markerIconCategory(p);
    const glyph=markerArt[type]||markerArt.special;
    const isProvisional=!['capital','ciudad','pueblo','especial'].includes(p.symbolType);
    const a11y=esc((isProvisional?'Iconografía provisional':'Lugar cartográfico')+' · '+p.name);
    const icon=`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="miter" stroke-linecap="square">${glyph}</svg>`;
    return L.divIcon({className:'ae-leaf-pin ae-map-marker ae-marker--'+type+' ae-leaf-pin--'+(p.faction||'independent')+(isProvisional?' ae-marker--provisional':''),html:`<span class="ae-leaf-pin-wrap"><span class="ae-leaf-pin-dot ae-marker-medallion" role="img" aria-label="${a11y}">${icon}</span><span class="ae-leaf-pin-label">${esc(p.name)}</span></span>`,iconSize:[1,1],iconAnchor:[0,0]});
  }
  function setDragging(enabled){for(const marker of pinRefs.values()){if(enabled)marker.dragging.enable();else marker.dragging.disable();}}
 for(const p of D.places.filter(p=>!p.atlasArchiveReason)){const marker=L.marker(XY(p.x,p.y),{icon:pinIcon(p),draggable:false,keyboard:true,riseOnHover:true}).addTo(pinLayer);pinRefs.set(p.id,marker);
  marker.bindTooltip(p.name,{direction:'top',offset:[0,-10]});
  marker.on('click',()=>{if(editorEnabled){byId('ae-edit-selected').value=p.id;refreshSelected();return}openCity(p)});
  marker.on('dragend',e=>{const ll=e.target.getLatLng();p.x=Math.round(clamp(ll.lng,0,D.map.width)*10)/10;p.y=Math.round(clamp(-ll.lat,0,D.map.height)*10)/10;saveDraft();refreshSelected();rerenderRoutes();banner('Coordenadas de '+p.name+' actualizadas: '+p.x+', '+p.y,2400)});
 }
 for(const r of D.regions){const coords=r.points.split(/\s+/).map(t=>t.split(',').map(Number)).filter(a=>a.length===2).map(a=>XY(a[0],a[1]));
  const pl=L.polygon(coords,{color:'rgb('+(r.rgb||'170,145,110')+')',weight:1.7,opacity:0.85,fillOpacity:0.10,interactive:true,className:'ae-leaf-region'});pl.bindTooltip(r.name,{sticky:true});pl.on('click',()=>{if(!editorEnabled)openRegion(r)});pl.addTo(regionLayer);regionRefs.set(r.id,pl)
 }
 let gridVisible=true,regionsVisible=false,roadsVisible=true,routeVisible=false,editorEnabled=false;
 let hex={radius:CONFIG.HEX_RADIUS,phaseX:CONFIG.HEX_PHASE_X,phaseY:CONFIG.HEX_PHASE_Y};
 let edges=INITIAL_EDGES.map(e=>({...e,via:[...(e.via||[])]})),pendingVia=[],draftLine=null, drawing=false;
 let selectedEdgeId='';
 const validEdge=e=>e&&cityById.has(e.from)&&cityById.has(e.to)&&e.from!==e.to&&['road','trail','sea'].includes(e.kind);
 const cloneBase=()=>INITIAL_EDGES.map(e=>({...e,via:[...(e.via||[])]}));
 let currentRoute=null;
 const defaultState={hex:{radius:CONFIG.HEX_RADIUS,phaseX:0,phaseY:0},cities:{},edges:[]};
 function readDraft(){try{const d=JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)||'null');return d&&typeof d==='object'?d:null}catch{return null}}
 const saved=readDraft();
 if(saved){if(saved.regions){for(const [id,pointStr] of Object.entries(saved.regions)){
  const region=regionById.get(id);if(region&&typeof pointStr==='string'&&pointStr.split(' ').length>=3){region.points=pointStr;const coords=readPoints(region).map(p=>XY(p[0],p[1]));regionRefs.get(id)?.setLatLngs(coords)}
 }}
 if(saved.hex){hex={...hex,...saved.hex}};
 if(Array.isArray(saved.edges)){
  const old=saved.edges.filter(validEdge);
  if((saved.networkVersion||0)>=13){edges=old;} // Conservar las eliminaciones y confirmaciones del usuario
  else { // Migrar borradores antiguos sin borrar la red inicial
   const byKey=new Map(edges.map(e=>[[e.from,e.to].sort().join('|'),e]));
   for(const e of old)byKey.set([e.from,e.to].sort().join('|'),{...e,status:e.status||'confirmada'});
   edges=[...byKey.values()];
  }
 }
  if(saved.cities&&typeof saved.cities==='object'){for(const [id,pos] of Object.entries(saved.cities)){const p=cityById.get(id);if(p&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)){p.x=clamp(pos.x,0,D.map.width);p.y=clamp(pos.y,0,D.map.height);pinRefs.get(id)?.setLatLng(XY(p.x,p.y))}}}
 }
 function saveDraft(){try{const cities={};for(const p of D.places)cities[p.id]={x:p.x,y:p.y};localStorage.setItem(CONFIG.STORAGE_KEY,JSON.stringify({version:1,networkVersion:15,hex,cities,regions:Object.fromEntries(D.regions.map(r=>[r.id,r.points])),edges,source:'Atlas v1.5: posiciones publicas consolidadas desde exportacion JSON del autor'}));}catch(e){console.warn('Borrador local no disponible',e)}}
 // Lattice calculated from the old hex-image (flat-top): horizontal q step ~14 and vertical r step ~16 logical units.
 function hexWorld(q,r){const R=hex.radius;return {x:hex.phaseX+1.5*R*q,y:hex.phaseY+Math.sqrt(3)*R*(r+q/2)}}
 function hexFromXY(x,y){const R=hex.radius;const u=x-hex.phaseX,v=y-hex.phaseY;
  const fq=(2/3*u/R),fr=(-u/3+Math.sqrt(3)/3*v)/R;
  let X=fq,Z=fr,Y=-X-Z, rx=Math.round(X),ry=Math.round(Y),rz=Math.round(Z);
  const dx=Math.abs(rx-X),dy=Math.abs(ry-Y),dz=Math.abs(rz-Z);
  if(dx>dy&&dx>dz)rx=-ry-rz;else if(dy>dz)ry=-rx-rz;else rz=-rx-ry;
  return {q:rx,r:rz};
 }
 function hexDistance(a,b){const ha=hexFromXY(a.x,a.y),hb=hexFromXY(b.x,b.y),q=ha.q-hb.q,r=ha.r-hb.r;return Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));}
 function polyHexDistance(points){let d=0;for(let i=1;i<points.length;i++)d+=hexDistance(points[i-1],points[i]);return Math.max(1,d)}
 let hexOverlay=null;
 function redrawGrid(){if(hexOverlay){map.removeLayer(hexOverlay);hexOverlay=null;}if(!gridVisible)return;
  const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg'),def=document.createElementNS(ns,'defs'),pattern=document.createElementNS(ns,'pattern'),shape=document.createElementNS(ns,'path'),rect=document.createElementNS(ns,'rect');
  const R=hex.radius,H=Math.sqrt(3)*R,dx=1.5*R, X0=hex.phaseX,Y0=hex.phaseY;
  svg.setAttribute('xmlns',ns);svg.setAttribute('width',D.map.width);svg.setAttribute('height',D.map.height);svg.setAttribute('viewBox',`0 0 ${D.map.width} ${D.map.height}`);
  const id='ae-hex-pattern-v1';pattern.setAttribute('id',id);pattern.setAttribute('patternUnits','userSpaceOnUse');pattern.setAttribute('x',X0);pattern.setAttribute('y',Y0);pattern.setAttribute('width',3*R);pattern.setAttribute('height',H*2);
  let d='';for(const center of [[0,0],[dx,H/2],[3*R,0],[0,2*H],[3*R,2*H],[dx,-3*H/2],[dx,5*H/2]]){
   const pts=[[R,0],[R/2,H/2],[-R/2,H/2],[-R,0],[-R/2,-H/2],[R/2,-H/2]].map(([x,y])=>[x+center[0],y+center[1]]);
   d+='M'+pts.map(t=>t.map(z=>z.toFixed(3)).join(' ')).join('L')+'Z';
  }
  shape.setAttribute('d',d);shape.setAttribute('fill','none');shape.setAttribute('stroke','#161e23');shape.setAttribute('stroke-width','0.7');shape.setAttribute('stroke-opacity','0.65');pattern.appendChild(shape);def.appendChild(pattern);svg.appendChild(def);
  rect.setAttribute('width','100%');rect.setAttribute('height','100%');rect.setAttribute('fill',`url(#${id})`);svg.appendChild(rect);
  hexOverlay=L.svgOverlay(svg,bounds,{interactive:false,opacity:.85,className:'ae-leaf-hex-layer'}).addTo(map);
 }
 redrawGrid();
 function formatCoord(x){return Number(x).toFixed(1).replace('.0','')}
 function showCoords(ev){const pt=pointFromEvent(ev),h=hexFromXY(pt.x,pt.y);byId('ae-coordinate-output').textContent=`X ${formatCoord(pt.x)} · Y ${formatCoord(pt.y)} · Hexágono q ${h.q} / r ${h.r}`}
 map.on('mousemove',showCoords);
 // The layer graph is empty initially: roads and sea lanes must be registered by the cartographer.
 function endpoints(e){const a=cityById.get(e.from),b=cityById.get(e.to);return a&&b?[{x:a.x,y:a.y},...(e.via||[]),{x:b.x,y:b.y}]:null}
 function updateEdgeHexes(e){const pts=endpoints(e);return pts?polyHexDistance(pts):0}
 function routeLabel(e){
  const names=[cityById.get(e.from)?.name,cityById.get(e.to)?.name].filter(Boolean);
  const type={road:'Camino',trail:'Senda',sea:'Navegación'}[e.kind]||'Tramo';
  return `${names.join(' → ')} · ${type} · ${updateEdgeHexes(e)} hex. · ${e.status==='confirmada'?'CONFIRMADO':'PROPUESTA'} (no oficial)`;
 }
 function rerenderRoutes(){routeLayer.clearLayers();if(roadsVisible){for(const e of edges){const pts=endpoints(e);if(!pts)continue;
   const color=e.kind==='sea'?'#70c9df':e.kind==='road'?'#d8ae66':'#ab9c7b';
   const provisional=e.status!=='confirmada';
   const poly=L.polyline(pts.map(p=>XY(p.x,p.y)),{color,weight:provisional?2.0:3.4,opacity:provisional?.57:.93,dashArray:provisional?(e.kind==='sea'?'4 7':'3 6'):(e.kind==='trail'?'8 4':null)});
   poly.bindTooltip(routeLabel(e));poly.on('click',()=>{
    if(editorEnabled){selectedEdgeId=e.id;const sel=byId('ae-edge-selected');if(sel)sel.value=e.id;showSelectedEdge();}
   });poly.addTo(routeLayer);
  }}
  if(currentRoute)drawRoute(currentRoute);
 }
 function focusCalculatedRoute(){
    if(!currentRoute)return;
    let pts=[];
    if(currentRoute.direct)pts=[currentRoute.start,currentRoute.end];
    else for(const e of currentRoute.edges){const coords=endpoints(e);if(coords)pts.push(...coords);}
    if(pts.length)map.fitBounds(L.latLngBounds(pts.map(p=>XY(p.x,p.y))),{padding:[70,70],maxZoom:1.6});
  }
  function drawRoute(route){
    chosenLayer.clearLayers();if(!routeVisible||!route)return;
    const segments=route.direct?[[route.start,route.end]]:route.edges.map(e=>endpoints(e)).filter(Boolean);
    segments.forEach((pts,index)=>{
      const sea=!route.direct&&route.edges[index].kind==='sea';
      const line=pts.map(p=>XY(p.x,p.y));
      L.polyline(line,{color:'#161b25',weight:10,opacity:.88,lineJoin:'round',lineCap:'round',interactive:false}).addTo(chosenLayer);
      L.polyline(line,{color:sea?'#4ad7f3':'#ffe293',weight:5.7,opacity:1,lineJoin:'round',lineCap:'round',interactive:false,dashArray:sea?'11 8':null}).addTo(chosenLayer);
    });
    const ids=route.ids||[];
    const unique=new Set();
    ids.forEach((id,i)=>{
      if(unique.has(id))return;unique.add(id);
      const p=cityById.get(id);if(!p)return;
      const role=i===0?'start':i===ids.length-1?'end':'stop';
      const glyph=i===0?'A':i===ids.length-1?'B':String(i);
      const marker=L.marker(XY(p.x,p.y),{interactive:true,keyboard:false,zIndexOffset:1700,icon:L.divIcon({className:'ae-route-stop-marker ae-route-stop--'+role,html:`<span title="${esc(p.name)}">${glyph}</span>`,iconSize:[22,22],iconAnchor:[11,11]})}).addTo(chosenLayer);
      marker.bindTooltip(`${i===0?'Origen':i===ids.length-1?'Destino':'Escala '+i}: ${p.name}`,{direction:'top'});
    });
  }
  function edgeCost(e,mode){const n=updateEdgeHexes(e);const isSea=e.kind==='sea';let h;
  if(mode==='air'){h=n*4}
  else if(isSea){if(['boat','footboat','horseboat'].includes(mode))h=n*24;else return Infinity}
  else {const m=(mode==='footboat'?'foot':mode==='horseboat'?'horse':mode);if(m!=='foot'&&m!=='horse')return Infinity;h=n*STATS[m][e.kind==='road'?'road':'land']}
  const climate=(e.climate==='snow'||e.climate==='hot')?1.25:1;
  const terrain=['arid','forest','swamp','mountain','jungle'].includes(e.terrain)?1.5:1;
  // Camino protege del terreno, no de las condiciones de nieve o calor.
  const terrainEffect=e.kind==='road'?1:terrain;
  const weatherEffect=climate;
  const modifier=(mode==='air')?climate:(CONFIG.CLIMATE_STACKING==='multiplicativo'?terrainEffect*weatherEffect:1+(terrainEffect-1)+(weatherEffect-1));
  return h*modifier;
 }
 function findNetworkRoute(from,to,mode,confirmedOnly=false){const dist=new Map(D.places.map(p=>[p.id,Infinity]));const prev=new Map(),open=new Set([from]);dist.set(from,0);
  while(open.size){let u=null,best=Infinity;for(const id of open){if(dist.get(id)<best){u=id;best=dist.get(id)}}if(u===null||u===to)break;open.delete(u);
   for(const e of edges){if(e.from!==u&&e.to!==u)continue;if(confirmedOnly&&e.status!=='confirmada')continue;const cost=edgeCost(e,mode);if(!isFinite(cost))continue;const v=e.from===u?e.to:e.from;const next=best+cost;
    if(next<dist.get(v)){dist.set(v,next);prev.set(v,{from:u,edge:e});open.add(v)}}
  }
  if(!isFinite(dist.get(to)))return null;
  const segments=[],ids=[to];let cursor=to;while(cursor!==from){const x=prev.get(cursor);if(!x)return null;segments.unshift(x.edge);cursor=x.from;ids.unshift(cursor)}
  return {ids,edges:segments,hours:dist.get(to)};
 }
 function formatHours(hours){const d=Math.floor(hours/24),h=hours-d*24;
  return `${Number((hours/24).toFixed(2))} día(s) · ${Number(hours.toFixed(1))} h`;
 }
 function fmtDuration(hours){
    if(!Number.isFinite(hours))return 'No disponible';
    const h=Math.round(hours*10)/10;
    const days=h/24;
    return `${days.toLocaleString('es-CL',{maximumFractionDigits:2})} días · ${h.toLocaleString('es-CL',{maximumFractionDigits:1})} h`;
  }
  const LABEL_TRANSPORT={foot:'A pie',horse:'Montura terrestre',boat:'Barco',footboat:'A pie y barco',horseboat:'Montura y barco',air:'Montura aérea'};
  const LABEL_ROUTE_KIND={road:'Camino terrestre',trail:'Senda o campo a través',sea:'Ruta marítima'};
  const LABEL_TERRAIN={normal:'Terreno ordinario',forest:'Bosque',mountain:'Montaña',arid:'Árido',swamp:'Pantano',jungle:'Selva',sea:'Mar'};
  const LABEL_WEATHER={normal:'Sin penalización meteorológica',snow:'Nevado +25 %',hot:'Caluroso +25 %'};
  const totalHexes=route=>route.direct?hexDistance(route.start,route.end):route.edges.reduce((sum,e)=>sum+updateEdgeHexes(e),0);
  function routeResult(){
    const a=byId('ae-route-from')?.value,b=byId('ae-route-to')?.value,mode=byId('ae-route-mode')?.value||'foot';
    const node=byId('ae-route-result');if(!node)return;
    if(!a||!b||a===b){node.innerHTML='<div class="ae-route-empty">Selecciona un origen y un destino diferentes para planificar la expedición.</div>';return;}
    const name=id=>esc(cityById.get(id)?.name||id);
    const from=cityById.get(a),to=cityById.get(b);
    let route;
    if(mode==='air'){
      const hours=hexDistance(from,to)*4;
      route={ids:[a,b],edges:[],direct:true,start:from,end:to,hours};
    } else {
      route=findNetworkRoute(a,b,mode,!!byId('ae-route-strict')?.checked);
    }
    currentRoute=route;
    if(!route){chosenLayer.clearLayers();node.innerHTML=`<div class="ae-route-empty"><strong>No existe una ruta disponible.</strong><p>Las conexiones registradas no permiten llegar al destino con el transporte y las condiciones elegidas. Prueba un viaje mixto o permite los tramos provisionales.</p><p>No se inventan caminos para unir localidades aisladas.</p></div>`;return;}
    routeVisible=true;byId('ae-toggle-route').setAttribute('aria-pressed','true');drawRoute(route);focusCalculatedRoute();
    const proposed=route.edges.filter(e=>e.status!=='confirmada').length;
    const duration=fmtDuration(route.hours);
    const steps=route.direct?0:route.edges.length;
    const stops=Math.max(0,route.ids.length-2);
    const h=totalHexes(route);
    const modeCaption=LABEL_TRANSPORT[mode]||mode;
    const status=route.direct?'Vuelo directo estimativo':proposed?`${proposed} ${proposed===1?'tramo propuesto':'tramos propuestos'} · por validar`:'Tramos confirmados';
    const summary=`<div class="ae-route-summary">
      <div class="ae-route-overline">INFORME DE EXPEDICIÓN · ${esc(modeCaption)}</div>
      <div class="ae-route-destinations"><span>${name(a)}</span><span class="ae-route-separator">⇢</span><span>${name(b)}</span></div>
      <div class="ae-route-time"><span class="ae-route-time-label">Duración estimada</span><strong>${esc(duration)}</strong></div>
      <div class="ae-route-metrics">
       <div><strong>${h}</strong><span>hexágonos</span></div>
       <div><strong>${steps}</strong><span>tramos</span></div>
       <div><strong>${stops}</strong><span>escalas</span></div>
      </div>
      <div class="ae-route-state ${proposed?'ae-route-state--warning':''}">${route.direct?'✧':proposed?'⚠':'✓'} ${esc(status)}</div>
     </div>`;
    if(route.direct){node.innerHTML=summary+`<section class="ae-route-stages"><h3>Itinerario aéreo</h3><div class="ae-route-air-note">Trayecto directo de ${h} hexágonos × 4 horas. El cálculo no incorpora tormentas u otras condiciones del cielo que aún no estén registradas. Las monturas especiales pueden tener velocidades distintas.</div></section>`;return;}
    const stages=route.edges.map((e,i)=>{
      const n=updateEdgeHexes(e),cost=edgeCost(e,mode),isProv=e.status!=='confirmada';
      const terrain=LABEL_TERRAIN[e.terrain]||'Terreno no clasificado',weather=LABEL_WEATHER[e.climate]||e.climate;
      const terrainFactor=e.kind==='road'?1:(['arid','forest','swamp','mountain','jungle'].includes(e.terrain)?1.5:1);
      const weatherFactor=['snow','hot'].includes(e.climate)?1.25:1;
      const modifier=mode==='air'?weatherFactor:(CONFIG.CLIMATE_STACKING==='multiplicativo'?terrainFactor*weatherFactor:1+(terrainFactor-1)+(weatherFactor-1));
      const penalty=modifier!==1?`<span class="ae-stage-penalty">Modificador ×${Number(modifier.toFixed(3))}</span>`:'';
      return `<li class="ae-route-stage" data-route-leg="${i}">
       <div class="ae-route-stage-index">${i+1}</div>
       <div class="ae-route-stage-body"><div class="ae-route-stage-title">${name(route.ids[i])} <span>→</span> ${name(route.ids[i+1])}</div>
       <div class="ae-route-stage-meta"><span>${esc(LABEL_ROUTE_KIND[e.kind])}</span><span>${n} hex.</span><strong>${esc(fmtDuration(cost))}</strong></div>
       <div class="ae-route-stage-details">${esc(terrain)} · ${esc(weather)} ${penalty} ${isProv?'<span class="ae-stage-proposed">Por validar</span>':''}</div></div>
      </li>`;
    }).join('');
    node.innerHTML=summary+`<section class="ae-route-stages"><h3>Etapas del recorrido</h3><ol class="ae-route-stage-list">${stages}</ol></section>
    <div class="ae-route-disclaimer">Los tiempos se calculan con la escala oficial por hexágono y el terreno registrado en cada tramo. Las conexiones propuestas, sus trayectorias y las penalizaciones acumuladas requieren validación del lore.</div>`;
  }
  const options=()=>D.places.filter(p=>!p.atlasArchiveReason).sort((a,b)=>a.name.localeCompare(b.name,'es')).map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
 function renderRoutePanel(){
    const saved={from:byId('ae-route-from')?.value,to:byId('ae-route-to')?.value,mode:byId('ae-route-mode')?.value,strict:byId('ae-route-strict')?.checked};
    routePanel.innerHTML=`<div class="ae-route-head"><div><span class="ae-route-kicker">ATLAS · NAVEGACIÓN</span><h2>Planificador de expediciones</h2><p>Encuentra el recorrido de menor tiempo por la red registrada.</p></div><button type="button" id="ae-route-close" class="ae-route-close" aria-label="Cerrar planificador">✕</button></div>
      <div class="ae-route-form"><div class="ae-leaf-two"><div><label for="ae-route-from">01 · Origen</label><select id="ae-route-from">${options()}</select></div><div><label for="ae-route-to">02 · Destino</label><select id="ae-route-to">${options()}</select></div></div>
      <div class="ae-route-mode-field"><label for="ae-route-mode">03 · Medio de transporte</label><select id="ae-route-mode"><option value="foot">A pie</option><option value="horse">Montura terrestre</option><option value="boat">Barco</option><option value="footboat">A pie + barco</option><option value="horseboat">Montura + barco</option><option value="air">Montura aérea (vuelo directo)</option></select></div>
      <label class="ae-route-filter"><input type="checkbox" id="ae-route-strict"> <span><strong>Solo rutas confirmadas</strong><small>Excluir caminos y travesías pendientes de verificar.</small></span></label>
      <div class="ae-route-actions"><button type="button" id="ae-route-run" class="ae-button-main">✦ Calcular expedición</button><button type="button" id="ae-route-swap" title="Intercambiar origen y destino">⇄ Invertir</button></div></div>
      <div class="ae-route-output" id="ae-route-result" aria-live="polite"><div class="ae-route-empty"><strong>Prepara tu itinerario</strong><p>Selecciona origen y destino para conocer las ciudades intermedias, la cantidad de hexágonos y las jornadas estimadas.</p></div></div>
      <div class="ae-route-footer-actions"><button type="button" id="ae-route-focus">◎ Ver recorrido completo en el mapa</button><button type="button" id="ae-route-clear">✕ Borrar trazado</button></div>
      <details class="ae-route-method"><summary>¿Cómo se calculan los tiempos?</summary><p>Por hexágono: a pie 48 h; con montura terrestre 24 h; por caminos 24 h y 12 h respectivamente; en barco 24 h; por aire 4 h. Los modificadores del terreno y del clima se aplican según cada conexión.</p><p>Esta red es provisional. Una ruta posible no significa que el trazado esté aprobado en el canon.</p></details>`;
    if(saved.from&&cityById.has(saved.from))byId('ae-route-from').value=saved.from;
    if(saved.to&&cityById.has(saved.to))byId('ae-route-to').value=saved.to;
    if(saved.mode)byId('ae-route-mode').value=saved.mode;
    if(saved.strict)byId('ae-route-strict').checked=true;
    byId('ae-route-close').onclick=()=>togglePanel('route',false);
    byId('ae-route-run').onclick=routeResult;
    byId('ae-route-swap').onclick=()=>{const a=byId('ae-route-from'),b=byId('ae-route-to');[a.value,b.value]=[b.value,a.value];routeResult()};
    byId('ae-route-focus').onclick=()=>{if(currentRoute)focusCalculatedRoute();else banner('Calcula una expedición primero.',2200)};
    byId('ae-route-clear').onclick=()=>{currentRoute=null;chosenLayer.clearLayers();routeVisible=false;byId('ae-route-result').innerHTML='<div class="ae-route-empty">Recorrido borrado. Puedes calcular otro itinerario.</div>'};
  }
  renderRoutePanel();
 const optionsVisible=D.places.filter(p=>!p.atlasArchiveReason);function selectDefaults(){if(optionsVisible.length>1){byId('ae-route-from').value=optionsVisible[0].id;byId('ae-route-to').value=optionsVisible[1].id}}
 selectDefaults();
 function refreshSelected(){const id=byId('ae-edit-selected')?.value,p=cityById.get(id),out=byId('ae-editor-coord');if(out)out.textContent=p?`${p.name}: X ${formatCoord(p.x)}, Y ${formatCoord(p.y)} · Hex ${JSON.stringify(hexFromXY(p.x,p.y))}`:'Selecciona una localidad.'}
 function renderEditorPanel(){editorPanel.innerHTML=`<div class="ae-leaf-row" style="justify-content:space-between"><h2>Modo Cartógrafo</h2><button type="button" id="ae-editor-close">✕</button></div>
 <p>Los cambios se guardan solo en este navegador hasta que exportes el JSON y lo incorpores al código del foro.</p>
 <h3>Coordenadas de ciudades</h3><label for="ae-edit-selected">Localidad</label><select id="ae-edit-selected">${options()}</select><div class="ae-leaf-note" id="ae-editor-coord"></div><div class="ae-leaf-row"><button id="ae-editor-focus" type="button">Centrar</button><button id="ae-editor-move" type="button">Arrastrar marcadores</button></div>
 <h3>Polígonos regionales · edición de vértices</h3>
 <p>Ajusta cada frontera arrastrando vértices. Haz doble clic en uno para quitarlo; agrega nuevos sobre la línea con «Añadir vértice». Estos cambios se exportan junto a las ciudades.</p>
 <label for="ae-edit-region">Región a editar</label><select id="ae-edit-region"><option value="">— Selecciona región —</option>${D.regions.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</select>
 <div class="ae-leaf-row"><button id="ae-region-focus" type="button">Mostrar borde</button><button id="ae-region-add" type="button">Añadir vértice</button><button id="ae-region-stop" type="button">Cerrar edición</button></div>
 <div class="ae-leaf-note" id="ae-region-vertex-count">Selecciona la región a editar. Mantén el mapa cartográfico visible como referencia.</div>
 <h3>Calibración hexagonal</h3><div class="ae-leaf-two"><div><label>Radio de hexágono</label><input id="ae-hex-size" type="number" min="5" max="40" step="0.1" value="${hex.radius}"></div><div><label>Desfase X</label><input id="ae-hex-x" type="number" step="0.25" value="${hex.phaseX}"></div></div><label>Desfase Y</label><input id="ae-hex-y" type="number" step="0.25" value="${hex.phaseY}"><button id="ae-hex-apply" type="button">Actualizar cuadrícula</button>
 <h3>Registrar conexión de caminos</h3><div class="ae-leaf-two"><div><label>Origen</label><select id="ae-edge-from">${options()}</select></div><div><label>Destino</label><select id="ae-edge-to">${options()}</select></div></div>
 <div class="ae-leaf-two"><div><label>Tipo</label><select id="ae-edge-kind"><option value="road">Camino terrestre</option><option value="trail">Campo a través / senda</option><option value="sea">Ruta marítima</option></select></div><div><label>Terreno</label><select id="ae-edge-terrain"><option value="normal">Normal</option><option value="arid">Árido +50 %</option><option value="forest">Bosque +50 %</option><option value="swamp">Pantano +50 %</option><option value="mountain">Montaña +50 %</option><option value="jungle">Jungla +50 %</option></select></div></div>
 <label>Clima</label><select id="ae-edge-climate"><option value="normal">Estándar</option><option value="snow">Nevado +25 %</option><option value="hot">Caluroso +25 %</option></select>
 <div class="ae-leaf-row"><button id="ae-edge-start" type="button">Dibujar camino</button><button id="ae-edge-save" type="button" disabled>Guardar tramo</button><button id="ae-edge-cancel" type="button">Cancelar</button></div>
 <div class="ae-leaf-note" id="ae-edge-hint">Selecciona dos localidades, pulsa «Dibujar camino» y haz clic sobre el mapa para marcar la ruta real; después guarda.</div>
 <h3>Validar y depurar la red</h3>
 <p>Todos los tramos generados comienzan como propuestas. Selecciona una conexión o haz clic sobre su línea en el mapa para revisar, confirmar o eliminar.</p>
 <label for="ae-edge-selected">Tramo de la red</label>
 <select id="ae-edge-selected">${edges.map(e=>`<option value="${esc(e.id)}">${esc(cityById.get(e.from)?.name||e.from)} → ${esc(cityById.get(e.to)?.name||e.to)} · ${esc(e.kind==='sea'?'mar':e.kind==='road'?'camino':'senda')}</option>`).join('')}</select>
 <div class="ae-leaf-note" id="ae-edge-detail"></div>
 <div class="ae-leaf-row"><button type="button" id="ae-edge-focus">Mostrar tramo</button><button type="button" id="ae-edge-approve">Confirmar</button><button type="button" id="ae-edge-remove">Eliminar tramo</button></div>
 <label for="ae-edge-status">Estado al guardar un nuevo tramo</label><select id="ae-edge-status"><option value="confirmada">Confirmado (dibujado manualmente)</option><option value="propuesta">Provisional, pendiente de revisión</option></select>
 <div class="ae-leaf-row"><button type="button" id="ae-export">Exportar JSON</button><button type="button" id="ae-import">Importar JSON</button><button type="button" id="ae-reset-edges">Restaurar red inicial</button><button type="button" id="ae-clear-edges">Vaciar todos los tramos</button></div>
 <button type="button" id="ae-reset-official" class="ae-editor-reset-official">↺ Restablecer mapa oficial (descarta cambios locales)</button><input type="file" id="ae-import-file" accept="application/json,.json" hidden><small id="ae-edge-count"></small>`;
  byId('ae-editor-close').onclick=()=>togglePanel('editor',false);
  byId('ae-edit-region').onchange=e=>{activeRegionId=e.target.value;addingRegionVertex=false;renderRegionVertices();
    const r=regionById.get(activeRegionId);if(r){regionsVisible=true;byId('ae-toggle-regions').setAttribute('aria-pressed','true');regionLayer.addTo(map);}
  };
  byId('ae-region-focus').onclick=()=>{const r=regionById.get(byId('ae-edit-region').value);if(!r){banner('Selecciona primero una región');return}const pts=readPoints(r).map(p=>XY(p[0],p[1]));map.fitBounds(L.latLngBounds(pts),{padding:[55,55]});};
  byId('ae-region-add').onclick=()=>{if(!activeRegionId){banner('Selecciona una región');return}addingRegionVertex=true;banner('Haz clic sobre el borde de la región para insertar un nuevo vértice')};
  byId('ae-region-stop').onclick=()=>{activeRegionId='';addingRegionVertex=false;regionEditLayer.clearLayers();byId('ae-edit-region').value='';byId('ae-region-vertex-count').textContent='Edición de región cerrada.'};

  byId('ae-edit-selected').onchange=refreshSelected;byId('ae-editor-focus').onclick=()=>{const p=cityById.get(byId('ae-edit-selected').value);if(p)map.setView(XY(p.x,p.y),Math.max(map.getZoom(),1))};
  byId('ae-editor-move').onclick=e=>{const active=e.target.getAttribute('aria-pressed')!=='true';setDragging(active);e.target.setAttribute('aria-pressed',String(active));e.target.textContent=active?'Detener arrastre':'Arrastrar marcadores';banner(active?'Arrastra una localidad; sus coordenadas se guardan en el borrador local.':'Arrastre desactivado.',2600)};
  byId('ae-hex-apply').onclick=()=>{const radius=Number(byId('ae-hex-size').value),x=Number(byId('ae-hex-x').value),y=Number(byId('ae-hex-y').value);
   if(!Number.isFinite(radius)||radius<5||radius>40||!Number.isFinite(x)||!Number.isFinite(y)){banner('Parámetros hexagonales inválidos.',2700);return}hex={radius,phaseX:x,phaseY:y};redrawGrid();saveDraft();refreshSelected();rerenderRoutes()};
  byId('ae-edge-start').onclick=()=>{const a=byId('ae-edge-from').value,b=byId('ae-edge-to').value;
   if(a===b){byId('ae-edge-hint').textContent='Selecciona dos lugares distintos.';return}drawing=true;pendingVia=[];byId('ae-edge-save').disabled=false;byId('ae-edge-hint').textContent='Marca los quiebres del camino sobre el mapa. Termina con «Guardar tramo». No es necesario hacer clic en el origen o destino.';renderDraftLine()};
  byId('ae-edge-cancel').onclick=cancelDraw;
  byId('ae-edge-save').onclick=()=>{if(!drawing)return;const from=byId('ae-edge-from').value,to=byId('ae-edge-to').value;
   const e={id:'edge-'+Date.now(),from,to,kind:byId('ae-edge-kind').value,terrain:byId('ae-edge-terrain').value,climate:byId('ae-edge-climate').value,via:pendingVia.map(p=>({x:Number(p.x.toFixed(1)),y:Number(p.y.toFixed(1))})),status:byId('ae-edge-status').value,origin:'cartografo_manual',reason:'Tramo dibujado por cartógrafo'};
   const count=updateEdgeHexes(e);edges.push(e);saveDraft();cancelDraw();rerenderRoutes();renderEditorPanel();banner('Tramo guardado: '+cityById.get(from).name+' → '+cityById.get(to).name+' · '+count+' hexágonos',3500)};
  byId('ae-export').onclick=exportDraft;byId('ae-import').onclick=()=>byId('ae-import-file').click();byId('ae-import-file').onchange=importDraft;
   byId('ae-reset-official').onclick=()=>{
     if(!window.confirm('¿Restablecer el mapa publicado? Se descartarán las modificaciones locales que no hayas exportado.'))return;
     try{localStorage.removeItem(CONFIG.STORAGE_KEY)}catch{}
     edges=cloneBase();hex={radius:CONFIG.HEX_RADIUS,phaseX:CONFIG.HEX_PHASE_X,phaseY:CONFIG.HEX_PHASE_Y};currentRoute=null;
     D.places.forEach(p=>{const q=ORIGINAL_COORDS[p.id];if(q){p.x=q.x;p.y=q.y;pinRefs.get(p.id)?.setLatLng(XY(p.x,p.y))}});
     D.regions.forEach(r=>{const q=ORIGINAL_REGIONS[r.id];if(q){r.points=q;regionRefs.get(r.id)?.setLatLngs(readPoints(r).map(p=>XY(p[0],p[1])))}});
     redrawGrid();rerenderRoutes();renderEditorPanel();banner('Mapa restablecido a la cartografía publicada.',3600);
   };
  byId('ae-clear-edges').onclick=()=>{if(!window.confirm('¿Vaciar absolutamente TODOS los tramos del borrador local, incluidas las propuestas iniciales y las confirmadas? Exporta primero un respaldo.'))return;edges=[];currentRoute=null;saveDraft();rerenderRoutes();renderEditorPanel()};
  byId('ae-reset-edges').onclick=()=>{if(!window.confirm('¿Restaurar la red provisional original? Se perderán los tramos añadidos o confirmados en este borrador si no has exportado su JSON.'))return;edges=cloneBase();currentRoute=null;saveDraft();rerenderRoutes();renderEditorPanel()};
  byId('ae-edge-selected').onchange=e=>{selectedEdgeId=e.target.value;showSelectedEdge()};
  byId('ae-edge-focus').onclick=()=>{const e=edges.find(x=>x.id===selectedEdgeId),pts=e&&endpoints(e);if(pts){map.fitBounds(L.latLngBounds(pts.map(p=>XY(p.x,p.y))),{padding:[65,65]});}};
  byId('ae-edge-approve').onclick=()=>{const e=edges.find(x=>x.id===selectedEdgeId);if(!e)return;e.status=e.status==='confirmada'?'propuesta':'confirmada';saveDraft();rerenderRoutes();renderEditorPanel();banner(e.status==='confirmada'?'Conexión confirmada; verifica también su trazado y tipo.':'Conexión marcada nuevamente como provisional.',2600)};
  byId('ae-edge-remove').onclick=()=>{const e=edges.find(x=>x.id===selectedEdgeId);if(!e||!window.confirm('¿Eliminar esta conexión del borrador?'))return;edges=edges.filter(x=>x.id!==e.id);selectedEdgeId='';currentRoute=null;saveDraft();rerenderRoutes();renderEditorPanel()};
  if(selectedEdgeId&&edges.some(e=>e.id===selectedEdgeId))byId('ae-edge-selected').value=selectedEdgeId;
  else selectedEdgeId=edges[0]?.id||'';
  showSelectedEdge();updateEdgeCount();refreshSelected();
 }
 function showSelectedEdge(){const sel=byId('ae-edge-selected');const id=sel?.value||selectedEdgeId;const e=edges.find(x=>x.id===id);selectedEdgeId=e?.id||'';
  const node=byId('ae-edge-detail');if(!node)return;
  node.innerHTML=e?`<b>${esc(cityById.get(e.from)?.name)} → ${esc(cityById.get(e.to)?.name)}</b><br>${esc(e.kind==='sea'?'Travesía marítima':e.kind==='road'?'Camino terrestre':'Sendero / campo a través')} · ${updateEdgeHexes(e)} hex. · <strong>${e.status==='confirmada'?'CONFIRMADO':'PROPUESTA — por revisar'}</strong><br>${esc(e.reason||'Tramo editable; verifica su existencia sobre el mapa.')}<br><small>Para cambiar la geometría puedes eliminar esta propuesta y dibujarla de nuevo usando puntos intermedios.</small>`:'No quedan tramos en la red.';
  const btn=byId('ae-edge-approve');if(btn)btn.textContent=e?.status==='confirmada'?'Volver a propuesta':'Confirmar';
 }
 function updateEdgeCount(){const x=byId('ae-edge-count');if(x){const counts=edges.reduce((a,e)=>(a[e.kind]=(a[e.kind]||0)+1,e.status==='confirmada'?a.confirmadas++:a.propuestas++,a),{road:0,trail:0,sea:0,confirmadas:0,propuestas:0});x.textContent=`${edges.length} tramos · ${counts.road} caminos · ${counts.trail} sendas · ${counts.sea} mar · ${counts.confirmadas} confirmados · ${counts.propuestas} propuestas`}}
 function cancelDraw(){drawing=false;pendingVia=[];if(draftLine){map.removeLayer(draftLine);draftLine=null;}if(byId('ae-edge-save'))byId('ae-edge-save').disabled=true;if(byId('ae-edge-hint'))byId('ae-edge-hint').textContent='Selecciona dos localidades y dibuja un nuevo tramo.'}
 function renderDraftLine(){if(draftLine){map.removeLayer(draftLine);draftLine=null}if(!drawing)return;
  const a=cityById.get(byId('ae-edge-from').value),b=cityById.get(byId('ae-edge-to').value);
  draftLine=L.polyline([XY(a.x,a.y),...pendingVia.map(p=>XY(p.x,p.y)),XY(b.x,b.y)],{color:'#ffce69',weight:4,dashArray:'8 6'}).addTo(map)}
 map.on('click',ev=>{if(editorEnabled&&addingRegionVertex){const point=pointFromEvent(ev);addRegionVertex(point.x,point.y);return}if(!editorEnabled||!drawing)return;const point=pointFromEvent(ev);pendingVia.push(point);renderDraftLine();byId('ae-edge-hint').textContent=`Puntos intermedios: ${pendingVia.length}. Guardar tramo para incorporarlo a la red.`});
 function exportDraft(){const cities={};for(const p of D.places)cities[p.id]={x:p.x,y:p.y};const info={version:1,networkVersion:13,coordinateSystem:'Aeternalis logical 2048x1571',rasterHighResolution:'4100x3146',hex,cities,regions:Object.fromEntries(D.regions.map(r=>[r.id,r.points])),edges,warning:'TODOS los tramos iniciales son propuestas, no rutas canónicas. Comprobar puertos, pasos, caminos y posiciones.'};
  const file=new Blob([JSON.stringify(info,null,2)],{type:'application/json'});const uri=URL.createObjectURL(file);const a=document.createElement('a');a.href=uri;a.download='Aeternalis_Cartografia_Caminos.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),1500)}
 function importDraft(ev){const file=ev.target.files?.[0];if(!file)return;file.text().then(s=>{const v=JSON.parse(s);if(v.version!==1||!Array.isArray(v.edges)||!v.cities||!v.hex)throw Error('Formato de datos no reconocido');
  edges=v.edges.filter(validEdge);hex=v.hex;currentRoute=null;selectedEdgeId='';
  if(v.regions){for(const [id,raw] of Object.entries(v.regions)){const r=regionById.get(id);if(!r||typeof raw!=='string')continue;const pts=raw.split(/\s+/).filter(Boolean).map(a=>a.split(',').map(Number));if(pts.length<3||pts.some(p=>p.length!==2||p.some(n=>!Number.isFinite(n))))continue;writePoints(r,pts)}renderRegionVertices();}

  for(const [id,pos] of Object.entries(v.cities)){const p=cityById.get(id);if(p&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)){p.x=clamp(pos.x,0,D.map.width);p.y=clamp(pos.y,0,D.map.height);pinRefs.get(id)?.setLatLng(XY(p.x,p.y))}}
  redrawGrid();rerenderRoutes();saveDraft();renderEditorPanel();banner('Borrador importado correctamente.',3200);
 }).catch(err=>banner('Error de importación: '+err.message,5000));ev.target.value=''}
 function togglePanel(name,force){const route=name==='route',panel=route?routePanel:editorPanel,btn=byId(route?'ae-toggle-route':'ae-toggle-editor');
  const enabled=(typeof force==='boolean'?force:panel.hidden);panel.hidden=!enabled;btn.setAttribute('aria-pressed',String(enabled));
  if(enabled){const other=route?'editor':'route';togglePanel(other,false);if(route)renderRoutePanel();else renderEditorPanel()}
  if(!route&&!enabled){setDragging(false);cancelDraw();editorEnabled=false;addingRegionVertex=false;activeRegionId='';regionEditLayer.clearLayers();atlasShell.classList.remove('ae-leaf-editing')}
  else if(!route&&enabled){editorEnabled=true;atlasShell.classList.add('ae-leaf-editing')}
 }
 function onToggle(id,on){byId(id).onclick=()=>on()}
 onToggle('ae-toggle-grid',()=>{gridVisible=!gridVisible;byId('ae-toggle-grid').setAttribute('aria-pressed',String(gridVisible));redrawGrid()});
 onToggle('ae-toggle-regions',()=>{regionsVisible=!regionsVisible;byId('ae-toggle-regions').setAttribute('aria-pressed',String(regionsVisible));if(regionsVisible)regionLayer.addTo(map);else map.removeLayer(regionLayer)});
 onToggle('ae-toggle-roads',()=>{roadsVisible=!roadsVisible;byId('ae-toggle-roads').setAttribute('aria-pressed',String(roadsVisible));rerenderRoutes()});
 onToggle('ae-toggle-route',()=>togglePanel('route'));
 onToggle('ae-toggle-editor',()=>{if(cartographerEnabled)togglePanel('editor')});
 onToggle('ae-map-reset',()=>map.fitBounds(bounds,{padding:[10,10]}));
 // Red inicial de conexiones propuestas; se puede confirmar, editar o eliminar cada una.
 rerenderRoutes();

const fact=(label,value) => `<div class="ae-atlas__fact"><dt>${esc(label)}</dt><dd>${esc(value||'Pendiente de documentar')}</dd></div>`;
  const paragraphs=(str) => String(str||'').split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('');
  function mapSnapshot(p) {
    const x=clamp(p.x/D.map.width*100,0,100), y=clamp(p.y/D.map.height*100,0,100);
    return `<div class="ae-atlas__fallback-art" style="background-image:url('${esc(D.map.src)}');background-position:${x.toFixed(2)}% ${y.toFixed(2)}%"><span>Detalle cartográfico · imagen propia pendiente</span></div>`;
  }
  function openModal(body) {
    lastFocused=document.activeElement;
    search.blur();
    modalBody.innerHTML=body;
    modal.hidden=false;
    document.body.classList.add('ae-map-dialog-open');
    byId('ae-map-close').focus();
  }

  /* ================================================================
     ATLAS V4.0 · TABLILLA CÍVICA DE CIUDADES
     Modificar SOLO los datos de CITY_EXTENSIONS para completar fichas.
     Una cifra null significa: SIN DOCUMENTAR (no equivale a cero).
     Distritos solo aparecen en ciudades con un arreglo no vacío.
     ================================================================ */
  const CITY_EXTENSIONS = window.__AETERNALIS_ATLAS_CIVIC__;
  const CITY_STATS = [
    ['army','Ejército','⚔'],['ships','Navíos','⚓'],
    ['walls','Murallas','▥'],['buildings','Edificaciones','⌂'],
    ['security','Seguridad','⛨'],['trade','Comercio','◇'],
    ['food','Comida','❦'],['education','Educación','▤'],
    ['health','Salud','✚'],['mining','Minería','◆'],
    ['housing','Vivienda','⌂'],['popularity','Popularidad','✧']
  ];
  const CITY_RACES = [
    ['Elfos','#8baecc','✧'],['Humanos','#ae514d','◆'],
    ['Amarant','#b85b87','❖'],['Yūgen','#9270b0','✿'],
    ['Montaraces','#5facc4','ᛟ'],["Sin’Hair",'#779a5d','❦'],
    ['Enanos','#bb935d','◆'],['Nórin','#c0ad75','❧'],['Otros','#9d9080','◇']
  ];
  const optional = (val, fallback='Sin documentar') =>
    (val===null || val===undefined || val==='') ? fallback : String(val);
  const htmlText = value => esc(optional(value)).replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>');
  const blankCity = () => ({
    basic:{capital:null,government:null,religion:null,language:null},
    demographic:{distribution:{}},
    strategic:{resources:null,defenses:null,threats:null},
    indicators:{gold:null,army:null,ships:null,walls:null,buildings:null,security:null,trade:null,food:null,education:null,health:null,mining:null,housing:null,popularity:null},
    npcs:[], districts:[]
  });
  function cityCivic(place) {
    const base=blankCity(),patch=CITY_EXTENSIONS[place.id]||{};
    return {
      basic:{...base.basic,...(patch.basic||{})},
      demographic:{...base.demographic,...(patch.demographic||{})},
      strategic:{...base.strategic,...(patch.strategic||{})},
      indicators:{...base.indicators,...(patch.indicators||{})},
      npcs:Array.isArray(patch.npcs)?patch.npcs:[],
      districts:Array.isArray(patch.districts)?patch.districts:[]
    };
  }
  const civicFact = (label,value) => `<div class="ae-atlas__civic-fact"><dt>${esc(label)}</dt><dd>${esc(optional(value))}</dd></div>`;
  function metricValue(input, suffix='%') {
    if(input===null||input===undefined||input==='')return '<span class="ae-atlas__metric-empty">—</span>';
    const n=typeof input==='number'?input:Number(input);
    if(Number.isFinite(n))return `<strong>${esc(n)}${suffix}</strong>`;
    return `<strong>${esc(input)}</strong>`;
  }
  function metricCard(key,label,glyph,val) {
    const num=typeof val==='number' && val>=0&&val<=100;
    return `<div class="ae-atlas__metric" title="${esc(label)}: ${esc(optional(val))}">
      <span class="ae-atlas__metric-name">${esc(label)}</span>
      <span class="ae-atlas__metric-symbol" aria-hidden="true">${esc(glyph)}</span>
      ${metricValue(val)}
      ${num?`<span class="ae-atlas__metric-bar" aria-hidden="true"><i style="width:${val}%"></i></span>`:''}
    </div>`;
  }
  function cityTabs(place,civic) {
    const entries=[
      ['general','Presentación'],['basic','Gobierno y datos'],
      ['demography','Demografía'],['strategic','Entorno estratégico'],
      ['metrics','Indicadores'],['npcs','PNJ importantes'],['routes','Conexiones']
    ];
    if(civic.districts.length)entries.push(['districts','Distritos']);
    return entries;
  }
  function renderCityPanel(place,civic,tab) {
    const firstImage=place.image
      ? `<img class="ae-atlas__city-banner" src="${esc(place.image)}" alt="Panorámica de ${esc(place.name)}" loading="lazy">` : '';
    if(tab==='general') {
      let description=place.description||'';
      // Solo Eirae: el texto original sigue intacto dentro de ATLAS_DATA.
      // El contenido de los cinco distritos aparece completo en la pestaña Distritos.
      if(place.id==='place-059'&&civic.districts.length){
        const i=description.indexOf('La ciudad está dividida en cinco distritos bien diferenciados:');
        const j=description.indexOf('Datos extra:',i);
        if(i!==-1&&j>i)description=description.slice(0,i)+'\n\n'+description.slice(j);
      }
      const current=place.loreStatus==='actualizado'||place.loreStatus==='parcial';
      const prose=description?paragraphs(description):
        (place.curiosities?.length?'<p>Los datos y curiosidades disponibles se presentan a continuación.</p>':'<p>La descripción de esta localidad aún está pendiente de documentar.</p>');
      const aspects=current&&place.aspects?.length?`<h3>Costumbres, poder y particularidades</h3><div class="ae-atlas__lore-aspects">${place.aspects.map(a=>`<section><h4>${esc(a.title)}</h4><p>${esc(a.text)}</p></section>`).join('')}</div>`:'';
      const tension=current&&place.tension?`<h3>Conflicto característico</h3><p>${esc(place.tension)}</p>`:'';
      const curiosities=current&&place.curiosities?.length?`<h3>Datos, curiosidades y conflictos</h3>${place.curiosities.map(x=>`<p>${esc(x)}</p>`).join('')}`:'';
      const scheme=current&&place.sourceScheme?`<details class="ae-atlas__source-note"><summary>Ficha del esquema vigente</summary><p>${esc(place.sourceScheme)}</p></details>`:'';
      return `${firstImage}<div class="ae-atlas__prose">${prose}${aspects}${tension}${curiosities}${scheme}</div>${!current?'<p class="ae-atlas__editor-note">Ficha parcialmente documentada. No se incluyen datos obsoletos.</p>':''}`;
    }
    if(tab==='basic')return `
      <h3>Gobierno e instituciones</h3>
      <dl class="ae-atlas__civic-facts">
        ${civicFact('Capitalidad / condición',civic.basic.capital)}
        ${civicFact('Gobierno',civic.basic.government)}
        ${civicFact('Religión',civic.basic.religion)}
        ${civicFact('Idioma',civic.basic.language)}
        ${civicFact('Raza dominante',place.race)}
        ${civicFact('Clima',place.climate)}
      </dl>`;
    if(tab==='demography') {
      const distribution=civic.demographic.distribution||{};
      return `<h3>Población y composición racial</h3><div class="ae-atlas__civic-population">${civicFact('Población total',place.population)}</div>
      <div class="ae-atlas__races-grid">${CITY_RACES.map(([name,color,glyph])=>{
        const v=distribution[name]??null;
        return `<div class="ae-atlas__race-card" style="--ae-race-color:${color}"><span>${esc(name)}</span><span aria-hidden="true">${esc(glyph)}</span>${metricValue(v)}</div>`;
      }).join('')}</div>
      <p class="ae-atlas__civic-disclaimer">Los porcentajes no documentados se muestran con «—»; no representan una población del 0 %.</p>`;
    }
    if(tab==='strategic')return `<h3>Entorno estratégico</h3><div class="ae-atlas__strategic-table">${[
      ['Recursos',civic.strategic.resources],['Defensas',civic.strategic.defenses],['Amenazas',civic.strategic.threats]
    ].map(([label,val])=>`<section class="ae-atlas__strategic-row"><h4>${esc(label)}</h4><div class="ae-atlas__prose"><p>${htmlText(val)}</p></div></section>`).join('')}</div>`;
    if(tab==='metrics')return `<h3>Indicadores de la localidad</h3><div class="ae-atlas__gold-tile"><div><span>Oro del distrito</span><strong>${metricValue(civic.indicators.gold,'')}</strong></div><span class="ae-atlas__gold-icon" aria-hidden="true">◈</span></div>
      <div class="ae-atlas__metrics-grid">${CITY_STATS.map(([key,label,icon])=>metricCard(key,label,icon,civic.indicators[key])).join('')}</div>
      <p class="ae-atlas__civic-disclaimer">Indicadores por definir: «—» significa dato aún no establecido. No se asignan cifras inventadas.</p>`;
    if(tab==='npcs') {
      const npcs=civic.npcs;
      return `<h3>Personajes importantes</h3><p class="ae-atlas__civic-lead">Autoridades, consejeros, representantes de instituciones y otras figuras que influyen en el destino de esta localidad.</p>
      ${npcs.length?`<div class="ae-atlas__npc-grid">${npcs.map(n=>`<article class="ae-atlas__npc-card">${n.image?`<img src="${esc(n.image)}" alt="Retrato de ${esc(n.name||'personaje')}" loading="lazy">`:`<div class="ae-atlas__npc-fallback" aria-label="Retrato pendiente">♜</div>`}<div><h4>${esc(n.name||'Personaje sin nombre')}</h4><strong>${esc(optional(n.role))}</strong><p>${esc(optional(n.description))}</p></div></article>`).join('')}</div>`:'<div class="ae-atlas__civic-awaiting">Los personajes y gobernantes de esta localidad aún no han sido incorporados al registro. La pestaña está preparada para añadir sus retratos, cargos y biografías.</div>'}`;
    }
    if(tab==='routes'){
      const connected=edges.filter(e=>e.from===place.id||e.to===place.id);
      const details=connected.map(e=>{
        const other=e.from===place.id?e.to:e.from,p=cityById.get(other);
        if(!p)return '';
        return `<article class="ae-atlas__connection-card"><div><strong>${esc(p.name)}</strong><p>${esc(LABEL_ROUTE_KIND[e.kind])} · ${updateEdgeHexes(e)} hexágonos · ${e.status==='confirmada'?'Confirmada':'Propuesta por validar'}</p></div><button type="button" data-ae-city-route="${esc(place.id)}" data-ae-route-dest="${esc(p.id)}">Calcular viaje</button></article>`;
      }).join('');
      return `<h3>Conexiones e itinerarios</h3><p class="ae-atlas__civic-lead">Caminos, sendas y travesías registrados desde ${esc(place.name)}. Las conexiones propuestas aún deben validarse en el lore.</p><div class="ae-atlas__connection-list">${details||'<p>Esta localidad no tiene rutas registradas por ahora.</p>'}</div>`;
    }
    if(tab==='districts'&&civic.districts.length)return `<h3>Los distritos de ${esc(place.name)}</h3><p class="ae-atlas__civic-lead">Cada distrito posee su propio carácter, instituciones y maneras de habitar la ciudad.</p>
      <div class="ae-atlas__district-grid">${civic.districts.map((d,i)=>`<article class="ae-atlas__district-card">${d.image?`<img src="${esc(d.image)}" alt="Panorámica de ${esc(d.name)}" loading="lazy">`:`<div class="ae-atlas__district-fallback"><span>✧</span><small>Ilustración del distrito pendiente</small></div>`}<div class="ae-atlas__district-info"><span class="ae-atlas__district-number">Distrito ${String(i+1).padStart(2,'0')}</span><h4>${esc(d.name)}</h4><div class="ae-atlas__prose"><p>${esc(d.description)}</p></div></div></article>`).join('')}</div>`;
    return '';
  }
  function openCity(place) {
    if(!place)return;
    const civic=cityCivic(place),tabs=cityTabs(place,civic),prefix='ae-city-'+place.id;
    const illustration=place.image
      ? `<img class="ae-atlas__art" src="${esc(place.image)}" alt="Vista de ${esc(place.name)}" loading="lazy">`
      : mapSnapshot(place);
    openModal(`<div class="ae-atlas__modal-grid ae-atlas__modal-grid--civic">
      <aside class="ae-atlas__modal-aside">${illustration}
        <dl class="ae-atlas__facts">
          ${fact('Población aprox.',place.population)}
          ${fact('Clima',place.climate)}
          ${fact('Raza dominante',place.race)}
          ${fact('Bioma',place.biome)}
        </dl>
        ${place.extraFacts?.length ? `<dl class="ae-atlas__extra-facts">${place.extraFacts.map(pair=>`<div><dt>${esc(pair[0])}</dt><dd>${esc(pair[1])}</dd></div>`).join('')}</dl>`:''}
        <p class="ae-atlas__panel-status">${esc(place.kind||'Localidad')} · Ficha cívica</p>
      </aside>
      <article class="ae-atlas__modal-article ae-atlas__city-v4">
        <div class="ae-atlas__eyebrow">${svgIcon(place.faction)} ${esc(factionNames[place.faction])} · ${esc(place.kind||'Localidad')}</div>
        <h2 id="ae-map-modal-title">${esc(place.name)}</h2>
        ${place.subtitle?`<p class="ae-atlas__city-subtitle">${esc(place.subtitle)}</p>`:''}
        <nav class="ae-atlas__civic-tabs" role="tablist" aria-label="Secciones de ${esc(place.name)}">
          ${tabs.map(([key,label],i)=>`<button type="button" role="tab" id="${prefix}-tab-${key}" data-ae-city-tab="${key}" aria-selected="${i===0}" aria-controls="${prefix}-panel-${key}" tabindex="${i===0?0:-1}">${esc(label)}</button>`).join('')}
        </nav>
        ${tabs.map(([key,label],i)=>`<section role="tabpanel" id="${prefix}-panel-${key}" class="ae-atlas__civic-panel" aria-labelledby="${prefix}-tab-${key}" ${i!==0?'hidden':''}>${renderCityPanel(place,civic,key)}</section>`).join('')}
      </article>
    </div>`);
  }

  function openRegion(region) {
    if(!region)return;
    const isBergheim=region.id.startsWith('bergheim-');
    const content=D.realmLore?.[region.id];
    const cities=D.places.filter(p=>!p.atlasArchiveReason && p.regionId===region.id).sort((a,b)=>a.name.localeCompare(b.name,'es'));
    const cityList=cities.map(p=>`<button type="button" class="ae-atlas__place-link" data-kind="pin" data-id="${esc(p.id)}">${esc(p.name)}<span>›</span></button>`).join('')||'<p>Sin localidades documentadas para esta zona.</p>';
    const fullText=content ? `
      <div class="ae-atlas__prose">${content.intro.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
      ${content.sections.map((s,i)=>`<details class="ae-atlas__lore-chapter" ${i===0?'open':''}><summary>${esc(s.title)}</summary><div class="ae-atlas__prose">${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}` :
      '<p>La descripción de esta región está pendiente de reescritura a partir del esquema actualizado. La geografía es orientativa y no constituye validación narrativa.</p>';
    const intro = (D.kingdomNames[region.kingdom]||'Región de Aeternalis') + ' · Atlas territorial';
    openModal(`<div class="ae-atlas__modal-grid ae-atlas__modal-grid--region">
      <aside class="ae-atlas__modal-aside">
        <img class="ae-atlas__art" src="${esc(D.map.src)}" alt="Mapa de Aeternalis" loading="lazy">
        <h3>Localidades y enclaves</h3>
        <nav class="ae-atlas__places-list" aria-label="Localidades de ${esc(region.name)}">${cityList}</nav>
        <p class="ae-atlas__panel-status">Límite digital en revisión cartográfica. Cada territorio se activa por separado.</p>
      </aside>
      <article class="ae-atlas__modal-article">
        <div class="ae-atlas__eyebrow">${esc(intro)}</div>
        <h2 id="ae-map-modal-title">${esc(region.name)}</h2>
        <div class="ae-atlas__rule"></div>
        ${fullText}
      </article>
    </div>`);
  }
  // Navegación accesible de pestañas de la tablilla cívica.
  function activateCityTab(tab, focus=false) {
    const list=tab.closest('[role="tablist"]'), article=tab.closest('.ae-atlas__city-v4');
    if(!list||!article)return;
    list.querySelectorAll('[data-ae-city-tab]').forEach(b=>{
      const selected=b===tab;
      b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;
      const panel=article.querySelector('#'+b.getAttribute('aria-controls'));
      if(panel)panel.hidden=!selected;
    });
    if(focus)tab.focus();
    tab.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  modalBody.addEventListener('click', e => {
    const tab=e.target.closest('[data-ae-city-tab]');
    if(tab){activateCityTab(tab);return;}
  });
  modalBody.addEventListener('keydown', e => {
    const tab=e.target.closest('[data-ae-city-tab]');if(!tab)return;
    const tabs=[...tab.closest('[role="tablist"]').querySelectorAll('[data-ae-city-tab]')];
    let index=tabs.indexOf(tab);
    if(e.key==='ArrowRight')index=(index+1)%tabs.length;
    else if(e.key==='ArrowLeft')index=(index-1+tabs.length)%tabs.length;
    else if(e.key==='Home')index=0;
    else if(e.key==='End')index=tabs.length-1;
    else return;
    e.preventDefault();activateCityTab(tabs[index],true);
  });
  modalBody.addEventListener('click',e=>{
    const button=e.target.closest('[data-ae-city-route]');if(!button)return;
    const from=button.dataset.aeCityRoute,to=button.dataset.aeRouteDest;
    closeModal();togglePanel('route',true);
    byId('ae-route-from').value=from;byId('ae-route-to').value=to;
    routeResult();
  });
  modalBody.addEventListener('click', e => {
    const button=e.target.closest('.ae-atlas__place-link');
    if(button && button.dataset.kind==='pin')openCity(cityById.get(button.dataset.id));
  });
  function closeModal() {
    modal.hidden=true;
    modalBody.innerHTML='';
    document.body.classList.remove('ae-map-dialog-open');
    if(lastFocused&&lastFocused.isConnected)lastFocused.focus();
  }
  byId('ae-map-close').addEventListener('click',closeModal);
  modal.addEventListener('click', e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      if(!modal.hidden){e.preventDefault();closeModal();}
      else closeResults();
    }
    if(e.key==='Tab'&&!modal.hidden){
      const tabbables=[...modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')];
      if(tabbables.length){const first=tabbables[0],last=tabbables[tabbables.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    }
  });
  

 // Bind civic tabs, popups and place links from the retained Atlas v4 source code.
 const normalized=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function closeResults(){results.hidden=true;search.setAttribute('aria-expanded','false')}
 search.addEventListener('input',()=>{const q=normalized(search.value.trim());if(q.length<2){closeResults();return};
 const places=D.places.filter(p=>!p.atlasArchiveReason && normalized(p.name).includes(q)).slice(0,17).map(p=>({id:p.id,name:p.name,kind:'pin'}));
 const regs=D.regions.filter(r=>normalized(r.name).includes(q)).slice(0,5).map(r=>({id:r.id,name:r.name,kind:'region'}));
 const items=[...places,...regs].slice(0,22);
 results.innerHTML=items.length?items.map(x=>`<button type="button" data-id="${esc(x.id)}" data-kind="${x.kind}"><span>${esc(x.name)}</span><small>${x.kind==='pin'?'Localidad':'Región'}</small></button>`).join(''):'<p>No se encontraron lugares.</p>';results.hidden=false});
 results.addEventListener('click',e=>{const btn=e.target.closest('button[data-id]');if(!btn)return;const type=btn.dataset.kind,id=btn.dataset.id;closeResults();search.value='';
 if(type==='pin'){const p=cityById.get(id);map.flyTo(XY(p.x,p.y),Math.max(map.getZoom(),.5),{duration:.6});openCity(p)}else openRegion(regionById.get(id));});
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.ae-atlas__search-box'))closeResults()});
 // Emit diagnostic interface for offline quality assurance only.
 window.__AE_ATLAS_LEAFLET_DEBUG__={map,data:D,hexFromXY,hexWorld,hexDistance,polyHexDistance,edgeCost,findNetworkRoute,getEdges:()=>edges,getInitialEdges:()=>INITIAL_EDGES,getNetworkStatus:()=>({total:edges.length,confirmed:edges.filter(e=>e.status==='confirmada').length})};
}
afterRoot(boot);
})();