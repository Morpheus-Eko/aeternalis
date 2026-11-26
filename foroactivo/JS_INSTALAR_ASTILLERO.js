/* ÚNICO fragmento que debes pegar en Gestión de los códigos JavaScript de Foroactivo.
   Solo se activa si hay una página o publicación con id="ae-astillero". */
(function () {
  if (window.__AETERNALIS_ASTILLERO_LOADER__) return;
  window.__AETERNALIS_ASTILLERO_LOADER__ = true;
  var script=document.createElement('script');
  script.src='https://morpheus-eko.github.io/aeternalis/foroactivo/JS_CARGADOR_ASTILLERO.js?v=1.1.0';
  script.onerror=function(){window.__AETERNALIS_ASTILLERO_LOADER__=false;};
  (document.head||document.documentElement).appendChild(script);
})();