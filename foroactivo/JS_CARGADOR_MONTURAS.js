/* AETERNALIS: cargador de monturas-libro desde GitHub. Solo actúa si existe #am-app. */
(function(){'use strict';
  var SCRIPT_ID='ae-gh-monturas-libro';
  function start(){
    if(!document.getElementById('am-app') || document.getElementById(SCRIPT_ID))return;
    var s=document.createElement('script');s.id=SCRIPT_ID;
    s.src='https://morpheus-eko.github.io/aeternalis/js/monturas/libro.js?v=3.3.0';s.async=true;
    s.onerror=function(){console.error('[Aeternalis] Error cargando monturas-libro desde GitHub.');};
    (document.head||document.documentElement).appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
