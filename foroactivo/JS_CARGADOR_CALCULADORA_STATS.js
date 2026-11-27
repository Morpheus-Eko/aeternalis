/* AETERNALIS: cargador de stats-calculadora desde GitHub. Solo actúa si existe #aes-stats. */
(function(){'use strict';
  var SCRIPT_ID='ae-gh-stats-calculadora';
  function start(){
    if(!document.getElementById('aes-stats') || document.getElementById(SCRIPT_ID))return;
    var s=document.createElement('script');s.id=SCRIPT_ID;
    s.src='https://morpheus-eko.github.io/aeternalis/js/stats/calculadora.js?v=2.0.0';s.async=true;
    s.onerror=function(){console.error('[Aeternalis] Error cargando stats-calculadora desde GitHub.');};
    (document.head||document.documentElement).appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
