/* AETERNALIS · Instalador del trazador de caminos por hexágonos.
   Una capa adicional del Supermapa; no sustituye el Atlas ni la Carta Náutica.
   Sólo carga cuando existe #aeternalis-atlas. */
(function(){
 'use strict';
 var BASE='https://morpheus-eko.github.io/aeternalis/';
 var VERSION='1.2.0';
 function mount(){
  if(new URLSearchParams(window.location.search).get('cartografo')!=='1')return;
  if(!document.getElementById('aeternalis-atlas'))return;
  if(!document.getElementById('ae-caminos-trazador-css')){
   var l=document.createElement('link');l.rel='stylesheet';l.id='ae-caminos-trazador-css';
   l.href=BASE+'css/supermapa-trazador.css?v='+VERSION;
   (document.head||document.documentElement).appendChild(l);
  }
  if(!document.getElementById('ae-caminos-trazador-js')){
   var s=document.createElement('script');s.id='ae-caminos-trazador-js';s.defer=true;
   s.src=BASE+'js/supermapa-trazador.js?v='+VERSION;
   s.onerror=function(){console.error('[Aeternalis] No se pudo cargar el Trazador de Caminos.');};
   (document.head||document.documentElement).appendChild(s);
  }
  if(!document.getElementById('ae-manual-caminos-css')){
   var css=document.createElement('link');css.rel='stylesheet';css.id='ae-manual-caminos-css';
   css.href=BASE+'css/supermapa-manual-caminos.css?v='+VERSION;
   (document.head||document.documentElement).appendChild(css);
  }
  if(!document.getElementById('ae-manual-caminos-js')){
   var m=document.createElement('script');m.id='ae-manual-caminos-js';m.defer=true;
   m.src=BASE+'js/supermapa-manual-caminos.js?v='+VERSION;
   m.onerror=function(){console.error('[Aeternalis] No se pudo cargar el editor manual de caminos.');};
   (document.head||document.documentElement).appendChild(m);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();