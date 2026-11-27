/* AETERNALIS — CSS del Libro Nórdico de Progresión. Solo funciona en la publicación que contiene #aep-progress-book. */
(function(){'use strict';
  /* CAMBIA LA DIRECCIÓN por la página HTML NUEVA donde guardes el CSS */
  var CSS_PAGE='https://morpheus-eko.github.io/aeternalis/css/progresion-libro.css?v=1.0.0';
  var ROOT='aep-progress-book', STYLE='aep-progresion-css';
  function iniciar(){
    if(!document.getElementById(ROOT)||document.getElementById(STYLE)) return;
    fetch(CSS_PAGE,{credentials:'same-origin',cache:'no-store'})
      .then(function(r){if(!r.ok) throw Error('HTTP '+r.status);return r.text();})
      .then(function(page){
        var ini='/* AEP_PROGRESION_CSS_INICIO */';
        var fin='/* AEP_PROGRESION_CSS_FIN */';
        var a=page.indexOf(ini),b=page.indexOf(fin);
        if(a<0||b<a) throw Error('No se encontró el CSS de progresión. Revisa '+CSS_PAGE);
        var s=document.createElement('style');s.id=STYLE;s.textContent=page.slice(a,b+fin.length);
        document.head.appendChild(s);
        console.info('[Aeternalis] CSS de Progresión cargado.');
      }).catch(function(e){console.error('[Aeternalis] Error al cargar CSS de Progresión:',e);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();