/* AETERNALIS · Códice de Magia. Hoja CSS modular desde GitHub; sin alterar la skin del foro. */
(function(){'use strict';
  var ROOT='aem-magic-codex',STYLE='aem-magic-codex-styles-v20',URL='https://morpheus-eko.github.io/aeternalis/css/magia-codice.css?v=2.0.0';
  function iniciar(){
    if(!document.getElementById(ROOT)||document.getElementById(STYLE))return;
    var link=document.createElement('link');
    link.id=STYLE;link.rel='stylesheet';link.href=URL;
    link.onload=function(){console.info('[Aeternalis] Códice de Magia: estilos cargados desde GitHub.');};
    link.onerror=function(){link.remove();console.error('[Aeternalis] Falló el CSS de Códice de Magia: '+URL);};
    (document.head||document.documentElement).appendChild(link);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();
