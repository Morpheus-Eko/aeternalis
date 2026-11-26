/* AETERNALIS · Astillero 1.1 · Cargador desacoplado de Foroactivo.
   Instalar UNA sola vez; únicamente actúa donde existe #ae-astillero. */
(function () {
  'use strict';
  var BASE='https://morpheus-eko.github.io/aeternalis/';
  var VERSION='1.1.0';
  function install() {
    if (!document.getElementById('ae-astillero')) return;
    if (!document.getElementById('ae-astillero-css-v1')) {
      var css=document.createElement('link');
      css.id='ae-astillero-css-v1';
      css.rel='stylesheet';
      css.href=BASE+'css/astillero.css?v='+VERSION;
      document.head.appendChild(css);
    }
    if (!document.getElementById('ae-astillero-js-v1')) {
      var js=document.createElement('script');
      js.id='ae-astillero-js-v1';
      js.src=BASE+'js/astillero/visor.js?v='+VERSION;
      js.defer=true;
      js.onerror=function(){console.error('[Astillero] No se pudo cargar el motor desde GitHub Pages.');};
      (document.body||document.head).appendChild(js);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();