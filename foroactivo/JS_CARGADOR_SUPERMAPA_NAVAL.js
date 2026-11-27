/* AETERNALIS · Capa marítima del SUPERMAPA v3.3.
   CSS y JavaScript independientes. Sólo se ejecuta cuando el Atlas está presente. */
(function(){
 'use strict';
 var BASE='https://morpheus-eko.github.io/aeternalis/';
 var VERSION='3.3.0';
 function start(){
   if(!document.getElementById('aeternalis-atlas'))return;
   if(!document.getElementById('ae-supermapa-naval-css')){
     var l=document.createElement('link');
     l.id='ae-supermapa-naval-css';l.rel='stylesheet';
     l.href=BASE+'css/supermapa-naval.css?v='+VERSION;
     (document.head||document.documentElement).appendChild(l);
   }
   if(!document.getElementById('ae-supermapa-naval-js')){
     var s=document.createElement('script');
     s.id='ae-supermapa-naval-js';
     s.src=BASE+'js/supermapa-naval.js?v='+VERSION;
     s.defer=true;
     s.onerror=function(){console.error('[Aeternalis] No se cargó la Carta Náutica del Atlas.');};
     (document.body||document.head).appendChild(s);
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();