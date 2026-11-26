/* AETERNALIS · Razas 2.0 · Cargador mínimo para el panel JavaScript de Foroactivo.
   Sustituye SOLO el antiguo cargador de CSS del directorio de razas. */
(function () {
  'use strict';
  var BASE = 'https://morpheus-eko.github.io/aeternalis/';
  var VERSION = '2.1.0';
  function install() {
    if (!document.getElementById('ae-races-codex')) return;
    if (!document.getElementById('ae-races-visor-css')) {
      var css = document.createElement('link');
      css.id = 'ae-races-visor-css';
      css.rel = 'stylesheet';
      css.href = BASE + 'css/razas-modal.css?v=' + VERSION;
      document.head.appendChild(css);
    }
    if (!document.getElementById('ae-races-visor-js')) {
      var js = document.createElement('script');
      js.id = 'ae-races-visor-js';
      js.src = BASE + 'js/razas/visor.js?v=' + VERSION;
      js.defer = true;
      js.onerror = function () { console.error('[Aeternalis Razas] No se pudo cargar el visor; los enlaces antiguos siguen disponibles.'); };
      (document.body || document.head).appendChild(js);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();