/* Compatibilidad histórica: la Carta Náutica se carga únicamente en el Supermapa. */
(function(){
 'use strict';
 if(window.__AETERNALIS_NAVAL_INSTALLER__)return;
 window.__AETERNALIS_NAVAL_INSTALLER__=true;
 var s=document.createElement('script');
 s.src='https://morpheus-eko.github.io/aeternalis/foroactivo/JS_CARGADOR_SUPERMAPA_NAVAL.js?v=2.0.0';
 (document.head||document.documentElement).appendChild(s);
})();