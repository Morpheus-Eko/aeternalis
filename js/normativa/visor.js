/* AETERNALIS · Normativa 1.0.0 · contenido y CSS se alojan en GitHub */
(function(){'use strict';
 var root=document.getElementById('ae-normativa-mount');
 if(!root||root.getAttribute('data-aen-boot'))return;
 var base='https://morpheus-eko.github.io/aeternalis/';
 root.setAttribute('data-aen-boot','loading');
 fetch(base+'data/normativa/contenido.html?v=1.1.0',{cache:'no-cache'})
 .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
 .then(function(markup){
  if(markup.indexOf('class="ae-normativa')<0)throw new Error('No se encontró el códice');
  root.innerHTML=markup;
(function(){
  function initNormativaChapters(root){
    if(!root || root.dataset.aeChapterTabs === 'ready') return;
    var panels = Array.prototype.slice.call(root.querySelectorAll('.ae-chapter'));
    var controls = Array.prototype.slice.call(root.querySelectorAll('[data-target]'));
    if(!panels.length || !controls.length) return;

    function activate(id, pushHash){
      root.setAttribute('data-ae-chapter', id);
      panels.forEach(function(panel){
        var active = panel.id === id;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
      controls.forEach(function(control){
        var active = control.getAttribute('data-target') === id;
        control.classList.toggle('is-active', active);
        if(control.matches('.ae-chapter-tab')){
          control.setAttribute('aria-selected', active ? 'true' : 'false');
          control.setAttribute('tabindex', active ? '0' : '-1');
        }
      });
      if(pushHash){
        try { history.replaceState(null, '', '#' + id); } catch(e) {}
      }
    }

    controls.forEach(function(control){
      control.addEventListener('click', function(ev){
        if(control.tagName === 'A') ev.preventDefault();
        var id = control.getAttribute('data-target');
        if(id) activate(id, true);
      });
    });

    var initial = panels[0].id;
    if(window.location.hash){
      var hashId = window.location.hash.slice(1);
      var target = document.getElementById(hashId);
      if(target && root.contains(target)) initial = hashId;
    }
    activate(initial, false);
    root.dataset.aeChapterTabs = 'ready';
  }

  function start(){
    document.querySelectorAll('.ae-normativa').forEach(initNormativaChapters);
  }

  start();
})();
   root.setAttribute('data-aen-boot','ready');
 })
 .catch(function(error){
  root.setAttribute('data-aen-boot','error');
  root.innerHTML='<p>No fue posible cargar la normativa. <a href="'+base+'normativa-preview.html">Abrir la normativa en GitHub Pages</a>.</p>';
  console.error('[Aeternalis/Normativa]',error);
 });
})();