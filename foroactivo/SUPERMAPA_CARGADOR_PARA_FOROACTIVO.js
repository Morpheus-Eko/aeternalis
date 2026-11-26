/* AETERNALIS · Cargador de datos públicos desde GitHub Pages.
   MANTENER DESACTIVADO mientras el código v1.7 permanezca activo.
   Instalar en Foroactivo como UNICO JavaScript del Supermapa tras verificar Pages. */
(()=>{
 'use strict';
 const BASE="https://morpheus-eko.github.io/aeternalis/";
 const id='aeternalis-atlas';
 if(window.__AETERNALIS_EXTERNAL_LOADING__)return;
 window.__AETERNALIS_EXTERNAL_LOADING__=true;
 function status(msg){
  const el=document.getElementById(id);
  if(el && !el.dataset.aeLeafReady) el.textContent=msg;
 }
 function file(path){return fetch(BASE+path+'?v='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(path+': HTTP '+r.status);return r.json()})}
 async function boot(){
  const manifest=await file('data/atlas/manifest.json');
  if(manifest.schema!=='aeternalis-atlas-v1')throw Error('Versión de datos no compatible');
  const F=manifest.files,paths=[F.catalog,F.regions,F.realmLore,F.roads,F.civic,...F.locations];
  const all=await Promise.all(paths.map(file));
  const [catalog,regions,realmLore,edges,civic,...groups]=all;
  const byId=new Map(groups.flat().map(p=>[p.id,p]));
  if(byId.size!==manifest.counts.places || regions.length!==manifest.counts.regions || edges.length!==manifest.counts.roads)
    throw Error('Datos incompletos: no coinciden los recuentos del Atlas');
  const places=catalog.placesOrder.map(id=>byId.get(id));
  if(places.some(p=>!p))throw Error('Faltan localidades en los archivos territoriales');
  window.__AETERNALIS_ATLAS_DATA__={map:catalog.map,regions,places,kingdomNames:catalog.kingdomNames,realmLore,metadata:catalog.metadata,cartographyAudit:catalog.cartographyAudit};
  window.__AETERNALIS_ATLAS_EDGES__=edges;
  window.__AETERNALIS_ATLAS_CIVIC__=civic;
  await new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=BASE+manifest.core+'?v='+Date.now();
    script.onload=resolve;script.onerror=()=>reject(Error('No se pudo cargar el motor del Supermapa'));
    document.head.appendChild(script);
  });
 }
 function start(){boot().catch(err=>{console.error('[Aeternalis GitHub]',err);status('Error al cargar Aeternalis desde GitHub: '+err.message+' · Mantén la versión anterior hasta corregirlo.')})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
