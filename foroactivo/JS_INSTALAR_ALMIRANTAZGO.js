/* INSTALADOR ÚNICO de Astillero + Carta Náutica.
   Pegar una sola vez en Gestión de JavaScript de Foroactivo.
   Se activa únicamente donde existan los contenedores correspondientes.
   Si ya instalaste el JS del Astillero anterior, desactívalo para evitar doble carga. */
(function(){
 'use strict';
 if(window.__AETERNALIS_ALMIRANTAZGO_INSTALLER__)return;
 window.__AETERNALIS_ALMIRANTAZGO_INSTALLER__=true;
 var BASE='https://morpheus-eko.github.io/aeternalis/foroactivo/';
 function include(name,version,id){
   if(document.getElementById(id))return;
   var s=document.createElement('script');
   s.id=id;s.src=BASE+name+'?v='+version;
   s.onerror=function(){console.error('[Almirantazgo] Error de carga: '+name);};
   (document.head||document.documentElement).appendChild(s);
 }
 function init(){
   if(document.getElementById('ae-astillero'))include('JS_CARGADOR_ASTILLERO.js','1.2.0','ae-almirantazgo-loader-astillero');
   if(document.getElementById('ae-carta-naval'))include('JS_CARGADOR_CARTA_NAVAL.js','1.1.0','ae-almirantazgo-loader-carta');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();