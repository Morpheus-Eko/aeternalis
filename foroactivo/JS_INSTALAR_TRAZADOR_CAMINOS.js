/* AETERNALIS · Editor de caminos v1.3
   Para el Supermapa Leaflet: espera al motor real, aunque Foroactivo monte tarde el HTML.
   Se habilita con ?cartografo=1, ?dibujar=1 o ?caminos=1.
   No reemplaza ni modifica el JS principal del Atlas. */
(function(){
 'use strict';
 var params=new URLSearchParams(window.location.search);
 if(!['cartografo','dibujar','caminos'].some(function(k){return params.get(k)==='1';}))return;
 if(window.__AETERNALIS_CAMINOS_INSTALLER_V13__)return;
 window.__AETERNALIS_CAMINOS_INSTALLER_V13__=true;

 var BASE='https://morpheus-eko.github.io/aeternalis/';
 var VERSION='1.3.0', checks=0, limit=200, timer=null, done=false;
 var statusElement=null;

 function status(message){
   if(!statusElement){
     statusElement=document.createElement('div');
     statusElement.id='ae-caminos-installer-status';
     statusElement.setAttribute('role','status');
     statusElement.style.cssText='position:fixed;bottom:16px;left:16px;z-index:2147483645;max-width:min(420px,calc(100vw - 32px));background:#242e32;color:#f7deb1;border:1px solid #c29b65;border-radius:7px;padding:12px 14px;font:12px/1.55 system-ui,sans-serif;box-shadow:0 12px 32px #0009;';
     (document.body||document.documentElement).appendChild(statusElement);
   }
   statusElement.textContent=message;
 }
 function clearStatus(){if(statusElement&&statusElement.parentNode)statusElement.parentNode.removeChild(statusElement);statusElement=null;}
 function css(id,path){
   if(document.getElementById(id))return;
   var el=document.createElement('link');el.id=id;el.rel='stylesheet';el.href=BASE+path+'?v='+VERSION;
   (document.head||document.documentElement).appendChild(el);
 }
 function js(id,path,label){
   if(document.getElementById(id))return;
   var el=document.createElement('script');el.id=id;el.src=BASE+path+'?v='+VERSION;el.defer=true;
   el.onerror=function(){status('Aeternalis: no se pudo descargar '+label+' desde GitHub Pages. Comprueba la conexión y recarga la página.');console.error('[Aeternalis caminos] Error al descargar',el.src);};
   (document.head||document.documentElement).appendChild(el);
 }
 function start(){
   if(done)return;
   var root=document.getElementById('aeternalis-atlas');
   var debug=window.__AE_ATLAS_LEAFLET_DEBUG__;
   if(root&&debug&&debug.map&&debug.data&&typeof debug.getEdges==='function'&&window.L&&document.querySelector('#aeternalis-atlas .ae-leaf-toolbar-actions')){
     done=true;if(timer!==null)clearInterval(timer);
     css('ae-caminos-trazador-css','css/supermapa-trazador.css');
     css('ae-manual-caminos-css','css/supermapa-manual-caminos.css');
     js('ae-caminos-trazador-js','js/supermapa-trazador.js','el trazador automático');
     js('ae-manual-caminos-js','js/supermapa-manual-caminos.js','el editor manual');
     clearStatus();
     console.info('[Aeternalis caminos] Atlas detectado; cargando herramientas de Cartógrafo.');
     return;
   }
   checks++;
   if(checks===36&&root){
     status('Aeternalis: esperando a que termine de cargar el Supermapa Leaflet para activar «✎ Dibujar caminos»…');
   }
   if(checks===80&&root&&!debug){
     status('Aeternalis: el mapa está presente, pero aún no se detecta el motor Leaflet con interfaz de caminos. Comprueba que estés usando el Supermapa actualizado desde GitHub.');
   }
   if(checks>=limit){
     if(timer!==null)clearInterval(timer);
     if(root){
       status('El editor no pudo iniciarse. El Supermapa actual no expone la interfaz Leaflet requerida o no terminó de cargar. El mapa original permanece intacto.');
       console.warn('[Aeternalis caminos] Faltan dependencias:',{root:!!root,atlasApi:!!debug,edgeApi:!!(debug&&typeof debug.getEdges==='function'),leaflet:!!window.L,toolbar:!!document.querySelector('#aeternalis-atlas .ae-leaf-toolbar-actions')});
     }else{
       console.info('[Aeternalis caminos] No existe el contenedor #aeternalis-atlas en esta página.');
     }
   }
 }
 timer=setInterval(start,400);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 start();
})();
