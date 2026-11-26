/* AETERNALIS · Carta Náutica v1.1
 * Coordenadas vinculadas al Atlas, sin reutilizar caminos terrestres.
 * Editor de recorridos por puntos y recuento manual de hexágonos.
 * JS independiente, CSS en css/carta-naval.css. */
(function () {
  'use strict';
  var ROOT=document.getElementById('ae-carta-naval');
  if (!ROOT || ROOT.getAttribute('data-ae-carta')) return;
  ROOT.setAttribute('data-ae-carta','loading');
  var BASE='https://morpheus-eko.github.io/aeternalis/';
  var SVG_NS='http://www.w3.org/2000/svg';
  var state={
    cfg:null,atlas:null,ports:[],mapWidth:2048,mapHeight:1571,
    from:'',to:'',sails:1,synced:false,hexes:'',showGrid:false,
    draft:false,drawMode:false,waypoints:[],notice:''
  };
  var HRS=[24,18,12,8],gridData='';
  function el(tag,cls,txt) {
    var x=document.createElement(tag);
    if(cls)x.className=cls;
    if(txt!==undefined)x.textContent=txt;
    return x;
  }
  function img(path,cls,alt){
    var i=el('img',cls);i.src=BASE+path;i.alt=alt||'';i.loading='lazy';i.decoding='async';return i;
  }
  function button(txt,action,cls,value){
    var b=el('button',cls,txt);b.type='button';b.dataset.action=action;if(value!==undefined)b.dataset.value=String(value);return b;
  }
  function option(value,label){var o=el('option','',label);o.value=value;return o;}
  function findPort(id){return state.ports.find(function(p){return p.id===id;})||null;}
  function hours(){return HRS[state.sails-1];}
  function json(path){return fetch(BASE+path+'?v=1.1.0',{mode:'cors',credentials:'omit'}).then(function(r){if(!r.ok)throw Error(path+' HTTP '+r.status);return r.json();});}
  function clearPath(){state.waypoints=[];state.draft=false;state.drawMode=false;}
  function choose(id,role) {
    var port=findPort(id);
    if(id && (!port || !port.endpoint)){state.notice='Selecciona un puerto o bahía para iniciar tu recorrido.';render();return;}
    if(role==='from') {
      state.from=id;
      if(id && id===state.to)state.to='';
    } else {
      state.to=id;
      if(id && id===state.from)state.from='';
    }
    clearPath();
    state.notice='';
    render();
  }
  function portLabel(p){return p.name+' · '+(p.role==='faro'?'Faro':p.role==='bahia'?'Bahía':p.role==='astillero'?'Astillero':p.role==='costa'?'Costa':'Puerto');}
  function gridPath(){
    if(gridData)return gridData;
    var W=state.mapWidth,H=state.mapHeight,r=62,dx=Math.sqrt(3)*r,dy=1.5*r,parts=[];
    for(var row=-1;row<H/dy+1;row++){
      for(var col=-1;col<W/dx+1;col++){
        var cx=col*dx+(row%2?dx/2:0),cy=row*dy;
        var pts=[];
        for(var side=0;side<6;side++){
          var theta=Math.PI/180*(60*side-30);
          pts.push([(cx+r*Math.cos(theta)).toFixed(1),(cy+r*Math.sin(theta)).toFixed(1)]);
        }
        parts.push('M'+pts.map(function(x){return x.join(',');}).join('L')+'Z');
      }
    }
    gridData=parts.join('');return gridData;
  }
  function svgElement(tag,cls){
    var x=document.createElementNS(SVG_NS,tag);
    if(cls)x.setAttribute('class',cls);return x;
  }
  function svgOverlay(){
    var s=svgElement('svg','ae-cn-overlay');
    s.setAttribute('viewBox','0 0 '+state.mapWidth+' '+state.mapHeight);
    s.setAttribute('preserveAspectRatio','none');
    s.setAttribute('aria-hidden','true');
    if(state.showGrid){
      var grid=svgElement('path','ae-cn-grid');
      grid.setAttribute('d',gridPath());s.appendChild(grid);
    }
    if(state.draft&&state.from&&state.to){
      var a=findPort(state.from),b=findPort(state.to);
      if(a&&b){
        var points=[{x:a.x,y:a.y}].concat(state.waypoints,[{x:b.x,y:b.y}]);
        var d='M'+points.map(function(p){return p.x.toFixed(1)+','+p.y.toFixed(1);}).join('L');
        var path=svgElement('path','ae-cn-draft');
        path.setAttribute('d',d);s.appendChild(path);
        state.waypoints.forEach(function(p,i){
          var circle=svgElement('circle','ae-cn-waypoint');circle.setAttribute('cx',p.x);circle.setAttribute('cy',p.y);circle.setAttribute('r','10');
          s.appendChild(circle);
        });
      }
    }
    return s;
  }
  function makeSelect(role,title){
    var wrapper=el('label','ae-cn-field');
    wrapper.appendChild(el('span','ae-cn-label',title));
    var sel=el('select','ae-cn-select');
    sel.dataset.action=role;sel.setAttribute('aria-label',title);
    sel.appendChild(option('','Seleccionar '+(role==='from'?'origen':'destino')+'…'));
    state.ports.filter(function(x){return x.endpoint;}).slice().sort(function(a,b){return a.name.localeCompare(b.name,'es');}).forEach(function(p){sel.appendChild(option(p.id,portLabel(p)));});
    sel.value=state[role];
    wrapper.appendChild(sel);return wrapper;
  }
  function renderMap(){
    var scroll=el('div','ae-cn-scroll');
    scroll.setAttribute('tabindex','0');scroll.setAttribute('aria-label','Carta cartográfica desplazable: desplázate horizontalmente para ver los puntos');
    var stage=el('div','ae-cn-map-stage');
    stage.style.aspectRatio=state.mapWidth+' / '+state.mapHeight;
    var map=el('img','ae-cn-map');
    map.src=state.atlas.map.src;
    map.alt='Cartografía de Aeternalis. Los marcadores náuticos corresponden a localidades del Atlas.';
    map.loading='lazy';map.decoding='async';
    map.addEventListener('error',function(){
      map.style.visibility='hidden';
      var fallback=el('p','ae-cn-map-fallback','No se pudo cargar la imagen cartográfica. Los selectores de puertos siguen disponibles.');
      stage.appendChild(fallback);
    },{once:true});
    stage.appendChild(map);
    stage.appendChild(svgOverlay());
    state.ports.forEach(function(p){
      var pin=button('','pin','ae-cn-pin'+(state.from===p.id?' is-from':'')+(state.to===p.id?' is-to':'')+(!p.endpoint?' is-reference':'')+(p.coordinateStatus==='provisional'?' is-provisional':'') ,p.id);
      pin.style.left=(100*p.x/state.mapWidth).toFixed(4)+'%';
      pin.style.top=(100*p.y/state.mapHeight).toFixed(4)+'%';
      pin.title=portLabel(p);
      pin.setAttribute('aria-label',portLabel(p)+(p.endpoint?' · seleccionar para salida o llegada':' · referencia'));
      pin.appendChild(img('assets/naval/navegacion/'+(p.role==='faro'?'marcador_faro.webp':p.role==='costa'?'icono_isla.webp':'marcador_puerto.webp'),'ae-cn-pin-icon',''));
      var tip=el('span','ae-cn-pin-text',p.name);tip.setAttribute('aria-hidden','true');pin.appendChild(tip);
      stage.appendChild(pin);
    });
    if(state.drawMode&&state.from&&state.to){
      stage.classList.add('is-drawing');
      var hint=el('span','ae-cn-draw-hint','Haz clic en la carta para añadir puntos de paso');
      stage.appendChild(hint);
    }
    scroll.appendChild(stage);
    var foot=el('div','ae-cn-map-legend');
    [['ae-cn-key is-from','Salida'],['ae-cn-key is-to','Destino'],['ae-cn-key is-reference','Faro / referencia']].forEach(function(k){
      var item=el('span','ae-cn-legend-item');item.appendChild(el('span',k[0]));item.appendChild(el('span','',k[1]));foot.appendChild(item);
    });
    var wrapper=el('div','ae-cn-cartography');wrapper.appendChild(scroll);wrapper.appendChild(foot);
    return wrapper;
  }
  function makeCalculation(){
    var box=el('div','ae-cn-calculation');
    var head=el('h3','','Bitácora de travesía');box.appendChild(head);
    box.appendChild(el('p','ae-cn-info','Selecciona el nivel de Velas e indica los hexágonos de tu travesía.'));
    var row=el('div','ae-cn-calculation-grid');
    var sailWrap=el('label','ae-cn-field');
    sailWrap.appendChild(el('span','ae-cn-label',state.synced?'Velas · sincronizadas con el Astillero':'Nivel de Velas'));
    var sail=el('select','ae-cn-select');sail.dataset.action='sails';
    [['1','I · 24 h/hex'],['2','II · 18 h/hex'],['3','III · 12 h/hex'],['4','Legendarias · 8 h/hex']].forEach(function(pair){sail.appendChild(option(pair[0],pair[1]));});
    sail.value=String(state.sails);sailWrap.appendChild(sail);row.appendChild(sailWrap);
    var hxWrap=el('label','ae-cn-field');
    hxWrap.appendChild(el('span','ae-cn-label','Distancia en hexágonos'));
    var hx=el('input','ae-cn-input');hx.type='number';hx.inputMode='numeric';hx.min='1';hx.max='999';hx.step='1';hx.placeholder='Número de hexágonos';
    hx.value=String(state.hexes);hx.dataset.action='hexes';
    hxWrap.appendChild(hx);row.appendChild(hxWrap);box.appendChild(row);
    var num=Number(state.hexes),valid=state.hexes!==''&&Number.isInteger(num)&&num>=1&&num<=999;
    var total=valid?num*hours():null;
    var output=el('div','ae-cn-calculation-result');
    output.appendChild(el('span','ae-cn-kicker','DURACIÓN BASE SEGÚN REGLAMENTO'));
    output.appendChild(el('strong','',valid?total.toLocaleString('es-CL')+' horas · '+(total/24).toLocaleString('es-CL',{maximumFractionDigits:2})+' días':'Introduce la distancia'));
    output.appendChild(el('small','',valid?'Duración para '+num+' hexágono'+(num===1?'':'s')+' de navegación.':'Indica cuántos hexágonos recorrerá tu navío.'));
    box.appendChild(output);
    return box;
  }
  function render(){
    if(!state.atlas||!state.cfg)return;
    var previousScroll=ROOT.querySelector('.ae-cn-scroll');
    var scrollOffset=previousScroll?previousScroll.scrollLeft:0;
    ROOT.replaceChildren();
    var page=el('div','ae-cn-page');
    var head=el('header','ae-cn-header');
    head.appendChild(img('assets/naval/navegacion/brujula_borde_soga.webp','ae-cn-header-icon',''));
    head.appendChild(el('span','ae-cn-kicker','ALMIRANTAZGO DE AETERNALIS · CARTOGRAFÍA'));
    head.appendChild(el('h2','','Carta Náutica'));
    head.appendChild(el('p','', 'Explora los puertos y bahías de Aeternalis, diseña tu recorrido y consulta los tiempos de navegación.'));
    page.appendChild(head);
    var layout=el('div','ae-cn-layout');
    var controls=el('aside','ae-cn-side');
    controls.appendChild(el('h3','','Puertos y escalas'));
    controls.appendChild(el('p','ae-cn-info','Elige el puerto de origen y el destino de tu travesía.'));
    controls.appendChild(makeSelect('from','Puerto de salida'));
    controls.appendChild(makeSelect('to','Puerto de destino'));
    var chosen=el('div','ae-cn-chosen');
    if(state.from){var p=findPort(state.from);if(p)chosen.appendChild(el('p','','Salida: '+p.name));}
    if(state.to){var p=findPort(state.to);if(p)chosen.appendChild(el('p','','Destino: '+p.name));}
    if(!state.from||!state.to)chosen.appendChild(el('p','','Selecciona dos puntos de embarque para diseñar el recorrido.'));
    controls.appendChild(chosen);
    var drawWrap=el('div','ae-cn-trace-controls');
    var draw=button(state.drawMode?'Terminar edición':state.draft?'Seguir añadiendo escalas':'Trazar recorrido','toggle-draw','ae-cn-primary');
    draw.disabled=!(state.from&&state.to);
    drawWrap.appendChild(draw);
    if(state.waypoints.length){
      drawWrap.appendChild(button('Deshacer último punto','undo-point','ae-cn-secondary'));
      drawWrap.appendChild(el('p','ae-cn-hint',state.waypoints.length+' punto(s) de paso en la carta.'));
    }
    var clear=button('Borrar recorrido','clear-draw','ae-cn-secondary');clear.disabled=!state.draft&&!state.waypoints.length;drawWrap.appendChild(clear);
    controls.appendChild(drawWrap);
    var gridLabel=el('label','ae-cn-toggle');
    var gridCheckbox=el('input','');gridCheckbox.type='checkbox';gridCheckbox.dataset.action='grid';gridCheckbox.checked=state.showGrid;gridLabel.appendChild(gridCheckbox);
    gridLabel.appendChild(el('span','','Mostrar retícula hexagonal'));controls.appendChild(gridLabel);
    controls.appendChild(makeCalculation());
    layout.appendChild(controls);layout.appendChild(renderMap());
    page.appendChild(layout);
    var footer=el('footer','ae-cn-footer');
    footer.appendChild(el('strong','','Bitácora del Almirantazgo'));
    footer.appendChild(el('p','','Cada puerto guarda una historia. Traza tu rumbo y prepara la siguiente expedición.'));
    if(state.notice){var notice=el('p','ae-cn-live',state.notice);notice.setAttribute('role','status');footer.appendChild(notice);}
    page.appendChild(footer);ROOT.appendChild(page);ROOT.setAttribute('data-ae-carta','ready');
    var newScroll=ROOT.querySelector('.ae-cn-scroll');
    if(newScroll&&scrollOffset>0)newScroll.scrollLeft=scrollOffset;
  }
  function focusOn(action){
    var e=ROOT.querySelector('[data-action="'+action+'"]');
    if(e&&typeof e.focus==='function')e.focus({preventScroll:true});
  }
  ROOT.addEventListener('change',function(ev){
    var e=ev.target,a=e.dataset.action;if(!a)return;
    if(a==='from'||a==='to'){choose(e.value,a);focusOn(a);return;}
    if(a==='sails'){state.sails=Math.max(1,Math.min(4,Number(e.value)||1));state.synced=false;render();focusOn('sails');return;}
    if(a==='hexes'){var v=String(e.value).trim();state.hexes=v===''?'':v;render();focusOn('hexes');return;}
    if(a==='grid'){state.showGrid=Boolean(e.checked);render();focusOn('grid');return;}
  });
  ROOT.addEventListener('click',function(ev){
    var target=ev.target;
    var b=target.closest('button[data-action]');
    if(b&&ROOT.contains(b)){
      var action=b.dataset.action;
      if(action==='pin'){
        var p=findPort(b.dataset.value);
        if(!p){return;}
        if(!p.endpoint){state.notice=p.name+' es una referencia de navegación. Elige un puerto o bahía.';render();return;}
        if(!state.from||state.from===p.id){choose(p.id,'from');}
        else if(!state.to||state.to===p.id){choose(p.id,'to');}
        else {choose(p.id,'from');}
      } else if(action==='toggle-draw'){
        if(!state.from||!state.to)return;
        state.draft=true;state.drawMode=!state.drawMode;
        state.notice=state.drawMode?'Selecciona los puntos de paso en la carta.':'Recorrido actualizado.';
        render();focusOn('toggle-draw');
      } else if(action==='clear-draw'){
        clearPath();state.notice='Recorrido borrado.';render();focusOn('clear-draw');
      } else if(action==='undo-point'){
        state.waypoints.pop();state.notice='Último punto de paso retirado.';render();focusOn('undo-point');
      }
      return;
    }
    var stage=target.closest('.ae-cn-map-stage');
    if(!stage||!state.drawMode||!state.from||!state.to||!ROOT.contains(stage))return;
    if(state.waypoints.length>=30){state.notice='Se alcanzó el límite ilustrativo de 30 puntos de paso.';render();return;}
    var box=stage.getBoundingClientRect();
    if(!box.width||!box.height)return;
    var x=Math.max(0,Math.min(state.mapWidth,(ev.clientX-box.left)/box.width*state.mapWidth));
    var y=Math.max(0,Math.min(state.mapHeight,(ev.clientY-box.top)/box.height*state.mapHeight));
    state.waypoints.push({x:x,y:y});state.notice='Punto de paso añadido al recorrido.';
    render();
  });
  function syncFromAstillero(obj){
    if(!obj||!obj.levels)return;
    var next=Number(obj.levels.velas);
    if(!Number.isInteger(next)||next<1||next>4)return;
    state.sails=next;state.synced=true;
    if(state.atlas)render();
  }
  if(window.addEventListener)window.addEventListener('aeternalis:astillero-change',function(e){syncFromAstillero(e.detail);});
  if(window.AeternalisAstillero&&typeof window.AeternalisAstillero.getState==='function'){
    syncFromAstillero(window.AeternalisAstillero.getState());
  }
  Promise.all([json('data/astillero/carta-naval.json'),json('data/atlas/manifest.json'),json('data/atlas/catalogo.json')])
    .then(function(all){
      var config=all[0],manifest=all[1],atlas=all[2];
      if(config.schema!=='aeternalis-carta-naval-v1'||manifest.schema!=='aeternalis-atlas-v1')throw Error('Esquema de cartografía incompatible');
      if(!atlas.map||!atlas.map.src||!Array.isArray(manifest.files.locations))throw Error('Mapa incompleto');
      return Promise.all(manifest.files.locations.map(json)).then(function(locations){
        var places=locations.flat(),byId=new Map();
        places.forEach(function(p){if(p&&p.id)byId.set(p.id,p);});
        var points=config.ports.map(function(p){
          var src=byId.get(p.id);
          if(!src||src.atlasArchiveReason||!Number.isFinite(src.x)||!Number.isFinite(src.y))throw Error('Falta coordenada activa del Atlas: '+p.id);
          return {id:p.id,name:src.name,x:src.x,y:src.y,role:p.role,endpoint:Boolean(p.endpoint),note:p.note||'',regionId:src.regionId||'',
            coordinateStatus:src.coordinateStatus||'no_verificado'};
        });
        state.cfg=config;state.atlas=atlas;state.ports=points;
        state.mapWidth=Number(atlas.map.width)||2048;state.mapHeight=Number(atlas.map.height)||1571;
        render();
        window.AeternalisCartaNaval={version:'1.1.0',getState:function(){return {from:state.from,to:state.to,sails:state.sails,hexes:state.hexes,waypoints:state.waypoints.slice(),draft:state.draft};}};
      });
    }).catch(function(error){
      ROOT.setAttribute('data-ae-carta','error');
      ROOT.replaceChildren();ROOT.appendChild(el('p','ae-cn-error','La Carta Náutica no pudo cargar los datos del Atlas: '+error.message));
      console.error('[Aeternalis Carta Náutica]',error);
    });
})();