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
 // El manifiesto se consulta actualizado; los demás recursos se reutilizan mientras su revisión no cambie.
 // Evita descargas innecesarias en cada visita, especialmente con conexiones lentas.
 async function file(path,revision){
  const url=BASE+path+'?v='+encodeURIComponent(revision||'manifest-live');
  const options={cache:revision?'default':'no-store'};
  for(let attempt=0;attempt<2;attempt++){
   try{
    const response=await fetch(url,options);
    if(!response.ok)throw Error(path+': HTTP '+response.status);
    return await response.json();
   }catch(err){
    const msg=String(err&&err.message||err);
    if(attempt===1||/HTTP 4[0-9][0-9]/.test(msg))throw err;
    await new Promise(resolve=>setTimeout(resolve,350));
   }
  }
 }
 async function boot(){
  const manifest=await file('data/atlas/manifest.json');
  if(manifest.schema!=='aeternalis-atlas-v1')throw Error('Versión de datos no compatible');
  const F=manifest.files,paths=[F.catalog,F.regions,F.realmLore,F.roads,F.civic,...F.locations];
  const release=String(manifest.revision||'datos-iniciales');
  const all=await Promise.all(paths.map(path=>file(path,release)));
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
    const script=document.createElement('script');script.src=BASE+manifest.core+'?v='+encodeURIComponent(release);
    script.onload=resolve;script.onerror=()=>reject(Error('No se pudo cargar el motor del Supermapa'));
    document.head.appendChild(script);
  });
 }
 function start(){boot().catch(err=>{console.error('[Aeternalis GitHub]',err);status('No se pudo cargar el Atlas. Comprueba tu conexión a GitHub Pages y recarga la página. Detalle: '+err.message)})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
