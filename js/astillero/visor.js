/* AETERNALIS · Astillero 1.1 · Simulador de mejoras sin persistencia.
   CSS en css/astillero.css. Reglamento: data/astillero/reglas.json.
   NO realiza compras ni modifica personajes, temas o cuentas. */
(function () {
  'use strict';
  var BASE = 'https://morpheus-eko.github.io/aeternalis/';
  var ROOT = document.getElementById('ae-astillero');
  if (!ROOT || ROOT.getAttribute('data-ae-astillero')) return;
  ROOT.setAttribute('data-ae-astillero', 'loading');

  var state = {
    rules: null, ships: null, ship: 'nordico', focus: 'velas', hexes: 1,
    levels: {velas: 1, resistencia: 1, tripulacion: 1, ataque: 1},
    discount: {velas: false, resistencia: false, tripulacion: false, ataque: false},
    event: {velas: false, resistencia: false, tripulacion: false, ataque: false},
    history: [], expenditure: 0, notice: ''
  };
  var ASSET = function (path) { return BASE + path; };
  var levels = ['I', 'II', 'III', 'Legendario'];
  var money = function (n) { return Number(n).toLocaleString('es-CL') + ' oro'; };
  function elem(tag, cls, content) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (content !== undefined && content !== null) n.textContent = content;
    return n;
  }
  function findCategory(id) { return state.rules.categories.find(function (x) { return x.id === id; }); }
  function findShip(id) { return state.ships.ships.find(function (x) { return x.id === id; }); }
  function img(path, cls, alt) {
    var a = elem('img', cls);
    a.src = ASSET(path); a.alt = alt || '';
    a.loading = 'lazy'; a.decoding = 'async';
    a.addEventListener('error', function () { a.style.visibility = 'hidden'; });
    return a;
  }
  function btn(label, action, value, cls) {
    var a = elem('button', cls || '', label);
    a.type = 'button'; a.dataset.action = action;
    if (value !== undefined) a.dataset.value = value;
    return a;
  }
  function formatRequirement(r) {
    var name = findCategory(r.category);
    return (name ? name.name : r.category) + ' nivel ' + (levels[r.min - 1] || r.min);
  }
  function assess(id) {
    var cat = findCategory(id), current = state.levels[id], next = cat.levels[current];
    if (!next) return {ok:false, reasons:['Mejora máxima alcanzada.'], cost:0, next:null};
    var problems = [];
    (next.requirements || []).forEach(function (r) {
      if ((state.levels[r.category] || 1) < r.min) problems.push('Requiere ' + formatRequirement(r) + '.');
    });
    var sails = id === 'velas' ? current + 1 : state.levels.velas;
    var hull = id === 'resistencia' ? current + 1 : state.levels.resistencia;
    if (sails === 3 && hull === 3) problems.push('Velas III y Resistencia III son incompatibles. Una de las dos debe ser legendaria.');
    if (current + 1 === 4 && !state.event[id]) problems.push('Debes marcar la autorización del evento especial (solo simulación).');
    var price = next.cost === null ? null : (state.discount[id] && next.discountCost !== undefined ? next.discountCost : next.cost);
    return {ok:!problems.length, reasons:problems, cost:price, next:next};
  }
  function main() {
    ROOT.replaceChildren();
    var page = elem('div','ae-na-page');
    var head = elem('header','ae-na-head');
    head.appendChild(img('assets/naval/navegacion/brujula_estrella_dorada.webp','ae-na-compass',''));
    head.appendChild(elem('span','ae-na-overline','REGISTRO NAVAL · AETERNALIS'));
    head.appendChild(elem('h2','ae-na-title','El Almirantazgo'));
    head.appendChild(elem('p','ae-na-lead','Un astillero para explorar navíos, inversiones y límites de la navegación.'));
    head.appendChild(elem('p','ae-na-demo','SIMULADOR DE PRUEBA · No ejecuta compras ni guarda cambios'));
    page.appendChild(head);

    var fleetPicker = elem('div','ae-na-fleet-picker');
    fleetPicker.setAttribute('role','group'); fleetPicker.setAttribute('aria-label','Apariencia de la embarcación');
    state.ships.ships.forEach(function (s) {
      var choice = btn('', 'ship', s.id, 'ae-na-ship-choice' + (state.ship === s.id ? ' is-selected':''));
      choice.setAttribute('aria-pressed', String(state.ship === s.id));
      choice.appendChild(img(s.emblem,'ae-na-ship-choice-icon',''));
      choice.appendChild(elem('span','',s.label));
      fleetPicker.appendChild(choice);
    });
    page.appendChild(fleetPicker);

    var ship = findShip(state.ship);
    page.style.setProperty('--ae-na-accent',ship.accent);
    var hero = elem('section','ae-na-hero');
    var shipPanel = elem('div','ae-na-illustration' + (ship.imageMode === 'scene' ? ' is-scene' : ' is-sprite'));
    shipPanel.appendChild(elem('div','ae-na-sea'));
    shipPanel.appendChild(img(ship.image,'ae-na-vessel',ship.name));
    var figureNote = elem('span','ae-na-figure-note','ILUSTRACIÓN DE CATÁLOGO · No representa modificaciones físicas automáticas');
    shipPanel.appendChild(figureNote);
    hero.appendChild(shipPanel);
    var shipInfo = elem('div','ae-na-ship-info');
    shipInfo.appendChild(img(ship.emblem,'ae-na-crest',''));
    shipInfo.appendChild(elem('div','ae-na-kicker','FICHA DE EMBARCACIÓN · CLASE VISUAL'));
    shipInfo.appendChild(elem('h3','ae-na-ship-name',ship.name));
    shipInfo.appendChild(elem('p','ae-na-ship-sub',ship.subtitle));
    var meta = elem('dl','ae-na-meta');
    [['Velocidad de navegación', state.rules.categories[0].levels[state.levels.velas-1].hoursPerHex + ' h / hexágono'],
     ['Barcos adicionales',String(state.rules.categories[2].levels[state.levels.tripulacion-1].fleetAdditional)],
     ['Inversión simulada',money(state.expenditure)]].forEach(function (x) {
       var row = elem('div','ae-na-meta-row');row.appendChild(elem('dt','',x[0]));row.appendChild(elem('dd','',x[1]));meta.appendChild(row);
     });
    shipInfo.appendChild(meta);
    shipInfo.appendChild(elem('p','ae-na-hint','El diseño cultural es ornamental. No otorga bonificaciones raciales, navales ni mecánicas.'));
    var nauticalLink = elem('a','ae-na-carta-link','Explorar Carta Náutica ↗');
    nauticalLink.href = document.getElementById('ae-carta-naval') ? '#ae-carta-naval' : BASE + 'carta-naval-preview.html';
    shipInfo.appendChild(nauticalLink);
    hero.appendChild(shipInfo);
    page.appendChild(hero);

    var section = elem('section','ae-na-levels');
    section.appendChild(elem('h3','ae-na-section-title','Los cuatro oficios del navío'));
    section.appendChild(elem('p','ae-na-section-sub','Selecciona una rama para consultar sus costes y requisitos.'));
    var tracks = elem('div','ae-na-tracks');
    state.rules.categories.forEach(function (cat) {
      var active = state.focus === cat.id;
      var item = btn('','focus',cat.id,'ae-na-track' + (active ? ' is-active' : ''));
      item.setAttribute('aria-pressed',String(active));
      item.appendChild(img(cat.icon,'ae-na-track-symbol',''));
      var text = elem('div','ae-na-track-text');
      text.appendChild(elem('strong','',cat.name));
      text.appendChild(elem('span','',cat.summary));
      item.appendChild(text);
      item.appendChild(elem('span','ae-na-track-level',levels[state.levels[cat.id]-1]));
      tracks.appendChild(item);
    });
    section.appendChild(tracks);page.appendChild(section);

    var cat = findCategory(state.focus), level = state.levels[cat.id], evaluation = assess(cat.id);
    var inspector = elem('section','ae-na-inspector');
    var titleArea = elem('div','ae-na-inspector-head');
    titleArea.appendChild(elem('span','ae-na-kicker','MAESTRANZA · MEJORAS'));
    titleArea.appendChild(elem('h3','',cat.name));
    titleArea.appendChild(elem('p','',cat.description));
    inspector.appendChild(titleArea);
    var medals = elem('div','ae-na-medals');
    cat.levels.forEach(function (lv) {
      var med = elem('div','ae-na-medal' + (lv.level<=level?' is-owned':'') + (lv.level===level?' is-current':''));
      med.appendChild(img('assets/naval/progresion/mejora_'+(cat.id==='ataque'?'ataque':cat.id)+'_'+(lv.level===4?'legendario':'nivel_'+lv.level)+'.webp','',''));
      med.appendChild(elem('span','',levels[lv.level-1]));
      medals.appendChild(med);
    });
    inspector.appendChild(medals);
    var detail = elem('div','ae-na-upgrade-detail');
    var present = cat.levels[level-1];
    var presentBlock = elem('div','ae-na-present');
    presentBlock.appendChild(elem('div','ae-na-detail-label','CONFIGURACIÓN ACTUAL'));
    presentBlock.appendChild(elem('strong','ae-na-level-heading','Nivel '+levels[level-1]));
    presentBlock.appendChild(elem('p','',present.description));
    detail.appendChild(presentBlock);
    if (evaluation.next) {
      var next = evaluation.next, nextBlock = elem('div','ae-na-next');
      nextBlock.appendChild(elem('div','ae-na-detail-label','SIGUIENTE MEJORA'));
      nextBlock.appendChild(elem('strong','ae-na-level-heading','Nivel '+levels[level]));
      nextBlock.appendChild(elem('p','',next.description));
      var cost = elem('div','ae-na-cost');
      cost.appendChild(elem('span','',next.cost === null ? 'Obtención mediante evento' : 'Coste estimado'));
      cost.appendChild(elem('strong','',next.cost === null ? 'Evento especial' : money(evaluation.cost)));
      nextBlock.appendChild(cost);
      if (next.discount) {
        var discount = elem('label','ae-na-choice');
        var check = elem('input',''); check.type='checkbox';check.dataset.action='discount';check.checked=state.discount[cat.id];
        discount.appendChild(check);
        discount.appendChild(elem('span','','Simular descuento a '+money(next.discountCost)+' (requiere acreditación administrativa)'));
        nextBlock.appendChild(discount);
        nextBlock.appendChild(elem('p','ae-na-rule-hint','Requisito narrativo: '+next.discount));
      }
      if (next.event) {
        nextBlock.appendChild(elem('p','ae-na-event','Evento requerido: '+next.event));
        var approval = elem('label','ae-na-choice');
        var checkEvent = elem('input','');checkEvent.type='checkbox';checkEvent.dataset.action='event';checkEvent.checked=state.event[cat.id];
        approval.appendChild(checkEvent);approval.appendChild(elem('span','','Simular autorización administrativa del evento'));
        nextBlock.appendChild(approval);
      }
      if (evaluation.reasons.length) {
        var blockers = elem('ul','ae-na-blockers');
        evaluation.reasons.forEach(function (x){blockers.appendChild(elem('li','',x));});
        nextBlock.appendChild(blockers);
      } else {
        nextBlock.appendChild(elem('p','ae-na-ok','Requisitos mecánicos satisfechos en esta simulación.'));
      }
      var go = btn('Aplicar mejora al simulador','upgrade',cat.id,'ae-na-primary');
      go.disabled = !evaluation.ok;
      nextBlock.appendChild(go);
      detail.appendChild(nextBlock);
    } else {
      var top = elem('div','ae-na-next');
      top.appendChild(elem('strong','ae-na-level-heading','Rama completada'));
      top.appendChild(elem('p','','Se ha alcanzado el nivel legendario en este simulador.'));
      detail.appendChild(top);
    }
    inspector.appendChild(detail);
    var controls=elem('div','ae-na-actions');
    var back=btn('Deshacer última mejora','undo','','ae-na-secondary');back.disabled=!state.history.length;controls.appendChild(back);
    controls.appendChild(btn('Reiniciar simulación','reset','','ae-na-secondary'));
    inspector.appendChild(controls);
    page.appendChild(inspector);

    var travel = elem('aside','ae-na-travel');
    travel.appendChild(img('assets/naval/navegacion/brujula_mareas.webp','ae-na-travel-mark',''));
    var travelContent=elem('div','ae-na-travel-main');
    travelContent.appendChild(elem('span','ae-na-kicker','BITÁCORA · CÁLCULO TEÓRICO'));
    travelContent.appendChild(elem('h3','','Tiempo de travesía'));
    var sliderLabel=elem('label','ae-na-slider-label','Distancia hipotética: '+state.hexes+' hexágono'+(state.hexes===1?'':'s'));
    var slider=elem('input','ae-na-range');slider.type='range';slider.min='1';slider.max='20';slider.step='1';slider.value=String(state.hexes);slider.dataset.action='hexes';slider.setAttribute('aria-label','Distancia marítima hipotética en hexágonos');
    travelContent.appendChild(sliderLabel);travelContent.appendChild(slider);
    var hours = state.hexes * state.rules.categories[0].levels[state.levels.velas-1].hoursPerHex;
    travelContent.appendChild(elem('strong','ae-na-travel-time',hours+' horas · '+(hours/24).toLocaleString('es-CL',{maximumFractionDigits:2})+' días'));
    travelContent.appendChild(elem('p','ae-na-hint','Cálculo de distancia hipotética; no representa ninguna ruta del Supermapa. Los mares peligrosos y restricciones se implementarán en la Carta Náutica.'));
    travel.appendChild(travelContent);page.appendChild(travel);

    var footer=elem('footer','ae-na-footer');
    footer.appendChild(elem('p','','Barco básico: 50 oro off-rol, salvo posesión justificada por historia y aprobada por administración.'));
    footer.appendChild(elem('p','','Las mejoras legendarias requieren eventos; sus costes no están fijados en el documento. Los nombres LXXXXX, VXXXXXXX y AXXXXXXX son provisionales.'));
    footer.appendChild(elem('p','','La simulación no guarda datos. Al recargar la página se restablecen todas las mejoras.'));
    page.appendChild(footer);
    if(state.notice){var status=elem('p','ae-na-status',state.notice);status.setAttribute('role','status');page.appendChild(status);}
    ROOT.appendChild(page);
    ROOT.setAttribute('data-ae-astillero','ready');
    if(window.AeternalisAstillero && typeof CustomEvent !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('aeternalis:astillero-change',{detail:window.AeternalisAstillero.getState()}));
    }
  }
  function refresh(action, value) {
    main();
    if (action) {
      var el = ROOT.querySelector('[data-action="'+action+'"]'+(value!==undefined?'[data-value="'+value+'"]':''));
      if (el && !el.disabled) el.focus({preventScroll:true});
    }
  }
  ROOT.addEventListener('click',function (ev) {
    var b = ev.target.closest('button[data-action]');
    if (!b || !ROOT.contains(b)) return;
    var a=b.dataset.action,v=b.dataset.value;
    if(a==='ship'){state.ship=v;state.notice='';refresh('ship',v);return;}
    if(a==='focus'){state.focus=v;state.notice='';refresh('focus',v);return;}
    if(a==='undo'){
      var previous=state.history.pop();
      if (previous){state.levels=previous.levels;state.expenditure=previous.expenditure;state.notice='Última mejora simulada deshecha.';}
      refresh('undo');return;
    }
    if(a==='reset'){
      state.levels={velas:1,resistencia:1,tripulacion:1,ataque:1};state.expenditure=0;state.history=[];
      state.discount={velas:false,resistencia:false,tripulacion:false,ataque:false};
      state.event={velas:false,resistencia:false,tripulacion:false,ataque:false};
      state.notice='Simulación reiniciada.';refresh('reset');return;
    }
    if(a==='upgrade'){
      var check=assess(v);
      if(!check.ok){state.notice='No es posible aplicar la mejora: '+check.reasons.join(' ');refresh();return;}
      state.history.push({levels:Object.assign({},state.levels),expenditure:state.expenditure});
      state.levels[v]++;
      if(check.cost!==null)state.expenditure+=check.cost;
      state.notice='Mejora aplicada solo a la simulación. No es una compra ni una aprobación.';
      refresh();return;
    }
  });
  ROOT.addEventListener('change',function(ev){
    var t=ev.target,a=t.dataset.action;
    if(a==='discount'){state.discount[state.focus]=Boolean(t.checked);state.notice='Descuento hipotético: la administración debe verificar los temas.';refresh();}
    if(a==='event'){state.event[state.focus]=Boolean(t.checked);state.notice='Autorización de evento únicamente hipotética.';refresh();}
  });
  ROOT.addEventListener('input',function(ev){
    if(ev.target.dataset.action==='hexes'){
      state.hexes=Math.max(1,Math.min(20,Number(ev.target.value)||1));
      var hours=state.hexes*state.rules.categories[0].levels[state.levels.velas-1].hoursPerHex;
      var label=ROOT.querySelector('.ae-na-slider-label');
      var result=ROOT.querySelector('.ae-na-travel-time');
      if(label)label.textContent='Distancia hipotética: '+state.hexes+' hexágono'+(state.hexes===1?'':'s');
      if(result)result.textContent=hours+' horas · '+(hours/24).toLocaleString('es-CL',{maximumFractionDigits:2})+' días';
    }
  });

  function load(path){return fetch(ASSET(path)+'?v=1.1.0',{mode:'cors',credentials:'omit'}).then(function(r){if(!r.ok)throw Error(path+': HTTP '+r.status);return r.json();});}
  Promise.all([load('data/astillero/reglas.json'),load('data/astillero/navios.json')])
    .then(function(all){
      if(all[0].schema!=='aeternalis-astillero-reglas-v1'||all[1].schema!=='aeternalis-astillero-navios-v1')throw Error('Esquema incompatible');
      if(all[0].categories.length!==4||all[1].ships.length!==8)throw Error('Catálogos incompletos');
      state.rules=all[0];state.ships=all[1];
      window.AeternalisAstillero={
        version:'1.1.0',
        getState:function(){return {ship:state.ship,levels:Object.assign({},state.levels),hoursPerHex:state.rules.categories[0].levels[state.levels.velas-1].hoursPerHex};},
        reset:function(){var b=ROOT.querySelector('[data-action="reset"]');if(b)b.click();}
      };
      main();
    })
    .catch(function(e){
      ROOT.setAttribute('data-ae-astillero','error');
      ROOT.replaceChildren();
      ROOT.appendChild(elem('p','ae-na-load-error','No se pudo cargar el Astillero de Aeternalis. '+e.message));
      console.error('[Aeternalis Astillero]',e);
    });
})();