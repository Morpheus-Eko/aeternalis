/* Aeternalis — Cronología v3.0.0. Código pequeño para Foroactivo.
 * Desactiva el antiguo JS de Cronología v2 antes de activar éste. */
(function () {
  'use strict';
  var ROOT_ID = 'aec-cronologia';
  var BASE = 'https://morpheus-eko.github.io/aeternalis/';
  var VERSION='3.0.0';
  function install() {
    if (!document.getElementById(ROOT_ID)) return;
    if (!document.getElementById('aec-cronologia-v3-css')) {
      var css=document.createElement('link');
      css.id='aec-cronologia-v3-css';
      css.rel='stylesheet'; css.href=BASE+'css/cronologia-v3.css?v='+VERSION;
      document.head.appendChild(css);
    }
    if (!document.getElementById('aec-cronologia-v3-js')) {
      var js=document.createElement('script');
      js.id='aec-cronologia-v3-js';
      js.src=BASE+'js/cronologia/visor.js?v='+VERSION;
      js.defer=true;
      js.onerror=function(){console.error('[Cronología] No se pudo descargar el motor GitHub.');};
      (document.body||document.head).appendChild(js);
    }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();