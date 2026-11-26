/* AETERNALIS · BESTIARIO GitHub 2.0 · instalar en Foroactivo En los temas.
   Desactivar los TRES JS anteriores del bestiario. NO modificar el Atlas. */
(()=>{
'use strict';
const ROOT='aeb-bestiary';
const BASE='https://morpheus-eko.github.io/aeternalis/';
if(window.__AEB_BESTIARY_GITHUB_LOADING__)return;
window.__AEB_BESTIARY_GITHUB_LOADING__=true;
const get=async(path)=>{
 // Permite validación HTTP (ETag/304) sin forzar una descarga íntegra cada visita.
 const r=await fetch(BASE+path,{cache:'no-cache'});
 if(!r.ok)throw Error(path+' · HTTP '+r.status);
 return await r.json();
};
function fail(root,err){
 console.error('[Aeternalis/Bestiario/GitHub]',err);
 const box=document.createElement('div');box.style.cssText='padding:20px;border:1px solid #765d41;background:#16191b;color:#e7d5b8;font:16px Georgia,serif';
 box.textContent='No se pudo cargar el Bestiario: '+err.message+' ';
 const retry=document.createElement('button');retry.type='button';retry.textContent='Reintentar';retry.style.cssText='margin-left:12px;padding:8px 12px';retry.onclick=()=>location.reload();box.append(retry);root.replaceChildren(box);
}
async function start(){
 const root=document.getElementById(ROOT);if(!root)return;
 root.textContent='Cargando Bestiario de Aeternalis desde GitHub…';
 try{
  const manifest=await get('data/bestiario/manifest.json');
  if(manifest.schema!=='aeternalis-bestiario-v2'||manifest.totalCreatures!==80||manifest.volumes.length!==8)throw Error('Versión de datos incompatible');
  const [assets,...books]=await Promise.all([get(manifest.visualAssets),...manifest.volumes.map(item=>get(item.path))]);
  const tomes={bergheim:{},yugen:{}};
  const index={bergheim:[],yugen:[]};
  const ids=new Set();
  for(let i=0;i<books.length;i++){
   const conf=manifest.volumes[i],book=books[i];
   if(book.region!==conf.region||book.volume!==conf.volume||!Array.isArray(book.creatures)||book.creatures.length!==conf.creatures)throw Error('Tomo inconsistente: '+conf.path);
   if(!tomes[conf.region]||tomes[conf.region][conf.volume])throw Error('Tomo duplicado: '+conf.path);
   tomes[conf.region][conf.volume]=book;
   for(const c of book.creatures){
    if(!c.id||!c.name||ids.has(c.id))throw Error('Identificador de criatura ausente o duplicado: '+conf.path);
    ids.add(c.id);
    index[conf.region].push({number:c.number,name:c.name,volume:conf.volume,imgurId:c.imgurId});
   }
  }
  if(ids.size!==manifest.totalCreatures)throw Error('Cantidad de criaturas inconsistente');
  for(const region of Object.keys(index)){
   index[region].sort((a,b)=>a.number-b.number);
   if(index[region].length!==40||index[region].some((c,i)=>c.number!==i+1||c.volume!==Math.floor(i/10)+1))throw Error('Orden de especies incorrecto: '+region);
  }
  window.__AEB_BESTIARY_ASSETS__=assets;
  window.__AEB_BESTIARY_DATA__=tomes;
  window.__AEB_BESTIARY_INDEX__=index;
  const s=document.createElement('script');s.src=BASE+manifest.engine+'?v='+encodeURIComponent(manifest.revision);
  s.onerror=()=>fail(root,Error('No se pudo cargar el motor del Bestiario'));
  document.head.appendChild(s);
 }catch(err){fail(root,err)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();