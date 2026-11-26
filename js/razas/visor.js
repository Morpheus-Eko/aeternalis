/* AETERNALIS · Visor de Razas 2.0
   Se acopla al índice #ae-races-codex sin alterar su HTML ni los otros módulos.
   Datos y portadas: GitHub Pages. Las fichas son Markdown editable por separado. */
(function () {
  'use strict';
  var ROOT_ID = 'ae-races-codex';
  var BASE = 'https://morpheus-eko.github.io/aeternalis/';
  var MANIFEST_URL = BASE + 'data/razas/manifest.json';
  var state = { races: [], current: null, modal: null, lastFocus: null, request: 0, cache: new Map() };
  var root = document.getElementById(ROOT_ID);
  if (!root || window.AeternalisRazasVisorV2) return;
  window.AeternalisRazasVisorV2 = { version: '2.0.0', open: openRace, close: closeRace };

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function getRace(id) {
    return state.races.find(function (r) { return r.id === id; });
  }
  function makeModal() {
    if (state.modal) return state.modal;
    var shade = el('div', 'ae-rv-shade');
    shade.id = 'ae-races-overlay';
    shade.hidden = true;
    shade.innerHTML =
      '<div class="ae-rv-panel" role="dialog" aria-modal="true" aria-labelledby="ae-rv-title" tabindex="-1">' +
        '<header class="ae-rv-head">' +
          '<img class="ae-rv-banner" alt="" aria-hidden="true" />' +
          '<div class="ae-rv-head-shade"></div>' +
          '<div class="ae-rv-head-copy"><span class="ae-rv-kicker">AETERNALIS · CÓDICE DE LOS PUEBLOS</span>' +
            '<div class="ae-rv-title-row"><h2 id="ae-rv-title"></h2><em class="ae-rv-sigil game-icon" aria-hidden="true"></em></div>' +
            '<p class="ae-rv-subtitle"></p></div>' +
          '<button type="button" class="ae-rv-close" aria-label="Cerrar ficha de raza" title="Cerrar (Esc)">×</button>' +
        '</header>' +
        '<div class="ae-rv-main">' +
          '<div class="ae-rv-portrait"><img alt="" decoding="async" /></div>' +
          '<div class="ae-rv-reader">' +
            '<nav class="ae-rv-toc" aria-label="Secciones de la ficha"></nav>' +
            '<div class="ae-rv-paper" tabindex="0" aria-label="Contenido de la ficha"><div class="ae-rv-content"></div></div>' +
          '</div>' +
        '</div>' +
        '<footer class="ae-rv-foot">' +
          '<button type="button" class="ae-rv-back">‹ <span>Anterior</span></button>' +
          '<div class="ae-rv-folio" aria-live="polite"></div>' +
          '<button type="button" class="ae-rv-next"><span>Siguiente</span> ›</button>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(shade);
    shade.addEventListener('click', function (ev) { if (ev.target === shade) closeRace(); });
    shade.querySelector('.ae-rv-close').addEventListener('click', closeRace);
    shade.querySelector('.ae-rv-back').addEventListener('click', function () { step(-1); });
    shade.querySelector('.ae-rv-next').addEventListener('click', function () { step(1); });
    shade.querySelector('.ae-rv-portrait img').addEventListener('error', function () {
      this.style.visibility = 'hidden'; // La ficha sigue siendo utilizable si Imgur falla
    });
    state.modal = shade;
    return shade;
  }
  function step(direction) {
    var i = state.races.findIndex(function (r) { return r.id === state.current; });
    if (i < 0) return;
    openRace(state.races[(i + direction + state.races.length) % state.races.length].id);
  }
  function onKey(ev) {
    if (!state.modal || state.modal.hidden) return;
    if (ev.key === 'Escape') { ev.preventDefault(); closeRace(); return; }
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      if (ev.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      ev.preventDefault();
      step(ev.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (ev.key !== 'Tab') return;
    var visible = Array.prototype.slice.call(state.modal.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]'))
      .filter(function (node) { return node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden'; });
    if (!visible.length) { ev.preventDefault(); state.modal.querySelector('.ae-rv-panel').focus(); return; }
    if (ev.shiftKey && document.activeElement === visible[0]) { ev.preventDefault(); visible[visible.length - 1].focus(); }
    else if (!ev.shiftKey && document.activeElement === visible[visible.length - 1]) { ev.preventDefault(); visible[0].focus(); }
  }
  function closeRace() {
    if (!state.modal || state.modal.hidden) return;
    state.modal.hidden = true;
    document.documentElement.classList.remove('ae-rv-scroll-lock');
    document.removeEventListener('keydown', onKey, true);
    state.current = null;
    state.request++;
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }
  function parseMarkdown(markdown, target, toc) {
    target.replaceChildren();
    toc.replaceChildren();
    var lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    var buffer = [], headingIndex = 0, subIndex = 0;
    function paragraph() {
      if (!buffer.length) return;
      var text = buffer.join(' ').replace(/\s+/g, ' ').trim();
      buffer = [];
      if (!text) return;
      target.appendChild(el('p', 'ae-rv-paragraph', text));
    }
    lines.forEach(function (line) {
      var major = line.match(/^#\s+(.+?)\s*$/);
      var minor = line.match(/^##\s+(.+?)\s*$/);
      var note = line.match(/^>\s*(.+?)\s*$/);
      if (major) {
        paragraph();
        var title = major[1], slug = 'ae-rv-section-' + (++headingIndex);
        var h = el('h3', 'ae-rv-section', title); h.id = slug; target.appendChild(h);
        var btn = el('button', 'ae-rv-toc-item', title); btn.type = 'button';
        btn.addEventListener('click', function () {
          var paper = state.modal.querySelector('.ae-rv-paper');
          var top = h.getBoundingClientRect().top - paper.getBoundingClientRect().top + paper.scrollTop - 12;
          paper.scrollTo({ top: top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        });
        toc.appendChild(btn);
        return;
      }
      if (minor) {
        paragraph();
        var h4 = el('h4', 'ae-rv-subsection', minor[1]);
        h4.id = 'ae-rv-subsection-' + (++subIndex);
        target.appendChild(h4);
        return;
      }
      if (note) {
        paragraph();
        target.appendChild(el('aside', 'ae-rv-note', note[1]));
        return;
      }
      if (!line.trim()) paragraph();
      else buffer.push(line.trim());
    });
    paragraph();
  }
  async function getContent(race) {
    if (state.cache.has(race.id)) return state.cache.get(race.id);
    var response = await fetch(race.file);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    var content = await response.text();
    if (!content || content.length < 60) throw new Error('Ficha vacía');
    state.cache.set(race.id, content);
    return content;
  }
  async function openRace(id) {
    var race = getRace(id);
    if (!race) return false;
    var modal = makeModal();
    if (modal.hidden) {
      state.lastFocus = document.activeElement;
      modal.hidden = false;
      document.documentElement.classList.add('ae-rv-scroll-lock');
      document.addEventListener('keydown', onKey, true);
    }
    state.current = id;
    var token = ++state.request;
    var index = state.races.indexOf(race);
    modal.style.setProperty('--ae-rv-accent', race.color);
    modal.style.setProperty('--ae-rv-portrait-width', Math.max(250, Math.min(460, race.portraitWidth || 370)) + 'px');
    modal.querySelector('.ae-rv-banner').src = race.hero;
    modal.querySelector('#ae-rv-title').textContent = race.name;
    modal.querySelector('.ae-rv-subtitle').textContent = race.subtitle;
    modal.querySelector('.ae-rv-sigil').className = 'ae-rv-sigil game-icon game-icon-' + race.symbol;
    var portrait = modal.querySelector('.ae-rv-portrait img');
    portrait.style.visibility = 'visible';
    portrait.src = race.portrait;
    portrait.alt = 'Ilustración representativa de ' + race.name;
    modal.querySelector('.ae-rv-folio').textContent = 'FOLIO ' + String(index + 1).padStart(2, '0') + ' / ' + String(state.races.length).padStart(2, '0');
    modal.querySelector('.ae-rv-back span').textContent = state.races[(index + state.races.length - 1) % state.races.length].shortName;
    modal.querySelector('.ae-rv-next span').textContent = state.races[(index + 1) % state.races.length].shortName;
    var content = modal.querySelector('.ae-rv-content');
    var toc = modal.querySelector('.ae-rv-toc');
    var paper = modal.querySelector('.ae-rv-paper');
    paper.scrollTop = 0;
    content.replaceChildren(el('p', 'ae-rv-loading', 'Abriendo los archivos del códice…'));
    toc.replaceChildren();
    modal.querySelector('.ae-rv-close').focus();
    try {
      var markdown = await getContent(race);
      if (token !== state.request) return true;
      parseMarkdown(markdown, content, toc);
    } catch (err) {
      if (token !== state.request) return false;
      content.replaceChildren();
      content.appendChild(el('h3', 'ae-rv-section', 'No se pudo abrir la ficha'));
      content.appendChild(el('p', 'ae-rv-paragraph', 'El archivo del códice no está disponible en este momento. Puedes consultar la publicación anterior mientras se restablece.'));
      var link = el('a', 'ae-rv-fallback', 'Ver ficha anterior');
      link.href = race.legacy;
      content.appendChild(link);
      console.error('[Aeternalis Razas] Error cargando ' + race.id, err);
    }
    return true;
  }
  function init(manifest) {
    if (!manifest || !Array.isArray(manifest.races) || manifest.races.length !== 8) throw new Error('Manifiesto de razas inválido');
    state.races = manifest.races;
    var cards = root.querySelectorAll('.ae-race-card');
    cards.forEach(function (card) {
      var hit = card.className.match(/ae-race-card--([a-z]+)/);
      if (!hit) return;
      var race = getRace(hit[1]);
      if (!race) return;
      card.dataset.aeRace = race.id;
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', 'Abrir ficha de ' + race.name + ' sin salir del índice');
      card.style.setProperty('--ae-picture', 'url("' + race.hero + '")');
      var subtitle = card.querySelector('.ae-race-subtitle');
      if (subtitle) subtitle.textContent = race.subtitle;
    });
    root.addEventListener('click', function (ev) {
      var card = ev.target.closest('.ae-race-card[data-ae-race]');
      if (!card || !root.contains(card)) return;
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      openRace(card.dataset.aeRace);
    });
    root.addEventListener('keydown', function (ev) {
      if (ev.key !== ' ' || !ev.target.matches('.ae-race-card[data-ae-race]')) return;
      ev.preventDefault();
      openRace(ev.target.dataset.aeRace);
    });
    root.classList.add('ae-rv-ready');
  }
  fetch(MANIFEST_URL)
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(init)
    .catch(function (error) {
      // Fallo sin efectos destructivos: los enlaces de siempre siguen funcionando.
      console.error('[Aeternalis Razas] No se pudo iniciar el visor:', error);
    });
})();