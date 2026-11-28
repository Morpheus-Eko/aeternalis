/* AETERNALIS — Crónicas de las Eras v3.3.0
 * Motor aislado del Supermapa, Bestiario y Códice de Razas.
 * La narración y los recursos gráficos viven en data/cronologia/manifest.json y data/cronologia/eras/.
 */
(function () {
  'use strict';
  var BASE = 'https://morpheus-eko.github.io/aeternalis/';
  var ROOT = document.getElementById('aec-cronologia');
  if (!ROOT || ROOT.getAttribute('data-aec-v3')) return;
  ROOT.setAttribute('data-aec-v3', 'loading');
  var state = { manifest: null, seals: null, modal: null, current: -1, request: 0, cache: new Map(), lastFocus: null };
  var lockWasPresent = false;
  var previousBodyOverflow = null;
  var originalTitle = document.title;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* Aen-Vahr: símbolos ficticios, no traducción literal de la narración.
     Las eras totalmente selladas no descargan sus archivos markdown. */
  var SEALED_TOTALS={genesis:6,primera:7,segunda:7,tercera:9};
  var SYLLABLES=[
    'ᚹᚨᛟᚾ','ᛞᚱᛖᛉ','ᛇᛃᚢᛞ','ᚠᚨᛚᚱ','ᚾᛇᚦᚨ','ᛜᚷᚢᛟ',
    'ᚦᛟᛗ','ᛊᛁᚾᛟ','ᛗᚨᛇᚱ','ᛒᚢᚾᛇ','ᛟᛊᚦᛖ','ᛏᛇᚨ',
    'ᚷᛟᛚᚾ','ᛖᚦᚹᛖ','ᛊᚨᛗᛜ','ᚱᚢᛖᛟ','ᚨᚱᛃᚢ','ᛗᛟᚲ',
    'ᚾᚨᛁᚦ','ᛜᚢᚱᚠ','ᛃᛟᛗᛖ','ᛊᛖᚱᛃ','ᛒᚨᚱᛖ','ᚲᛗᛇᛞ'
  ];
  function sealFor(era){
    var total=SEALED_TOTALS[era.id];
    if(!total)return null;
    var entry=state.seals&&state.seals.eras&&state.seals.eras[era.id];
    var raw=entry&&Array.isArray(entry.revelados)?entry.revelados:[];
    return {total:total,revelados:raw.filter(function(n,i){
      return Number.isInteger(n)&&n>=0&&n<total&&raw.indexOf(n)===i;
    })};
  }
  function stillSealed(era){
    var s=sealFor(era);return !!(s&&s.revelados.length<s.total);
  }
  function seedOf(s){
    var h=2166136261;
    for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function inscription(id,index,part,length){
    var seed=seedOf(id+':'+index+':'+part),terms=[];
    for(var i=0;i<length;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      var term=SYLLABLES[seed%SYLLABLES.length];
      if(i%11===0)term='⟡'+term;
      if(i%9===8)term+='᛬';
      terms.push(term);
    }
    return terms.join(' ᛫ ');
  }

  // Una interfaz cifrada para las cuatro eras selladas. Los glifos no son
  // traducciones; se generan de forma determinista para mantener consistencia.
  function ancientUi(era,kind){
    var table={
      chapter:[401,1],title:[402,2],subtitle:[403,3],
      badge:[404,2],eyebrow:[405,2],caption:[406,2],
      folio:[407,2],loading:[408,3],end:[409,2]
    };
    var spec=table[kind]||table.title;
    return inscription(era.id,'ui-'+kind,spec[0],spec[1]);
  }
  function displayEra(era,kind){
    if(stillSealed(era))return ancientUi(era,kind);
    if(kind==='chapter')return 'CAPÍTULO '+era.numero;
    if(kind==='title')return era.nombre;
    if(kind==='subtitle')return era.subtitulo;
    if(kind==='eyebrow')return 'LOS ANALES DE AETERNALIS';
    if(kind==='caption')return 'CRÓNICA ILUSTRADA';
    if(kind==='folio')return 'FOLIO '+String((state.manifest.eras||[]).indexOf(era)+1).padStart(2,'0')+' / 05';
    if(kind==='loading')return 'Abriendo los anales de '+era.nombre+'…';
    if(kind==='end')return 'Fin del capítulo · '+era.nombre;
    return era.nombre;
  }

  function unreadablePassage(id,index){
    var body=[];
    for(var p=0;p<3;p++){
      body.push(inscription(id,index,p,14+p*2)+' ᛭ '+inscription(id,index,p+27,13+p));
    }
    return body.join('\n\n');
  }
  function mixedMarkdown(era,seal,originalText){
    var sections=originalText?originalText.replace(/\r\n?/g,'\n').split(/(?=^##\s)/m):[];
    var out=[];
    for(var i=0;i<seal.total;i++){
      if(seal.revelados.indexOf(i)>=0&&sections[i]){out.push(sections[i]);continue;}
      out.push((i===0?'# ':'## ')+inscription(era.id,i,97,i===0?3:2)+
        '\n\n'+unreadablePassage(era.id,i));
    }
    return out.join('\n\n');
  }
  function sealStatus(era,modal){
    var banner=modal.querySelector('.aecm-seal-status'),s=sealFor(era);
    modal.classList.toggle('aecm-is-sealed',!!(s&&s.revelados.length<s.total));
    banner.hidden=!s;
    if(s){
      var sealed=s.revelados.length<s.total;
      banner.textContent=sealed?ancientUi(era,'badge')+' ⟡ '+ancientUi(era,'subtitle'):
        '✧ MEMORIA RECUPERADA · '+s.total+' pasajes descifrados';
      banner.setAttribute('aria-label',sealed?
        'Manuscrito parcialmente o totalmente indescifrado: '+s.revelados.length+' de '+s.total+' pasajes conocidos':
        'Memoria recuperada: '+s.total+' pasajes descifrados');
      banner.classList.toggle('aecm-ancient-ui',sealed);
    }
  }
  async function loadSeals(){
    try{
      var response=await fetch(BASE+'data/cronologia/desbloqueos.json?v='+Date.now(),{cache:'no-store',mode:'cors',credentials:'omit'});
      if(!response.ok)throw Error('HTTP '+response.status);
      var result=await response.json();
      if(result.schema!=='aeternalis-cronologia-sellos-v1')throw Error('Esquema de sellos inválido');
      return result;
    }catch(e){
      console.warn('[Aeternalis Cronología] No se pudo obtener la configuración; las eras antiguas permanecerán selladas.',e);
      return {eras:{}};
    }
  }

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function asset(path) { return BASE + path; }

  function buildIndex(data) {
    ROOT.replaceChildren();
    var header = node('header', 'aec-head');
    header.appendChild(node('span', 'aec-kicker', 'Los Anales de Aeternalis'));
    header.appendChild(node('h2', 'aec-title', 'Crónicas de las Eras'));
    header.appendChild(node('span', 'aec-ornament'));
    header.appendChild(node('p', 'aec-intro', 'Las eras antiguas guardan los ecos de una lengua perdida. Cada descubrimiento devuelve un fragmento a la memoria.'));
    ROOT.appendChild(header);
    var nav = node('nav', 'aec-grid');
    nav.setAttribute('aria-label', 'Capítulos de la cronología');
    data.eras.forEach(function (era, idx) {
      var card = node('a', 'aec-card');
      var cryptic=stillSealed(era);
      card.href=cryptic?'#aec-cronologia':era.enlace;
      if(cryptic)card.classList.add('aec-card--sealed');
      card.dataset.aecEra = era.id;
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', cryptic?'Abrir manuscrito sellado '+String(idx+1):'Abrir la crónica de '+era.nombre);
      card.style.setProperty('--aec-accent', era.color);
      var img = node('img', 'aec-card-image'); img.alt = ''; img.src = era.fondo; img.loading = idx < 3 ? 'eager' : 'lazy'; img.decoding = 'async';
      card.appendChild(img);
      var info = node('span', 'aec-card-info');
      var badge = node('span', 'aec-emblem');
      var emblem = node('img'); emblem.src = era.icono; emblem.alt = ''; emblem.loading = 'lazy'; emblem.decoding = 'async';
      badge.appendChild(emblem);
      var label = node('span', 'aec-card-text');
      label.appendChild(node('span', 'aec-index'+(cryptic?' aec-ancient-ui':''), displayEra(era,'chapter')));
      label.appendChild(node('strong', 'aec-card-title'+(cryptic?' aec-ancient-ui':''), displayEra(era,'title')));
      label.appendChild(node('span', 'aec-subtitle'+(cryptic?' aec-ancient-ui':''), displayEra(era,'subtitle')));
      if(cryptic){
        var chip=node('small','aec-seal-chip aec-ancient-ui', ancientUi(era,'badge'));
        chip.setAttribute('aria-label','Manuscrito sin descifrar');
        label.appendChild(chip);
      }
      info.appendChild(badge); info.appendChild(label); card.appendChild(info); nav.appendChild(card);
    });
    ROOT.appendChild(nav);
    ROOT.appendChild(node('p', 'aec-foot', 'El tiempo conserva aquello que la memoria olvida.'));
    ROOT.setAttribute('data-aec-v3', 'ready');
    ROOT.addEventListener('click', function (event) {
      var a = event.target.closest('[data-aec-era]');
      if (!a || !ROOT.contains(a)) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(a.dataset.aecEra);
    });
  }

  function buildModal() {
    if (state.modal) return state.modal;
    var overlay = node('div', 'aecm-overlay');
    overlay.id = 'aec-chronicle-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<section class="aecm-dialog" role="dialog" aria-modal="true" aria-labelledby="aecm-dialog-title" tabindex="-1">' +
      '<header class="aecm-hero">' +
        '<img class="aecm-hero-image" alt="" />' +
        '<div class="aecm-hero-shade"></div>' +
        '<div class="aecm-hero-text">' +
          '<div class="aecm-eyebrow"><span class="aecm-library-label">LOS ANALES DE AETERNALIS</span> · <span class="aecm-cap"></span></div>' +
          '<div class="aecm-heading"><h2 id="aecm-dialog-title"></h2><img class="aecm-hero-emblem" alt="" /></div>' +
          '<p class="aecm-hero-subtitle"></p>' +
        '</div>' +
        '<button type="button" class="aecm-close" aria-label="Cerrar crónica" title="Cerrar (Esc)">×</button>' +
      '</header>' +
      '<div class="aecm-inner">' +
        '<aside class="aecm-side aecm-side-left" aria-hidden="true">' +
          '<span class="aecm-side-mark">✒</span><span class="aecm-side-line"></span>' +
          '<img class="aecm-rune" alt="" /><span class="aecm-side-line"></span><span class="aecm-side-mark aecm-skull">☠</span>' +
        '</aside>' +
        '<div class="aecm-reading">' +
          '<div class="aecm-seal-status" role="status" hidden></div>' +
          '<div class="aecm-toolbar"><nav class="aecm-toc" aria-label="Pasajes de esta era"></nav>' +
            '<span class="aecm-reading-caption">CRÓNICA ILUSTRADA</span></div>' +
          '<div class="aecm-scroll" tabindex="0" aria-label="Texto de la crónica">' +
            '<div class="aecm-parchment"><div class="aecm-prose"></div></div>' +
          '</div>' +
        '</div>' +
        '<aside class="aecm-side aecm-side-right" aria-hidden="true">' +
          '<span class="aecm-side-mark">ᚠ</span><span class="aecm-side-line"></span>' +
          '<img class="aecm-watermark" alt="" /><span class="aecm-side-line"></span><span class="aecm-side-mark">✒</span>' +
        '</aside>' +
      '</div>' +
      '<footer class="aecm-footer">' +
        '<button class="aecm-prev" type="button" aria-label="Era anterior">‹ <span>Era anterior</span></button>' +
        '<div class="aecm-footer-middle"><div class="aecm-folio"></div><div class="aecm-progress"><span></span></div></div>' +
        '<button class="aecm-next" type="button" aria-label="Era siguiente"><span>Era siguiente</span> ›</button>' +
      '</footer>' +
      '</section>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.aecm-close').addEventListener('click', close);
    overlay.querySelector('.aecm-prev').addEventListener('click', function () { step(-1); });
    overlay.querySelector('.aecm-next').addEventListener('click', function () { step(1); });
    overlay.querySelector('.aecm-scroll').addEventListener('scroll', updateProgress, { passive: true });
    overlay.querySelector('.aecm-hero-image').addEventListener('error', function () {
      this.style.visibility = 'hidden'; // No obstruye la lectura si falla Postimg.
    });
    overlay.querySelector('.aecm-hero-emblem').addEventListener('error', function () { this.style.visibility = 'hidden'; });
    state.modal = overlay;
    return overlay;
  }

  function step(direction) {
    if (!state.manifest) return;
    var list = state.manifest.eras;
    if (state.current < 0) return;
    open(list[(state.current + direction + list.length) % list.length].id, true);
  }

  function keyboard(event) {
    if (!state.modal || state.modal.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    var editable = event.target.closest('input,textarea,select,[contenteditable="true"]');
    if (!editable && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); return;
    }
    if (event.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(state.modal.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]'))
      .filter(function (n) { return n.getClientRects().length > 0 && getComputedStyle(n).visibility !== 'hidden'; });
    if (!focusable.length) { event.preventDefault(); state.modal.querySelector('.aecm-dialog').focus(); return; }
    var first = focusable[0], last = focusable[focusable.length-1];
    if (event.shiftKey && (document.activeElement === first || !state.modal.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !state.modal.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }

  function close() {
    if (!state.modal || state.modal.hidden) return;
    state.modal.hidden = true;
    state.modal.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('aecm-open');
    document.body.style.overflow = previousBodyOverflow === null ? '' : previousBodyOverflow;
    if (lockWasPresent) document.documentElement.classList.add('aecm-open');
    document.removeEventListener('keydown', keyboard, true);
    state.request++; state.current = -1;
    document.title = originalTitle;
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }

  function appendInline(parent, str) {
    // **Negritas** sin renderizar HTML remoto ni evaluar contenido.
    var fragments = str.split(/(\*\*[^*]+\*\*)/g);
    fragments.forEach(function (part) {
      if (!part) return;
      if (part.slice(0, 2) === '**' && part.slice(-2) === '**') parent.appendChild(node('strong','',part.slice(2,-2)));
      else parent.appendChild(document.createTextNode(part));
    });
  }
  function buildNarrative(text, era) {
    var container = state.modal.querySelector('.aecm-prose');
    var toc = state.modal.querySelector('.aecm-toc');
    container.replaceChildren(); toc.replaceChildren();
    var sections = 0, fragments = [], separators = state.manifest.separadores || [];
    function paragraph() {
      if (!fragments.length) return;
      var block = fragments.join(' ').replace(/\s+/g,' ').trim(); fragments = [];
      if (!block) return;
      var p = node('p','aecm-p');
      if(/^[ᚠ-ᛪ⟡]/u.test(block))p.classList.add('aecm-unknown-script');
      appendInline(p, block);
      container.appendChild(p);
    }
    text.replace(/\r\n?/g,'\n').split('\n').forEach(function (line) {
      var main = /^#\s+(.+)/.exec(line), sec = /^##\s+(.+)/.exec(line),
          sub = /^###\s+(.+)/.exec(line), quote = /^>\s*(.+)/.exec(line);
      if (main) { paragraph();var intro=node('div','aecm-prologue',main[1]);if(/^[ᚠ-ᛪ⟡]/u.test(main[1]))intro.classList.add('aecm-unknown-heading');container.appendChild(intro);return; }
      if (sec) {
        paragraph(); sections++;
        if (sections > 1 && separators.length) {
          var hr = node('div','aecm-ornamental-divider');
          var ornament = node('img'); ornament.src = separators[(sections-2)%separators.length]; ornament.alt = '';
          ornament.loading='lazy'; ornament.decoding='async'; hr.appendChild(ornament);
          container.appendChild(hr);
        }
        var section = node('h3','aecm-section',sec[1]);if(/^[ᚠ-ᛪ⟡]/u.test(sec[1]))section.classList.add('aecm-unknown-heading');section.id='aecm-passage-'+sections;
        container.appendChild(section);
        var jump = node('button','aecm-jump',sec[1]); jump.type='button';
        jump.addEventListener('click',function(){
          var scroller = state.modal.querySelector('.aecm-scroll');
          var top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 17;
          scroller.scrollTo({top:top,behavior:reducedMotion?'auto':'smooth'});
        });
        toc.appendChild(jump); return;
      }
      if (sub) { paragraph(); container.appendChild(node('h4','aecm-subheading',sub[1])); return; }
      if (quote) {
        paragraph(); var blockquote = node('blockquote','aecm-quote'); appendInline(blockquote,quote[1]);
        container.appendChild(blockquote); return;
      }
      if (!line.trim()) paragraph(); else fragments.push(line.trim());
    });
    paragraph();
    var end = node('div','aecm-endmark');
    end.appendChild(node('span','','✦'));
    end.appendChild(node('p',stillSealed(era)?'aecm-ancient-ui':'',displayEra(era,'end')));
    container.appendChild(end);
    state.modal.querySelector('.aecm-scroll').scrollTop = 0;
    updateProgress();
  }

  function updateProgress() {
    if (!state.modal || state.modal.hidden) return;
    var scroll = state.modal.querySelector('.aecm-scroll');
    var max = scroll.scrollHeight - scroll.clientHeight;
    var progress = max > 0 ? 100 * scroll.scrollTop / max : 100;
    state.modal.querySelector('.aecm-progress span').style.width = Math.max(0,Math.min(100,progress))+'%';
  }

  async function getText(era) {
    if (state.cache.has(era.id)) return state.cache.get(era.id);
    var resp = await fetch(era.archivo, { mode: 'cors', credentials: 'omit' });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    var txt = await resp.text();
    if (txt.length < 100 || !txt.includes('## ')) throw new Error('Archivo incompleto');
    state.cache.set(era.id,txt);
    return txt;
  }

  async function open(id, fromNav) {
    var list = state.manifest && state.manifest.eras;
    if (!list) return false;
    var index = list.findIndex(function (e) { return e.id === id; });
    if (index < 0) return false;
    var era = list[index], modal = buildModal();
    if (modal.hidden) {
      state.lastFocus = document.activeElement;
      previousBodyOverflow = document.body.style.overflow;
      lockWasPresent = document.documentElement.classList.contains('aecm-open');
      modal.hidden=false; modal.setAttribute('aria-hidden','false');
      document.documentElement.classList.add('aecm-open');
      document.body.style.overflow='hidden';
      document.addEventListener('keydown', keyboard, true);
    }
    state.current=index;
    var request=++state.request;
    modal.style.setProperty('--aecm-accent',era.color);
    var hero=modal.querySelector('.aecm-hero-image'); hero.style.visibility='visible'; hero.src=era.fondo;
    var emblem=modal.querySelector('.aecm-hero-emblem'); emblem.style.visibility='visible'; emblem.src=era.icono;
    var encrypted=stillSealed(era);
    var library=modal.querySelector('.aecm-library-label');
    var cap=modal.querySelector('.aecm-cap');
    var title=modal.querySelector('#aecm-dialog-title');
    var subtitle=modal.querySelector('.aecm-hero-subtitle');
    library.textContent=displayEra(era,'eyebrow');
    cap.textContent=displayEra(era,'chapter');
    title.textContent=displayEra(era,'title');
    subtitle.textContent=encrypted?displayEra(era,'subtitle'):era.opening;
    [library,cap,title,subtitle].forEach(function(el){el.classList.toggle('aecm-ancient-ui',encrypted);});
    sealStatus(era,modal);
    modal.querySelector('.aecm-rune').src=era.runaUrl;
    modal.querySelector('.aecm-watermark').src=state.manifest.sello;
    var folio=modal.querySelector('.aecm-folio');
    folio.textContent=displayEra(era,'folio');
    folio.classList.toggle('aecm-ancient-ui',encrypted);
    var previousEra=list[(index+list.length-1)%list.length];
    var followingEra=list[(index+1)%list.length];
    var previousButton=modal.querySelector('.aecm-prev');
    var followingButton=modal.querySelector('.aecm-next');
    var previousText=previousButton.querySelector('span');
    var followingText=followingButton.querySelector('span');
    previousText.textContent=displayEra(previousEra,'title');
    followingText.textContent=displayEra(followingEra,'title');
    previousText.classList.toggle('aecm-ancient-ui',stillSealed(previousEra));
    followingText.classList.toggle('aecm-ancient-ui',stillSealed(followingEra));
    previousButton.setAttribute('aria-label',stillSealed(previousEra)?'Abrir era antigua sellada anterior':'Abrir era anterior');
    followingButton.setAttribute('aria-label',stillSealed(followingEra)?'Abrir era antigua sellada siguiente':'Abrir era siguiente');
    var readingLabel=modal.querySelector('.aecm-reading-caption');
    readingLabel.textContent=displayEra(era,'caption');
    readingLabel.classList.toggle('aecm-ancient-ui',encrypted);
    modal.querySelector('.aecm-scroll').scrollTop=0;
    modal.querySelector('.aecm-toc').replaceChildren();
    modal.querySelector('.aecm-prose').replaceChildren(node('p','aecm-loading'+(encrypted?' aecm-ancient-ui':''),displayEra(era,'loading')));
    modal.querySelector('.aecm-close').focus();
    document.title=encrypted?displayEra(era,'title'):era.nombre+' · Crónicas de Aeternalis';
    try {
      var seal=sealFor(era);
      var md=(seal&&seal.revelados.length===0)?null:await getText(era);
      if(request!==state.request)return false;
      buildNarrative(seal?mixedMarkdown(era,seal,md):md,era);
    } catch (error) {
      if (request!==state.request) return false;
      var prose=modal.querySelector('.aecm-prose');
      prose.replaceChildren(node('h3','aecm-section','No se pudo abrir este capítulo'));
      prose.appendChild(node('p','aecm-p','El archivo de GitHub Pages no está disponible. Puedes leer la ficha histórica mientras se restablece.'));
      if(!stillSealed(era)){var link=node('a','aecm-fallback','Abrir crónica anterior');link.href=era.enlace;prose.appendChild(link);}
      console.error('[Aeternalis Cronología] Error leyendo '+id,error);
    }
    return true;
  }

  function fallback(error) {
    console.error('[Aeternalis Cronología] No se pudo iniciar:',error);
    ROOT.setAttribute('data-aec-v3','error');
    if (ROOT.children.length) return; // No ocultar el índice antiguo si existiera.
    var p=node('p','aec-fallback','La cronología está temporalmente disponible en su versión anterior.');
    ROOT.appendChild(p);
    [['Cuarta Era','#97']].forEach(function(e){
      var a=node('a','aec-fallback-link',e[0]);a.href='/t31-02-cronologia'+e[1];ROOT.appendChild(a);
    });
  }


  Promise.all([
    fetch(BASE+'data/cronologia/manifest.json?v=3.2.0',{mode:'cors',credentials:'omit',cache:'no-cache'})
      .then(function(res){if(!res.ok)throw Error('HTTP '+res.status);return res.json();}),
    loadSeals()
  ])
    .then(function(result){
      var data=result[0];
      if(!data||!Array.isArray(data.eras)||data.eras.length!==5)throw Error('Manifiesto incompleto');
      state.manifest=data;state.seals=result[1];
      buildIndex(data);
      window.AeternalisCronologiaV3={open:open,close:close,version:'3.3.0'};
    })
    .catch(fallback);
})();
