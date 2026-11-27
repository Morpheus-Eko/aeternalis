/* AETERNALIS · Grimorio de Estadísticas. Hoja CSS modular desde GitHub; sin alterar la skin del foro. */
(function(){'use strict';
  var ROOT='aeg-stats-grimoire',STYLE='aeg-stats-grimorio-v20',URL='https://morpheus-eko.github.io/aeternalis/css/stats-grimorio.css?v=2.0';
  function iniciar(){
    if(!document.getElementById(ROOT)||document.getElementById(STYLE))return;
    var link=document.createElement('link');
    link.id=STYLE;link.rel='stylesheet';link.href=URL;
    link.onload=function(){console.info('[Aeternalis] Grimorio de Estadísticas: estilos cargados desde GitHub.');};
    link.onerror=function(){link.remove();console.error('[Aeternalis] Falló el CSS de Grimorio de Estadísticas: '+URL);};
    (document.head||document.documentElement).appendChild(link);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();
