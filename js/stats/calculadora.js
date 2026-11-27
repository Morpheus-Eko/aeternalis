/* AETERNALIS · BRÚJULA ARCANA DE ESTADÍSTICAS v1.1 (arranque robusto)
   Pegar SIN etiquetas <script> en Foroactivo → Gestión de códigos JavaScript → En los temas.
   HTML en la publicación: <div class="hidethisprofile"></div><div id="aes-stats"></div>
   CSS separado y alojado en GitHub; no se modifica la skin de Foroactivo.
   No modifica la skin, los estilos de los otros módulos ni la calculadora original de Arlequín.
*/
(function () {
  'use strict';
  const ROOT_ID = 'aes-stats';
  const CSS_URL = 'https://morpheus-eko.github.io/aeternalis/css/stats-brujula.css?v=2.0.0';
  const CSS_STYLE_ID = 'aes-estadisticas-css-v1-inyectado';
  const CSS_SOURCE_ID = 'aes-estadisticas-css-v1-source';
  const BEGIN = '/* AES_STATS_V1_START */';
  const END = '/* AES_STATS_V1_END */';
  const PREFIX = '[Aeternalis/Brújula de Stats]';
  const MAX = 20;
  const BASE = 5;

  // Todos estos IDs corresponden a las imágenes identificadas por el administrador.
  // El host i.imgur.com requiere un archivo directo, no la dirección de página imgur.com/ID.
  // Los PNG prueban extensiones alternativas automáticamente si fuese necesario.
  const ASSETS = Object.freeze({
    "compass": "https://morpheus-eko.github.io/aeternalis/assets/brujula/01-brujula/01-brujula-arcana-base-1200.webp",
    "compassTransparent": "https://morpheus-eko.github.io/aeternalis/assets/brujula/01-brujula/02-brujula-arcana-transparente-1200.webp",
    "paper": "https://morpheus-eko.github.io/aeternalis/assets/brujula/02-paneles/01-panel-resultados-pergamino.webp",
    "title": "https://morpheus-eko.github.io/aeternalis/assets/brujula/03-ornamentos/01-cabecera-codice.webp",
    "divider": "https://morpheus-eko.github.io/aeternalis/assets/brujula/03-ornamentos/02-separador-arcano-fino.webp",
    "crown": "https://morpheus-eko.github.io/aeternalis/assets/brujula/03-ornamentos/03-separador-arcano-ornamental.webp",
    "compassSeal": "https://morpheus-eko.github.io/aeternalis/assets/brujula/03-ornamentos/04-sello-brujula.webp",
    "agi": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/agi-opcional.webp",
    "sig": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/sig-opcional.webp",
    "bow": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/des-opcional.webp",
    "sword": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/fue-opcional.webp",
    "book": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/int-opcional.webp",
    "flame": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/mag-opcional.webp",
    "eye": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/per-opcional.webp",
    "swirl": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/car-opcional.webp",
    "shield": "https://morpheus-eko.github.io/aeternalis/assets/brujula/04-iconos-alternativos/vit-opcional.webp"
});
  const LEGACY_ASSETS = Object.freeze({"compass":"rrNAAhM","compassTransparent":"UnwYcm6","paper":"s4PQ7aS","title":"OyMS3oJ","divider":"IIthKXN","crown":"jgKdWtD","compassSeal":"ezfSD4E","agi":"GhxBswt","sig":"OG5IrCK","bow":"10ZM7wR","sword":"FI2oaFz","book":"o89vTe7","flame":"JhGKMMt","eye":"J3DHfcM","swirl":"uxL97HM","shield":"GIOOPdB"});
  const assetURL = key => ASSETS[key];

  // Ocho atributos exteriores, MAG en el centro. Coordenadas de los huecos de la ilustración.
  // «remolino» queda en CAR; los demás símbolos corresponden a sus nombres.
  const STATS = [
    { key:'FUE', name:'Fuerza',      icon:'sword',  x:50.3, y:17.7 },
    { key:'VIT', name:'Vitalidad',   icon:'shield', x:72.0, y:28.0 },
    { key:'AGI', name:'Agilidad',    icon:'agi',    x:81.0, y:49.0 },
    { key:'DES', name:'Destreza',    icon:'bow',    x:73.0, y:71.5 },
    { key:'SIG', name:'SIG',         icon:'sig',    x:50.5, y:80.5 },
    { key:'PER', name:'Percepción',  icon:'eye',    x:27.5, y:71.0 },
    { key:'CAR', name:'Carisma',     icon:'swirl',  x:21.4, y:49.0 },
    { key:'INT', name:'Inteligencia',icon:'book',   x:28.7, y:27.5 },
    { key:'MAG', name:'Magia',       icon:'flame',  x:50.5, y:49.4 }
  ];
  const KEYS = STATS.map(s => s.key);
  const BONUS = {
    'Humano':      {},
    'Montaraces':  {FUE:15,VIT:10,AGI:10},
    'Amarant':     {AGI:15,VIT:10,FUE:10},
    'Elfos Altos': {MAG:15,INT:10,PER:10},
    'Yūgen':       {PER:15,AGI:10,MAG:10},
    'Sin\'Hair':   {DES:15,MAG:10,AGI:10}
  };
  const BASE_RACIAL = 35;
  const FINAL_POOL = 25;
  const blank = () => Object.fromEntries(KEYS.map(k => [k,0]));
  const esc = txt => String(txt).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state = { name:'',race:'Humano',sex:'Macho',pool:'racial',selected:'FUE',racial:blank(),free:blank(),notice:'' };

  function totals() {
    const usedRacial = KEYS.reduce((sum,k)=>sum+state.racial[k],0);
    const usedFree = KEYS.reduce((sum,k)=>sum+state.free[k],0);
    return { usedRacial, usedFree, remainingRacial:state.race==='Humano' ? BASE_RACIAL-usedRacial : 0, remainingFree:FINAL_POOL-usedFree };
  }
  const bonusFor = key => BONUS[state.race][key] || 0;
  const statValue = key => BASE + bonusFor(key) + state.racial[key] + state.free[key];
  function bonusesDescription() {
    if (state.race==='Humano') return '+35 puntos de libre elección, salvo MAG; además, 25 puntos finales.';
    return Object.entries(BONUS[state.race]).map(([k,v])=>'+'+v+' '+k).join(' · ')+' · 25 puntos finales.';
  }
  const image = (asset, cls, alt) => `<img class="${cls}" src="${assetURL(asset)}" data-aes-asset="${asset}" alt="${esc(alt||'')}" referrerpolicy="no-referrer">`;

  function markup() {
    const nodes = STATS.map(st => {
      const selected = st.key === state.selected ? ' is-selected' : '';
      return `<div class="aes-node${selected}${st.key==='MAG'?' aes-node-mag':''}" data-key="${st.key}" style="--nx:${st.x}%;--ny:${st.y}%;" title="${st.name}">
        <button type="button" class="aes-node-select" data-select="${st.key}" aria-label="Seleccionar ${st.name}">
          ${image(st.icon,'aes-node-icon',st.name)}<span class="aes-node-code">${st.key}</span>
        </button>
        <span class="aes-node-controls"><button type="button" data-adjust="-1" data-stat="${st.key}" aria-label="Restar punto a ${st.name}">−</button><output class="aes-node-value" data-value="${st.key}">5</output><button type="button" data-adjust="1" data-stat="${st.key}" aria-label="Añadir punto a ${st.name}">+</button></span>
      </div>`;
    }).join('');
    const list=STATS.map(st=>`<div class="aes-result-stat"><span>${st.key}</span><strong data-result="${st.key}">5</strong></div>`).join('');
    const races=Object.keys(BONUS).map(r=>`<option value="${esc(r)}"${r===state.race?' selected':''}>${esc(r)}</option>`).join('');
    return `<section class="aes-shell" aria-label="Calculadora de estadísticas de Aeternalis">
      <header class="aes-header"><p class="aes-eyebrow">AETERNALIS · CREACIÓN DE PERSONAJES</p>
        ${image('title','aes-title-art','El Códice de los Nueve Atributos')}<h1 class="aes-title-fallback">El Códice de los Nueve Atributos</h1>
        <p class="aes-lead">Forja los atributos de tu personaje en la brújula arcana. Selecciona una raza y distribuye tus puntos.</p>
        <div class="aes-rules-mini"><span><b>5</b> por atributo</span><span><b>35</b> de bonificación racial</span><span><b>25</b> de libre distribución</span><span><b>20</b> máximo por atributo</span></div>
      </header>
      <div class="aes-workbench">
        <div class="aes-orbit-column"><div class="aes-orbit" aria-label="Brújula de nueve atributos">
          ${image('compass','aes-orbit-art','Brújula arcana ornamental de nueve huecos')}${nodes}
          </div><p class="aes-orbit-caption">Ocho atributos rodean el núcleo arcano de MAG. Pulsa un medallón para modificarlo desde el registro.</p>
          ${image('divider','aes-divider','')}<p class="aes-collab">Instrumento inspirado en la calculadora original de Arlequín para Aeternalis.</p>
        </div>
        <aside class="aes-side">
          <section class="aes-parchment" aria-label="Registro y distribución de puntos">
            ${image('paper','aes-parchment-art','Hoja de pergamino antiguo')}
            <div class="aes-parchment-content">
              <p class="aes-paper-overline">REGISTRO DEL PERSONAJE</p><h2>Acta de atributos</h2>
              <div class="aes-field"><label for="aes-name">Nombre del personaje</label><input id="aes-name" type="text" maxlength="15" minlength="4" autocomplete="off" placeholder="Entre 4 y 15 caracteres" value=""></div>
              <div class="aes-field-row"><div class="aes-field"><label for="aes-race">Raza</label><select id="aes-race">${races}</select></div><div class="aes-field"><label for="aes-sex">Sexo</label><select id="aes-sex"><option>Macho</option><option>Hembra</option><option>Todos los dias</option><option>Ojala</option></select></div></div>
              <p id="aes-bonus" class="aes-race-bonus"></p>
              <div class="aes-pool-tabs" id="aes-pools" aria-label="Tipo de puntos que se están asignando"><button type="button" data-pool="racial" class="is-active">35 raciales</button><button type="button" data-pool="free">25 finales</button></div>
              <div class="aes-pools-readout"><div><small id="aes-remaining-label">BONO HUMANO RESTANTE</small><strong id="aes-remaining">35</strong></div><div><small>FINALES RESTANTES</small><strong id="aes-free-remaining">25</strong></div></div>
              <div class="aes-progress"><span id="aes-progress-fill"></span></div>
              <div class="aes-selected"><div class="aes-selected-head"><span id="aes-selected-label">Fuerza · FUE</span><span id="aes-selected-value">5 / 20</span></div><div class="aes-selected-actions"><button type="button" data-selected-adjust="-1" aria-label="Restar punto al atributo seleccionado">−</button><span id="aes-selected-hint">Selecciona un medallón de la brújula.</span><button type="button" data-selected-adjust="1" aria-label="Sumar punto al atributo seleccionado">+</button></div></div>
              <p class="aes-paper-tip" id="aes-pool-info">Los puntos de bonificación humana no pueden asignarse a MAG.</p>
            </div>
          </section>
          <section class="aes-results" aria-label="Resultado de estadísticas">
            <div class="aes-results-head"><h2>Resultado de la forja</h2>${image('compassSeal','aes-small-seal','')}</div>
            <div class="aes-results-grid">${list}</div>
            <div class="aes-total-line"><span>Total en los nueve atributos</span><strong id="aes-total">45</strong></div>
            <div class="aes-total-line"><span>Puntos adicionales asignados</span><strong id="aes-used">0 / 60</strong></div>
            <div class="aes-status" id="aes-status" role="status" aria-live="polite"></div>
            <div class="aes-actions"><button type="button" id="aes-download">Descargar TXT</button><button type="button" id="aes-copy">Copiar BBCode</button><button type="button" id="aes-reset">Reiniciar</button></div>
          </section>
        </aside>
      </div>
      <div class="aes-footer-notes">${image('crown','aes-footer-ornament','')}
        <details><summary>Reglas de asignación y bonificaciones raciales</summary>
          <p>Cada atributo comienza con <b>5 puntos</b>. Se aplica después la bonificación racial de <b>35 puntos</b> y finalmente se distribuyen <b>25 puntos libres</b>. Durante la creación, ningún atributo puede superar 20.</p>
          <p>Los Humanos distribuyen manualmente 35 puntos raciales entre todos los atributos excepto MAG y, además, 25 puntos finales. Las demás razas reciben automáticamente su bono de 35 y distribuyen solo los 25 puntos finales.</p>
          <p><b>Montaraces:</b> +15 FUE, +10 VIT, +10 AGI. <b>Amarant:</b> +15 AGI, +10 VIT, +10 FUE. <b>Elfos Altos:</b> +15 MAG, +10 INT, +10 PER. <b>Yūgen:</b> +15 PER, +10 AGI, +10 MAG. <b>Sin'Hair:</b> +15 DES, +10 MAG, +10 AGI. <b>Humanos:</b> +35 a libre elección excepto MAG.</p>
          <p>Las estadísticas se descargan como archivo TXT para incorporarlas posteriormente al registro del personaje.</p>
        </details>
        <p>Calculadora original: Arlequín · Rediseño visual e interfaz: Aeternalis.</p>
      </div>
    </section>`;
  }

  function installAssetRecovery(root) {
    root.addEventListener('error', function (event) {
      const el=event.target;
      if (!el || el.tagName!=='IMG' || !el.dataset.aesAsset) return;
      const key=el.dataset.aesAsset;
      if(!el.dataset.aesLegacyAttempted){el.dataset.aesLegacyAttempted='1';el.dataset.aesExtensions='png';el.src='https://i.imgur.com/'+LEGACY_ASSETS[key]+'.png';return;}
      const tested=(el.dataset.aesExtensions||'png').split(',');
      const next=['jpg','jpeg','webp','gif'].find(ext=>!tested.includes(ext));
      if (next) { tested.push(next); el.dataset.aesExtensions=tested.join(','); el.src='https://i.imgur.com/'+LEGACY_ASSETS[key]+'.'+next; return; }
      el.classList.add('aes-image-unavailable');
      el.hidden=true;
      if (key==='title') root.classList.add('aes-no-title-image');
      if (key==='compass') root.classList.add('aes-no-compass-image');
      if (key==='paper') root.classList.add('aes-no-paper-image');
      console.warn(PREFIX, 'Imagen no disponible:',key,ASSETS[key]);
    },true);
  }

  function render(root) {
    const human=state.race==='Humano';
    const t=totals();
    const pool=human ? state.pool : 'free';
    const mainRemaining=human&&pool==='racial'?t.remainingRacial:t.remainingFree;
    root.querySelectorAll('.aes-node').forEach(el=>el.classList.toggle('is-selected',el.dataset.key===state.selected));
    KEYS.forEach(k=>{
      const value=statValue(k);
      root.querySelector('[data-value="'+k+'"]').textContent=value;
      root.querySelector('[data-result="'+k+'"]').textContent=value;
    });
    root.querySelector('#aes-bonus').textContent=bonusesDescription();
    root.querySelector('#aes-pools').hidden=!human;
    root.querySelectorAll('[data-pool]').forEach(btn=>{
      btn.classList.toggle('is-active',btn.dataset.pool===pool);
      btn.setAttribute('aria-pressed',btn.dataset.pool===pool?'true':'false');
    });
    root.querySelector('#aes-remaining-label').textContent=human?'BONO HUMANO RESTANTE':'BONO RACIAL APLICADO';
    root.querySelector('#aes-remaining').textContent=human?t.remainingRacial:BASE_RACIAL;
    root.querySelector('#aes-free-remaining').textContent=t.remainingFree;
    root.querySelector('#aes-progress-fill').style.width=(100-mainRemaining/(human&&pool==='racial'?35:25)*100)+'%';
    root.querySelector('#aes-selected-label').textContent=STATS.find(s=>s.key===state.selected).name+' · '+state.selected;
    root.querySelector('#aes-selected-value').textContent=statValue(state.selected)+' / '+MAX;
    root.querySelector('#aes-selected-hint').textContent=pool==='racial'?'Asignar bonificación racial':'Asignar puntos finales';
    root.querySelector('#aes-pool-info').textContent=human&&pool==='racial'?'Bono humano: 35 puntos que NO pueden asignarse a Magia (MAG).':
      human?'Puntos finales: puedes asignar estos 25 a cualquiera de los nueve atributos.':'Los 35 puntos raciales ya están incluidos. Distribuye únicamente los 25 finales.';
    root.querySelector('#aes-total').textContent=KEYS.reduce((sum,k)=>sum+statValue(k),0);
    root.querySelector('#aes-used').textContent=(t.usedRacial+t.usedFree)+' / '+(human?60:25);
    const isComplete=t.remainingFree===0 && (!human || t.remainingRacial===0);
    const status=root.querySelector('#aes-status');
    status.classList.toggle('is-complete',isComplete);
    status.textContent=state.notice || (isComplete?'¡Distribución completa! Ya puedes descargar la ficha.':'Puntos por distribuir: '+(t.remainingFree+(human?t.remainingRacial:0))+'.');
    root.querySelector('#aes-download').disabled=!isComplete;
    root.querySelector('#aes-copy').disabled=!isComplete;
    // Deshabilita controles que no puedan alterarse en el pool seleccionado.
    root.querySelectorAll('[data-adjust]').forEach(btn=>{
      const key=btn.dataset.stat, delta=Number(btn.dataset.adjust);
      const allocations=pool==='racial'?state.racial:state.free;
      btn.disabled=(delta>0&&(mainRemaining<=0||statValue(key)>=MAX||(pool==='racial'&&key==='MAG'))) || (delta<0&&allocations[key]===0);
    });
    root.querySelectorAll('[data-selected-adjust]').forEach(btn=>{
      const delta=Number(btn.dataset.selectedAdjust),k=state.selected;
      const allocations=pool==='racial'?state.racial:state.free;
      btn.disabled=(delta>0&&(mainRemaining<=0||statValue(k)>=MAX||(pool==='racial'&&k==='MAG'))) || (delta<0&&allocations[k]===0);
    });
  }

  function adjust(root,key,delta) {
    if (!KEYS.includes(key)) return;
    const pool=state.race==='Humano'?state.pool:'free';
    const target=pool==='racial'?state.racial:state.free;
    const t=totals();
    state.selected=key;
    state.notice='';
    if (delta>0) {
      if (pool==='racial'&&key==='MAG') state.notice='La bonificación humana de 35 puntos no puede aplicarse a MAG.';
      else if (statValue(key)>=MAX) state.notice=key+' ya alcanzó el límite de 20 puntos.';
      else if ((pool==='racial'?t.remainingRacial:t.remainingFree)<=0) state.notice='No quedan puntos disponibles en este grupo.';
      else target[key]++;
    } else if (delta<0) {
      if (target[key]>0) target[key]--;
      else state.notice='Este atributo no tiene puntos añadidos en el grupo seleccionado.';
    }
    render(root);
  }

  function buildExport() {
    const lines=['AETERNALIS — ESTADÍSTICAS','Nombre: '+state.name.trim(),'Raza: '+state.race,'Sexo: '+state.sex,'','Stat: Valor'];
    KEYS.forEach(key=>lines.push(key+': '+statValue(key)));
    lines.push('','Total: '+KEYS.reduce((sum,k)=>sum+statValue(k),0),'Bonificación racial: 35','Puntos finales: 25');
    return lines.join('\r\n');
  }
  function buildBBCode() {
    return '[b]Nombre:[/b] '+state.name.trim()+'\n[b]Raza:[/b] '+state.race+'\n[b]Sexo:[/b] '+state.sex+'\n[b]Estadísticas:[/b]\n'+KEYS.map(k=>'[b]'+k+':[/b] '+statValue(k)).join('\n');
  }
  function checkExport(root) {
    const n=state.name.trim();
    const t=totals();
    if(n.length<4||n.length>15){state.notice='El nombre debe tener entre 4 y 15 caracteres.';render(root);root.querySelector('#aes-name').focus();return false;}
    if(t.remainingFree || (state.race==='Humano'&&t.remainingRacial)){state.notice='Debes distribuir todos los puntos antes de exportar.';render(root);return false;}
    return true;
  }
  function download(text,fileName) {
    const blob=new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function reset(root) {
    if (!window.confirm('¿Reiniciar todos los puntos distribuidos? Se conservará el nombre y el sexo.')) return;
    state.racial=blank();state.free=blank();state.selected='FUE';state.pool=state.race==='Humano'?'racial':'free';state.notice='Distribución reiniciada.';render(root);
  }
  function bind(root) {
    installAssetRecovery(root);
    root.addEventListener('click',async ev=>{
      const button=ev.target.closest('button');
      if (!button) {
        const node=ev.target.closest('.aes-node[data-key]');
        if (node && root.contains(node)) {state.selected=node.dataset.key;state.notice='';render(root);}
        return;
      }
      if (!root.contains(button)) return;
      if (button.dataset.select) {state.selected=button.dataset.select;state.notice='';render(root);return;}
      if (button.dataset.adjust) {adjust(root,button.dataset.stat,Number(button.dataset.adjust));return;}
      if (button.dataset.selectedAdjust) {adjust(root,state.selected,Number(button.dataset.selectedAdjust));return;}
      if (button.dataset.pool) {state.pool=button.dataset.pool;state.notice='';render(root);return;}
      if (button.id==='aes-reset') {reset(root);return;}
      if (button.id==='aes-download') {if(checkExport(root))download(buildExport(),'Aeternalis_Stats_'+state.name.trim().replace(/[^a-zA-Z0-9_-]/g,'_')+'.txt');return;}
      if (button.id==='aes-copy'&&checkExport(root)) {
        const txt=buildBBCode();
        try { await navigator.clipboard.writeText(txt);state.notice='BBCode copiado al portapapeles.'; }
        catch(e){const ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');state.notice='BBCode copiado.';}catch(_){state.notice='No se pudo copiar. Utiliza la descarga TXT.';}ta.remove();}
        render(root);return;
      }
    });
    root.querySelector('#aes-name').addEventListener('input',ev=>{state.name=ev.target.value;state.notice='';render(root);});
    root.querySelector('#aes-sex').addEventListener('change',ev=>{state.sex=ev.target.value;state.notice='';render(root);});
    root.querySelector('#aes-race').addEventListener('change',ev=>{
      state.race=ev.target.value;state.racial=blank();state.free=blank();state.pool=state.race==='Humano'?'racial':'free';state.notice='Los valores se han reiniciado al cambiar de raza.';render(root);
    });
  }

  function extractModuleCSS(source) {
    const parsed=new DOMParser().parseFromString(source,'text/html');
    const tagged=parsed.getElementById(CSS_SOURCE_ID);
    const raw=tagged?tagged.textContent:source;
    const a=raw.indexOf(BEGIN),b=raw.indexOf(END,a+BEGIN.length);
    if(a<0||b<0) throw new Error('No encuentro AES_STATS_V1_START/END en la página h4.');
    let css=raw.slice(a+BEGIN.length,b);
    if(/&(?:lt|gt|amp|quot|#39);/.test(css)){const t=document.createElement('textarea');t.innerHTML=css;css=t.value;}
    if(!css.includes('#aes-stats')||css.length<500)throw new Error('El CSS de estadísticas está incompleto.');
    return css;
  }
  // v1.1 - Arranque independiente del orden en que Foroactivo inserte la publicación.
  // Siempre conserva el CSS externo en h4 y NO modifica la skin del foro.
  function findRoot() {
    return document.getElementById(ROOT_ID);
  }

  function userFacingError(root, message, details) {
    root.dataset.aesBoot = 'error';
    root.setAttribute('role', 'alert');
    root.innerHTML = '<div style="max-width:650px;margin:20px auto;padding:16px 20px;'
      + 'border:1px solid #a87b58;background:#1c171e;color:#eed6b2;'
      + 'font:15px/1.6 Georgia,serif;text-align:left">'
      + '<strong style="display:block;margin-bottom:7px;color:#f2c794">'
      + 'La Brújula Arcana no pudo iniciar</strong>'
      + esc(message)
      + '<div style="margin-top:8px;color:#c7aa9a;font-size:12px">'
      + esc(details || '') + '</div></div>';
  }

  function cssInDocument() {
    // Útil cuando la hoja del módulo ya fue incorporada expresamente al documento.
    const existing = document.getElementById(CSS_SOURCE_ID);
    if (!existing) return false;
    const css = extractModuleCSS(existing.textContent);
    if (!document.getElementById(CSS_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = CSS_STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    }
    return true;
  }


  async function ensureStyles() {
    if (document.getElementById(CSS_STYLE_ID)) return;
    // Se carga como stylesheet externo para evitar bloqueos CORS de fetch() desde Foroactivo.
    await new Promise((resolve, reject) => {
      const link=document.createElement('link');
      link.id=CSS_STYLE_ID;
      link.rel='stylesheet';
      link.href=CSS_URL;
      link.onload=resolve;
      link.onerror=()=>{link.remove();reject(new Error('No se pudo cargar el CSS de la Brújula desde GitHub Pages.'));};
      (document.head||document.documentElement).appendChild(link);
    });
  }

  async function begin() {
    const root = findRoot();
    if (!root || root.dataset.aesBoot === '1' || root.dataset.aesBoot === 'pending') return;
    root.dataset.aesBoot = 'pending';
    root.textContent = 'Cargando los estilos actualizados de la Brújula Arcana desde GitHub…';
    try {
      await ensureStyles();
      // El tema puede haberse reemplazado dinámicamente mientras se descargaba h4.
      if (!root.isConnected) {
        console.warn(PREFIX, 'El tema cambió durante la inicialización.');
        return;
      }
      root.innerHTML = markup();
      bind(root);
      render(root);
      root.dataset.aesBoot = '1';
      root.removeAttribute('role');
      console.info(PREFIX, 'Calculadora 2.0 activa; 9 atributos, 6 razas; assets y CSS desde GitHub.');
    } catch (error) {
      const summary = /AES_STATS_V1_START|CSS de estadísticas/.test(String(error.message))
        ? 'No se pudo cargar el CSS de Estadísticas desde GitHub.'
        : /aborted|abort/i.test(String(error.message))
          ? 'La hoja de estilos alojada en GitHub no respondió.'
          : 'No se pudo cargar el CSS o inicializar la calculadora.';
      userFacingError(root, summary,
        'Detalle: ' + (error && error.message ? error.message : String(error))
        + ' · Comprueba la conexión con GitHub Pages y que la gestión de JavaScript esté activada.');
      console.error(PREFIX, error);
    }
  }

  // En Foroactivo algunos scripts se ejecutan antes de que aparezca la publicación.
  // MutationObserver permite iniciar la brújula cuando el HTML mínimo se inserta luego.
  function installBootWatcher() {
    if (window.__AES_STATS_BOOT_WATCHER__) return;
    window.__AES_STATS_BOOT_WATCHER__ = true;
    if (findRoot()) { begin(); return; }
    const target = document.documentElement || document;
    const observer = new MutationObserver(function () {
      if (findRoot()) {
        observer.disconnect();
        begin();
      }
    });
    observer.observe(target, { childList: true, subtree: true });
    // No mantiene un observador permanente en todo el foro.
    setTimeout(function () { observer.disconnect(); }, 45000);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', begin, { once: true });
    }
  }

  installBootWatcher();
})();