/* AETERNALIS · Normativa 1.0.0 · contenido y CSS se alojan en GitHub */
(function(){'use strict';
 var root=document.getElementById('ae-normativa-mount');
 if(!root||root.getAttribute('data-aen-boot'))return;
 var base='https://morpheus-eko.github.io/aeternalis/';
 root.setAttribute('data-aen-boot','loading');
 fetch(base+'data/normativa/contenido.html?v=1.0.0',{cache:'no-cache'})
 .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
 .then(function(markup){
  if(markup.indexOf('class="ae-normativa')<0)throw new Error('No se encontró el códice');
  root.innerHTML=markup;root.setAttribute('data-aen-boot','ready');
 })
 .catch(function(error){
  root.setAttribute('data-aen-boot','error');
  root.innerHTML='<p>No fue posible cargar la normativa. <a href="'+base+'normativa-preview.html">Abrir la normativa en GitHub Pages</a>.</p>';
  console.error('[Aeternalis/Normativa]',error);
 });
})();