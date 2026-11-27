/* INSTALAR EN GESTIÓN DE JAVASCRIPT DE FOROACTIVO.
   Añade la Carta Náutica al Supermapa existente. No añadir contenedores HTML extra. */
(function(){
 'use strict';
 if(window.__AETERNALIS_NAVAL_INSTALLER__)return;
 window.__AETERNALIS_NAVAL_INSTALLER__=true;
 var s=document.createElement('script');
 s.src='https://morpheus-eko.github.io/aeternalis/foroactivo/JS_CARGADOR_SUPERMAPA_NAVAL.js?v=3.3.0';
 s.onerror=function(){window.__AETERNALIS_NAVAL_INSTALLER__=false;};
 (document.head||document.documentElement).appendChild(s);
})();