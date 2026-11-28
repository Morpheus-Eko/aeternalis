/* AETERNALIS · MAESTRO DE MÓDULOS v1.0
 * Instalación: un único fragmento en Foroactivo, archivo foroactivo/JS_UNICO_MAESTRO_PEGAR.js
 * Los motores, sus estilos y su contenido permanecen separados en GitHub.
 * Activa cada módulo únicamente si su elemento de publicación existe.
 * No crea nuevas reglas ni reescribe los datos del rol.
 */
(function(){
  'use strict';
  if(window.AeternalisMaestro && window.AeternalisMaestro.version)return;
  var BASE='https://morpheus-eko.github.io/aeternalis/';
  var RELEASE='1.1.0';
  var CONFIG_URL=BASE+'data/sistemas/maestro.json';
  var modules=Object.create(null);
  var statuses=Object.create(null);
  var config={release:RELEASE,enabled:{}};
  var ready=false,queued=false;
  var qs=window.location.search||'';
  var options=new URLSearchParams(qs);
  var hasEditor=['cartografo','dibujar','caminos'].some(function(k){return options.get(k)==='1';});
  var logPrefix='[Aeternalis/Maestro]';
  var doc=document;

  function url(path,revision){return BASE+path+'?v='+encodeURIComponent(revision||config.release||RELEASE);}
  function enabled(key){return config.enabled[key]!==false;}
  function hasRoot(css){return !!doc.querySelector(css);}
  function status(name,value,detail){
    statuses[name]={state:value,detail:detail||'',at:new Date().toISOString()};
    if(value==='error')console.error(logPrefix,name,detail);
  }
  function loadAsset(kind,path,id,version){
    if(doc.getElementById(id))return Promise.resolve();
    return new Promise(function(resolve,reject){
      var el=doc.createElement(kind==='css'?'link':'script');
      el.id=id;
      if(kind==='css'){el.rel='stylesheet';el.href=url(path,version);}
      else {el.src=url(path,version);el.async=true;}
      el.onload=function(){resolve();};
      el.onerror=function(){el.remove();reject(new Error('No se pudo cargar '+path));};
      (doc.head||doc.documentElement).appendChild(el);
    });
  }
  function css(path,id,version){return loadAsset('css',path,id,version);}
  function js(path,id,version){return loadAsset('js',path,id,version);}
  function withStyles(stylePath,styleId,enginePath,engineId,revision){
    return css(stylePath,styleId,revision).then(function(){return js(enginePath,engineId,revision);});
  }
  function run(name){
    var m=modules[name];
    if(!ready||!m||!enabled(name)||statuses[name]||!hasRoot(m.root))return;
    if(name==='cartografo'&&!hasEditor)return;
    if(m.guard&&m.guard()){status(name,'existing','Se detectó una versión cargada previamente; evita duplicarla.');return;}
    status(name,'loading');
    Promise.resolve().then(m.start).then(function(){status(name,'loaded');}).catch(function(e){status(name,'error',String(e&&e.message||e));});
  }
  function waitUntil(test,ms){
    return new Promise(function(resolve,reject){
      var started=Date.now();
      function check(){
        var answer;try{answer=test();}catch(e){reject(e);return;}
        if(answer){resolve(answer);return;}
        if(Date.now()-started>ms){reject(new Error('El Supermapa no terminó de iniciar dentro del límite de espera.'));return;}
        setTimeout(check,350);
      }
      check();
    });
  }

  modules.atlas={
    root:'#aeternalis-atlas',
    guard:function(){return !!window.__AETERNALIS_EXTERNAL_LOADING__||!!window.__AE_ATLAS_LEAFLET_DEBUG__||!!doc.querySelector('#aeternalis-atlas[data-ae-leaf-ready="1"]');},
    start:function(){return js('foroactivo/SUPERMAPA_CARGADOR_PARA_FOROACTIVO.js','ae-master-atlas-loader','1.1.0');}
  };
  modules.bestiario={
    root:'#aeb-bestiary',
    guard:function(){return !!window.__AEB_BESTIARY_GITHUB_LOADING__||!!window.__AEB_BESTIARY_ENGINE_GITHUB_V2__||!!window.__AEB_BESTIARY_ENGINE_V11__;},
    start:function(){return js('foroactivo/JS_UNICO_CARGADOR_BESTIARIO.js','ae-master-bestiario-loader','2.1.0');}
  };
  // Gabinete patológico de Aeternalis. No depende del Atlas, Astillero ni Bestiario.
  // Sólo carga CSS/JS cuando una publicación incluye #ae-pestilencias.
  modules.pestilencias={
    root:'#ae-pestilencias',
    guard:function(){var r=doc.getElementById('ae-pestilencias');return !!window.AeternalisCodicePestilencias||!!(r&&r.dataset.aepBoot);},
    start:function(){return withStyles('css/pestilencias.css','ae-pestilencias-css-v1','js/pestilencias/visor.js','ae-pestilencias-js-v1','1.5.0');}
  };
  // Ambientación: entrada del foro, una sola lámina narrada por Ozma en la taberna.
  // Se instala solo cuando el mensaje contiene #ae-prologo-ozma. No afecta otros temas.
  modules.prologoOzma={
    root:'#ae-prologo-ozma',
    guard:function(){var r=doc.getElementById('ae-prologo-ozma');return !!window.AeternalisPrologoOzma||!!(r&&r.dataset.aoBoot==='ready');},
    start:function(){return withStyles('css/prologo-ozma.css','ae-prologo-ozma-css-v10','js/prologo-ozma/visor.js','ae-prologo-ozma-js-v10','1.0.0');}
  };
  // Tomo de Medicina: atlas anatómico, herbario, pestilencias integradas y calculadoras, solo con #ae-codice-salud.
  // No modifica el viejo módulo de pestilencias ni carga assets en otras páginas.
  modules.salud={
    root:'#ae-codice-salud',
    guard:function(){var r=doc.getElementById('ae-codice-salud');return !!window.AeternalisCodiceSalud||!!(r&&r.dataset.acsBoot);},
    start:function(){return withStyles('css/codice-salud.css','ae-codice-salud-css-v37','js/codice-salud/visor.js','ae-codice-salud-js-v37','3.7.0');}
  };
  modules.cronologia={
    root:'#aec-cronologia',
    guard:function(){return !!window.AeternalisCronologiaV3||!!doc.getElementById('aec-cronologia-v3-js');},
    start:function(){return withStyles('css/cronologia-v3.css','aec-cronologia-v3-css','js/cronologia/visor.js','aec-cronologia-v3-js','3.1.0');}
  };
  modules.razas={
    root:'#ae-races-codex',
    guard:function(){return !!window.AeternalisRazasVisorV2||!!doc.getElementById('ae-races-visor-js');},
    start:function(){return withStyles('css/razas-modal.css','ae-races-visor-css','js/razas/visor.js','ae-races-visor-js','2.1.0');}
  };
  modules.astillero={
    root:'#ae-astillero',
    guard:function(){var r=doc.querySelector('#ae-astillero');return !!window.AeternalisAstillero||!!(r&&r.dataset.aeAstillero)||!!doc.getElementById('ae-astillero-js-v1');},
    start:function(){return withStyles('css/astillero.css','ae-astillero-css-v1','js/astillero/visor.js','ae-astillero-js-v1','1.2.0');}
  };
  modules.cartaNaval={
    root:'#ae-carta-naval',
    guard:function(){var r=doc.querySelector('#ae-carta-naval');return !!window.AeternalisCartaNaval||!!(r&&r.dataset.aeCarta)||!!doc.getElementById('ae-carta-naval-js-v1');},
    start:function(){return withStyles('css/carta-naval.css','ae-carta-naval-css-v1','js/astillero/carta-naval.js','ae-carta-naval-js-v1','1.1.0');}
  };
  modules.calculadora={
    root:'#aes-stats',
    guard:function(){var r=doc.querySelector('#aes-stats');return !!(r&&r.dataset.aesBoot)||!!doc.getElementById('ae-gh-stats-calculadora');},
    start:function(){return js('js/stats/calculadora.js','ae-gh-stats-calculadora','2.0.0');}
  };
  modules.monturas={
    root:'#am-app',
    guard:function(){var r=doc.querySelector('#am-app');return !!(r&&r.dataset.amV3Started)||!!doc.getElementById('ae-gh-monturas-libro');},
    start:function(){return js('js/monturas/libro.js','ae-gh-monturas-libro','3.4.0');}
  };
  modules.grimorio={
    root:'#aeg-stats-grimoire',
    start:function(){return css('css/stats-grimorio.css','aeg-stats-grimorio-v20','2.0.0');}
  };
  modules.magia={
    root:'#aem-magic-codex',
    start:function(){return css('css/magia-codice.css','aem-magic-codex-styles-v20','2.0.0');}
  };
  modules.progresion={
    root:'#aep-progress-book',
    start:function(){return css('css/progresion-libro.css','aep-progresion-styles-v11','1.1.0');}
  };
  // Las extensiones del mapa esperan su API Leaflet real. No son JS globales ni obligatorios.
  modules.navalAtlas={
    root:'#aeternalis-atlas',
    guard:function(){return !!window.__AETERNALIS_SUPERMAPA_NAVAL__||!!doc.getElementById('ae-supermapa-naval-js');},
    start:function(){return waitUntil(function(){return window.__AE_ATLAS_LEAFLET_DEBUG__&&window.__AE_ATLAS_LEAFLET_DEBUG__.map&&window.L;},90000)
      .then(function(){return withStyles('css/supermapa-naval.css','ae-supermapa-naval-css','js/supermapa-naval.js','ae-supermapa-naval-js','3.4.2');});}
  };
  modules.cartografo={
    root:'#aeternalis-atlas',
    guard:function(){return !!window.__AETERNALIS_CAMINOS_INSTALLER_V13__||!!doc.getElementById('ae-master-editor-loader');},
    start:function(){return waitUntil(function(){var d=window.__AE_ATLAS_LEAFLET_DEBUG__;return d&&d.map&&typeof d.getEdges==='function'&&window.L;},90000)
      .then(function(){return js('foroactivo/JS_INSTALAR_TRAZADOR_CAMINOS.js','ae-master-editor-loader','1.3.0');});}
  };

  function scan(){
    if(!ready)return;
    Object.keys(modules).forEach(run);
  }
  function schedule(){
    if(queued)return;
    queued=true;
    setTimeout(function(){queued=false;scan();},110);
  }
  function configure(data){
    if(data&&data.schema==='aeternalis-maestro-v1'){
      config.release=String(data.release||RELEASE);
      var next=data.modules||{};
      Object.keys(modules).forEach(function(name){if(Object.prototype.hasOwnProperty.call(next,name))config.enabled[name]=next[name]!==false;});
    }
    // La configuración opcional en la página tiene precedencia sobre GitHub.
    var local=window.AETERNALIS_MAESTRO_CONFIG;
    if(local&&local.modules){Object.keys(modules).forEach(function(name){if(Object.prototype.hasOwnProperty.call(local.modules,name))config.enabled[name]=local.modules[name]!==false;});}
    ready=true;scan();
    console.info(logPrefix,'v'+RELEASE,'activo; módulos disponibles:',Object.keys(modules).length);
  }
  window.AeternalisMaestro={
    version:RELEASE,
    scan:scan,
    getStatus:function(){return JSON.parse(JSON.stringify(statuses));},
    getModules:function(){return Object.keys(modules).map(function(k){return {name:k,selector:modules[k].root,enabled:enabled(k),state:statuses[k]?statuses[k].state:'waiting'};});}
  };
  var observer=new MutationObserver(schedule);
  function begin(){
    observer.observe(doc.documentElement,{childList:true,subtree:true});
    fetch(CONFIG_URL,{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
      .then(configure).catch(function(e){console.warn(logPrefix,'No se pudo leer maestro.json; cargando módulos predeterminados.',e);configure(null);});
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',begin,{once:true});else begin();
})();
