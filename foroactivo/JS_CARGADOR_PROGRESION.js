/* AETERNALIS · Progresión. Hoja CSS modular desde GitHub; sin alterar la skin del foro. */
(function(){'use strict';
  var ROOT='aep-progress-book',STYLE='aep-progresion-styles-v11',URL='https://morpheus-eko.github.io/aeternalis/css/progresion-libro.css?v=1.1.0';
  function iniciar(){
    if(!document.getElementById(ROOT)||document.getElementById(STYLE))return;
    var link=document.createElement('link');
    link.id=STYLE;link.rel='stylesheet';link.href=URL;
    link.onload=function(){console.info('[Aeternalis] Progresión: estilos cargados desde GitHub.');};
    link.onerror=function(){link.remove();console.error('[Aeternalis] Falló el CSS de Progresión: '+URL);};
    (document.head||document.documentElement).appendChild(link);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();
