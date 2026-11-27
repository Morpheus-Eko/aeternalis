/* AETERNALIS — ÚNICO JS PARA FOROACTIVO (todas las páginas).
   Desactiva primero los instaladores individuales de nuestros módulos.
   El código real y la configuración se mantienen en GitHub. */
(function(){
 'use strict';
 if(window.__AETERNALIS_MASTER_BOOTSTRAP__)return;
 window.__AETERNALIS_MASTER_BOOTSTRAP__=true;
 var s=document.createElement('script');
 s.id='aeternalis-maestro-github';
 s.src='https://morpheus-eko.github.io/aeternalis/js/aeternalis-maestro.js?v='+Math.floor(Date.now()/300000);
 s.async=true;
 s.onerror=function(){window.__AETERNALIS_MASTER_BOOTSTRAP__=false;console.error('[Aeternalis] No se pudo cargar el JS maestro desde GitHub Pages.');};
 (document.head||document.documentElement).appendChild(s);
})();
