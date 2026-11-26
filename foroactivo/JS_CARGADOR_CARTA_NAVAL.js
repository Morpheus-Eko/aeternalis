/* AETERNALIS · Carta Náutica v1.0 · Cargador aislado.
   No altera el Supermapa existente ni sus rutas terrestres. */
(function(){
 'use strict';
 var BASE='https://morpheus-eko.github.io/aeternalis/';
 var VERSION='1.0.0';
 function start(){
   if(!document.getElementById('ae-carta-naval'))return;
   if(!document.getElementById('ae-carta-naval-css-v1')){
     var style=document.createElement('link');
     style.id='ae-carta-naval-css-v1';
     style.rel='stylesheet';
     style.href=BASE+'css/carta-naval.css?v='+VERSION;
     (document.head||document.documentElement).appendChild(style);
   }
   if(!document.getElementById('ae-carta-naval-js-v1')){
     var script=document.createElement('script');
     script.id='ae-carta-naval-js-v1';
     script.src=BASE+'js/astillero/carta-naval.js?v='+VERSION;
     script.defer=true;
     script.onerror=function(){console.error('[Aeternalis] Falló el cargador de Carta Náutica.');};
     (document.body||document.head).appendChild(script);
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();