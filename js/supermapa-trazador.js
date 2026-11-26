/* Aeternalis · Cartografía terrestre por hexágonos · v1.0
 * Editor no destructivo. Evidencia procedente de Mapa_3.21(2).png.
 * No convierte conexiones propuestas en oficiales sin acción expresa del cartógrafo.
 */
(function(){
'use strict';
if(window.__AETERNALIS_TRAZADOR_LOADING__)return;
window.__AETERNALIS_TRAZADOR_LOADING__=true;
var ROOT='https://morpheus-eko.github.io/aeternalis/';
var DATA='data/atlas/caminos-evidencia.json';
var KEY='aeternalis-trazador-caminos-v1';
var DIRECTIONS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
var storage={version:1,accepted:{},working:{}};
try{var prior=JSON.parse(localStorage.getItem(KEY)||'null');if(prior&&prior.version===1){storage.accepted=prior.accepted||{};storage.working=prior.working||{};}}catch(e){}
function keep(){try{localStorage.setItem(KEY,JSON.stringify(storage));}catch(e){console.warn('[Trazador] Sin almacenamiento local',e);}}
function escape(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function key(p){return p[0]+','+p[1];}
function unpack(s){return s.split(',').map(Number);}
function norm(v){return Number(v).toFixed(1);}
function Heap(){this.a=[];}
Heap.prototype.push=function(n){var a=this.a,i=a.length;a.push(n);while(i){var k=(i-1)>>1;if(a[k][0]<=n[0])break;a[i]=a[k];i=k;}a[i]=n;};
Heap.prototype.pop=function(){var a=this.a,v=a[0],last=a.pop();if(a.length){var i=0;while(true){var k=2*i+1;if(k>=a.length)break;if(k+1<a.length&&a[k+1][0]<a[k][0])k++;if(last[0]<=a[k][0])break;a[i]=a[k];i=k;}a[i]=last;}return v;};
Heap.prototype.size=function(){return this.a.length;};
function start(host,evidence){
 if(window.__AETERNALIS_TRAZADOR_CAMINOS__)return;
 var L=window.L,map=host.map,D=host.data,grid=evidence.coordinateSystem;
 if(!L||!map||!D||!grid)throw Error('El Atlas no está inicializado');
 var toolbar=document.querySelector('#aeternalis-atlas .ae-leaf-toolbar-actions');
 var viewport=document.getElementById('ae-map-viewport');
 if(!toolbar||!viewport)throw Error('No se encuentra el contenedor del Supermapa');
 var R=grid.hexRadius,S=Math.sqrt(3)*R;
 var all=new Map(evidence.cells.map(function(c){return [key(c),c];}));
 var list=host.getEdges().filter(function(e){return e.kind!=='sea'&&D.places.some(function(p){return p.id===e.from;})&&D.places.some(function(p){return p.id===e.to;});});
 var byEdge=new Map(list.map(function(e){return [e.id,e];}));
 var byCity=new Map(D.places.map(function(p){return [p.id,p];}));
 var state={active:false,evidence:true,mode:'inspect',edgeId:list.length?list[0].id:'',points:[],waypoints:[],blocked:[],lastCell:null,quality:null};
 var group=L.layerGroup(),selectedLayer=L.layerGroup(),cursorLayer=L.layerGroup(),evidenceLayer=null;
 var button=document.createElement('button');button.type='button';button.id='ae-toggle-trazador';button.textContent='⌁ Calcar caminos';button.setAttribute('aria-pressed','false');button.title='Analizar y corregir caminos siguiendo los hexágonos';toolbar.appendChild(button);
 var panel=document.createElement('aside');panel.id='ae-trazador-panel';panel.className='ae-trazador-panel';panel.hidden=true;viewport.appendChild(panel);
 panel.innerHTML=`<header class="ae-trazador-head"><span>ATLAS DE LOS REINOS · MODO CARTÓGRAFO</span><button id="ae-trazador-close" type="button" aria-label="Cerrar trazador">✕</button><h2>Caminos del mapa</h2><p>Reconstruye las rutas punteadas, hexágono por hexágono.</p></header>
 <div class="ae-trazador-scroll"><section class="ae-trazador-section"><h3>Conexión del Atlas</h3><label for="ae-trazador-edge">Tramo a examinar</label><select id="ae-trazador-edge"></select><button id="ae-trazador-plan" class="ae-trazador-primary" type="button">Detectar recorrido</button><div id="ae-trazador-summary" class="ae-trazador-summary" aria-live="polite"></div></section>
 <section class="ae-trazador-section"><h3>Inspección de hexágonos</h3><label class="ae-trazador-check"><input id="ae-trazador-pigment" type="checkbox" checked> Mostrar puntos detectados</label><label for="ae-trazador-mode">Acción al pulsar el mapa</label><select id="ae-trazador-mode"><option value="inspect">Inspeccionar hexágono</option><option value="waypoint">Obligar a pasar por aquí</option><option value="block">Bloquear / desbloquear hexágono</option></select><div class="ae-trazador-buttons"><button type="button" id="ae-trazador-undo">Quitar último paso</button><button type="button" id="ae-trazador-clear">Limpiar correcciones</button></div><div id="ae-trazador-cell" class="ae-trazador-cell" aria-live="polite">Selecciona un hexágono del mapa para consultar los pigmentos y la continuidad del camino.</div></section>
 <section class="ae-trazador-section"><h3>Revisión y publicación</h3><p class="ae-trazador-muted">Los caminos propuestos permanecen sin confirmar. La aceptación modifica únicamente tu borrador local; exporta el JSON para publicarlo.</p><button type="button" class="ae-trazador-primary" id="ae-trazador-accept">Aceptar trazado revisado</button><button type="button" id="ae-trazador-apply">Aplicar al Atlas local</button><button type="button" id="ae-trazador-export">Exportar cartografía revisada (JSON)</button><button type="button" id="ae-trazador-import">Importar correcciones</button><input type="file" id="ae-trazador-file" accept=".json,application/json" hidden><div id="ae-trazador-save-note" class="ae-trazador-muted"></div></section>
 <p class="ae-trazador-foot">Mapa 3.21 · Radio hexagonal ${R} · Detección cromática orientativa. Una coincidencia de pigmento no demuestra por sí sola la existencia de una ruta.</p></div>`;
 var get=function(id){return document.getElementById('ae-trazador-'+id);};
 var dropdown=get('edge');
 var ordered=list.slice().sort(function(a,b){var A=byCity.get(a.from),B=byCity.get(a.to);return ((A&&A.name)||'').localeCompare((B&&B.name)||'','es');});
 ordered.forEach(function(e){var a=byCity.get(e.from),b=byCity.get(e.to),op=document.createElement('option');op.value=e.id;op.textContent=(a?a.name:e.from)+' → '+(b?b.name:e.to)+' · '+(e.kind==='road'?'camino':'senda');dropdown.appendChild(op);});
 dropdown.value=state.edgeId;
 function center(c){return [R*1.5*c[0],S*(c[1]+c[0]/2)];}
 function pos(c){var p=center(c);return L.latLng(-p[1],p[0]);}
 function hexAt(x,y){var q=2*x/(3*R),r=(-x/3+y/Math.sqrt(3))/R,xx=q,zz=r,yy=-q-r,rx=Math.round(xx),ry=Math.round(yy),rz=Math.round(zz),dx=Math.abs(rx-xx),dy=Math.abs(ry-yy),dz=Math.abs(rz-zz);if(dx>dy&&dx>dz)rx=-ry-rz;else if(dy>dz)ry=-rx-rz;else rz=-rx-ry;return [rx,rz];}
 function distance(a,b){var q=a[0]-b[0],r=a[1]-b[1];return Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));}
 function polygon(c){var v=center(c),p=[];for(var i=0;i<6;i++){var th=Math.PI*i/3;p.push(L.latLng(-(v[1]+R*Math.sin(th)),v[0]+R*Math.cos(th)));}return p;}
 function snap(x,y){var t=hexAt(x,y),nearest=null,best=Infinity;for(var q=t[0]-6;q<=t[0]+6;q++)for(var r=t[1]-6;r<=t[1]+6;r++){var z=[q,r],v=all.get(key(z));if(!v)continue;var p=center(z),d=(p[0]-x)**2+(p[1]-y)**2;if(d<best){best=d;nearest=z;}}return {cell:nearest,gap:Math.sqrt(best)};}
 function sample(c){var a=all.get(key(c));return a?{red:a[2],ochre:a[3],blue:a[4],water:a[5],dots:a[2]+a[3]+a[4]}:null;}
 function evidenceOverlay(){var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),classes=[['ae-road-ink-red',[]],['ae-road-ink-ochre',[]],['ae-road-ink-blue',[]]];
  svg.setAttribute('width',grid.width);svg.setAttribute('height',grid.height);svg.setAttribute('viewBox','0 0 '+grid.width+' '+grid.height);
  evidence.cells.forEach(function(c){var co=center(c);for(var i=2;i<5;i++){if(c[i]<=0)continue;var v=norm(co[0])+' '+norm(co[1]);classes[i-2][1].push('M'+v+'m-2.4 0a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0');}});
  classes.forEach(function(row){var p=document.createElementNS(ns,'path');p.setAttribute('class',row[0]);p.setAttribute('d',row[1].join(''));svg.appendChild(p);});
  return L.svgOverlay(svg,L.latLngBounds([-grid.height,0],[0,grid.width]),{interactive:false,className:'ae-road-detection'});
 }
 function showLayers(){panel.hidden=!state.active;button.setAttribute('aria-pressed',String(state.active));button.classList.toggle('is-active',state.active);
  if(!evidenceLayer)evidenceLayer=evidenceOverlay();
  if(state.active&&state.evidence){if(!map.hasLayer(evidenceLayer))evidenceLayer.addTo(map);}else if(map.hasLayer(evidenceLayer))map.removeLayer(evidenceLayer);
  for(var l of [selectedLayer,cursorLayer]){if(state.active&&!map.hasLayer(l))l.addTo(map);if(!state.active&&map.hasLayer(l))map.removeLayer(l);}
  if(state.active)map.invalidateSize({pan:false});
 }
 function warning(s){get('save-note').textContent=s;}
 function paint(){selectedLayer.clearLayers();if(!state.active)return;
  if(state.points.length){L.polyline(state.points.map(pos),{color:'#f5c879',weight:4.4,opacity:.96,interactive:false,className:'ae-road-selected'}).addTo(selectedLayer);
   var a=byEdge.get(state.edgeId),from=a&&byCity.get(a.from),to=a&&byCity.get(a.to);
   if(from&&to){L.polyline([L.latLng(-from.y,from.x),pos(state.points[0])],{color:'#edc488',dashArray:'2 4',weight:1.8,interactive:false}).addTo(selectedLayer);L.polyline([pos(state.points[state.points.length-1]),L.latLng(-to.y,to.x)],{color:'#edc488',dashArray:'2 4',weight:1.8,interactive:false}).addTo(selectedLayer);}
  }
  state.waypoints.forEach(function(w,n){L.circleMarker(pos(w),{radius:5,color:'#fff4cb',fillColor:'#995a33',fillOpacity:1,weight:2,interactive:false}).addTo(selectedLayer);});
  state.blocked.forEach(function(b){L.polygon(polygon(b),{color:'#e17870',weight:1.8,fillColor:'#7a2424',fillOpacity:.32,interactive:false}).addTo(selectedLayer);});
 }
 function drawCell(c){cursorLayer.clearLayers();if(!c)return;L.polygon(polygon(c),{color:'#fff4a9',weight:2,fillColor:'#f1d18a',fillOpacity:.22,interactive:false}).addTo(cursorLayer);
  var z=sample(c);get('cell').innerHTML='<strong>Hexágono '+escape(c.join(', '))+'</strong> · '+(z?'Suelo rastreable':'Fuera de la malla terrestre')+'<dl><dt>Ruta rojiza</dt><dd>'+(z?z.red:'—')+' puntos</dd><dt>Ruta ocre</dt><dd>'+(z?z.ochre:'—')+' puntos</dd><dt>Sendero azul</dt><dd>'+(z?z.blue:'—')+' puntos</dd><dt>Azul de agua</dt><dd>'+(z?z.water:'—')+'%</dd></dl>';
 }
 function runSegment(first,last,blocked){var a=key(first),b=key(last);if(!all.has(a)||!all.has(b))return null;
  var open=new Heap(),done=new Set(),cost=new Map([[a,0]]),parents=new Map([[a,null]]);open.push([distance(first,last),0,a]);var scans=0;
  while(open.size()&&scans++<16000){var top=open.pop(),id=top[2],g=top[1];if(done.has(id))continue;done.add(id);
   if(id===b){var path=[];while(id!==null){path.push(unpack(id));id=parents.get(id);}return path.reverse();}
   var current=unpack(id);
   for(var i=0;i<6;i++){var next=[current[0]+DIRECTIONS[i][0],current[1]+DIRECTIONS[i][1]],nk=key(next),cell=all.get(nk);if(!cell||done.has(nk)||blocked.has(nk))continue;
    var density=cell[2]+cell[3]+cell[4],weighted=(density>=2?1:density===1?1.55:3.6)+(cell[5]>30?1.5:0);var nc=g+weighted;
    if(nc<(cost.has(nk)?cost.get(nk):Infinity)){cost.set(nk,nc);parents.set(nk,id);open.push([nc+distance(next,last)*.95,nc,nk]);}
   }
  }
  return null;
 }
 function route(){var edge=byEdge.get(state.edgeId);if(!edge)return null;
  var a=byCity.get(edge.from),b=byCity.get(edge.to);if(!a||!b)return null;
  var first=snap(a.x,a.y),last=snap(b.x,b.y),blocked=new Set(state.blocked.map(key));if(!first.cell||!last.cell)return null;
  var path=[],anchors=[first.cell].concat(state.waypoints).concat([last.cell]);
  for(var i=1;i<anchors.length;i++){var part=runSegment(anchors[i-1],anchors[i],blocked);if(!part)return null;if(path.length)part.shift();path.push.apply(path,part);}
  var positives=path.filter(function(x){var s=sample(x);return s&&s.dots>0;}).length;
  var strong=path.filter(function(x){var s=sample(x);return s&&s.dots>=2;}).length;
  var coverage=path.length?Math.round(positives/path.length*100):0;
  var stretch=path.length/Math.max(1,distance(first.cell,last.cell));
  var grade=coverage>=80&&stretch<2.2?'Alta':coverage>=50&&stretch<2.7?'Media':'Baja';
  return {path:path,hexes:path.length-1,coverage:coverage,strong:Math.round(strong/path.length*100),grade:grade,stretch:Math.round(stretch*100)/100,snapFrom:Math.round(first.gap),snapTo:Math.round(last.gap)};
 }
 function refresh(recenter){var result=route(),ed=byEdge.get(state.edgeId),accepted=storage.accepted[state.edgeId];state.quality=result;
  state.points=result?result.path:[];paint();
  if(result){get('summary').innerHTML='<strong>'+result.hexes+' hexágonos del recorrido</strong><span>Coincidencia con puntos dibujados: '+result.coverage+' % · Indicios fuertes: '+result.strong+' %</span><span>Coincidencia cromática: '+result.grade+' · Desvío: '+result.stretch+'×</span><span>Distancia a los nodos de salida/llegada: '+result.snapFrom+' / '+result.snapTo+' unidades</span><em>'+(accepted?'Trazado aprobado por revisión manual.':'Sugerencia pendiente de revisión manual.')+'</em>';
   if(recenter){var line=L.latLngBounds(result.path.map(pos));map.fitBounds(line.pad(.18),{maxZoom:.6,padding:[35,35]});}
  }else{get('summary').textContent='No se pudo reconstruir un corredor terrestre continuo con los puntos actuales. Revisa los bloqueos, el origen y el trazado en el mapa.';}
  if(ed)get('accept').disabled=!result;
 }
 function localEdit(){storage.working[state.edgeId]={waypoints:state.waypoints.map(function(x){return x.slice();}),blocked:state.blocked.map(function(x){return x.slice();})};delete storage.accepted[state.edgeId];keep();}
 function select(id){state.edgeId=id;var work=storage.working[id]||{};state.waypoints=Array.isArray(work.waypoints)?work.waypoints.slice(0,70):[];state.blocked=Array.isArray(work.blocked)?work.blocked.slice(0,200):[];dropdown.value=id;refresh(false);}
 function exportJSON(){var edges=host.getEdges().map(function(e){var result=Object.assign({},e,{via:Array.isArray(e.via)?e.via.slice():[]}),accepted=storage.accepted[e.id];if(accepted&&Array.isArray(accepted.path)&&accepted.path.length>=2){result.via=accepted.path.slice(1,-1).map(function(c){var p=center(c);return {x:+p[0].toFixed(1),y:+p[1].toFixed(1)};});result.status='confirmada';result.origin='mapa_321_revision_manual';result.reason='Geometría hexagonal aprobada manualmente sobre la cartografía 3.21.';}return result;});
  var cities={};D.places.forEach(function(p){cities[p.id]={x:p.x,y:p.y};});
  var draft={version:1,networkVersion:15,coordinateSystem:'Aeternalis logical 2048x1571',hex:(typeof host.getCurrentHex==='function'?host.getCurrentHex():{radius:R,phaseX:0,phaseY:0}),cities:cities,regions:Object.fromEntries(D.regions.map(function(r){return [r.id,r.points];})),edges:edges,roadTracing:{version:1,source:'Mapa_3.21(2).png',accepted:storage.accepted,working:storage.working},note:'Solo los tramos que el cartógrafo aprobó expresamente reciben puntos intermedios y estado confirmada; el resto conserva su configuración inicial.'};
  download('Aeternalis_Caminos_Trazados_Revisados.json',draft);warning('Se exportó el JSON compatible con el Atlas. La publicación en GitHub es una operación aparte.');
 }
 function download(name,data){var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1200);}
 function importJSON(file){if(!file||file.size>5000000){warning('Archivo JSON demasiado grande.');return;}var reader=new FileReader();reader.onload=function(){try{var j=JSON.parse(String(reader.result));var saved=j.roadTracing||j;if(!saved||!saved.accepted||!saved.working)throw Error('No contiene la revisión de caminos');var clean={};Object.keys(saved.accepted).forEach(function(id){var v=saved.accepted[id];if(byEdge.has(id)&&Array.isArray(v.path)&&v.path.length<1500&&v.path.every(function(c){return Array.isArray(c)&&c.length===2&&c.every(Number.isInteger)&&all.has(key(c));}))clean[id]=v;});var cleanWork={};Object.keys(saved.working).forEach(function(id){var v=saved.working[id];if(byEdge.has(id)&&v&&Array.isArray(v.waypoints)&&Array.isArray(v.blocked)){cleanWork[id]={waypoints:v.waypoints.filter(function(c){return Array.isArray(c)&&c.length===2&&all.has(key(c));}).slice(0,70),blocked:v.blocked.filter(function(c){return Array.isArray(c)&&c.length===2&&all.has(key(c));}).slice(0,200)};}});storage.accepted=clean;storage.working=cleanWork;keep();select(state.edgeId);warning('Revisión importada: '+Object.keys(clean).length+' tramos aprobados.');}catch(e){warning('No se pudo importar: '+e.message);}};reader.readAsText(file);}
 button.addEventListener('click',function(){state.active=!state.active;showLayers();if(state.active&&!state.points.length)select(state.edgeId);});
 get('close').addEventListener('click',function(){state.active=false;showLayers();button.focus();});
 get('pigment').addEventListener('change',function(e){state.evidence=e.target.checked;showLayers();});
 get('mode').addEventListener('change',function(e){state.mode=e.target.value;});
 dropdown.addEventListener('change',function(){select(dropdown.value);warning('');});
 get('plan').addEventListener('click',function(){refresh(true);});
 get('undo').addEventListener('click',function(){state.waypoints.pop();localEdit();refresh(false);});
 get('clear').addEventListener('click',function(){if(!window.confirm('¿Quitar los puntos obligatorios y bloqueos del tramo?'))return;state.waypoints=[];state.blocked=[];localEdit();refresh(false);});
 get('accept').addEventListener('click',function(){if(!state.quality||!state.points.length)return;if(!window.confirm('¿Has contrastado esta ruta con los puntos dibujados? La aprobación es manual y se guardará en este navegador.'))return;storage.accepted[state.edgeId]={path:state.points.map(function(c){return c.slice();}),coverage:state.quality.coverage,grade:state.quality.grade,approvedAt:new Date().toISOString(),source:'Mapa_3.21(2).png'};keep();refresh(false);warning('Tramo aprobado. Puedes exportar el JSON para integrarlo a la cartografía.');});
 get('apply').addEventListener('click',function(){var accepted=storage.accepted[state.edgeId];if(!accepted){warning('Debes aceptar expresamente el trazado antes de aplicarlo al Atlas.');return;}if(typeof host.updateEdgeVia!=='function'){warning('Esta versión del Atlas requiere exportar JSON para incorporar las rutas. El trazado sigue guardado.');return;}var p=accepted.path.slice(1,-1).map(function(c){var xy=center(c);return {x:+xy[0].toFixed(1),y:+xy[1].toFixed(1)};});host.updateEdgeVia(state.edgeId,p,true);warning('Geometría aplicada al Atlas local. Exporta el JSON para publicarla en GitHub.');});
 get('export').addEventListener('click',exportJSON);
 get('import').addEventListener('click',function(){get('file').click();});
 get('file').addEventListener('change',function(e){importJSON(e.target.files&&e.target.files[0]);e.target.value='';});
 map.on('click',function(ev){if(!state.active || (typeof host.isEditing==='function'&&host.isEditing()))return;var x=ev.latlng.lng,y=-ev.latlng.lat,c=hexAt(x,y),data=sample(c);state.lastCell=c;drawCell(c);
  if(state.mode==='inspect')return;if(!data){warning('Ese hexágono no figura como terreno recorrible en la máscara; revisa la costa o la calibración.');return;}
  if(state.mode==='waypoint'){if(state.waypoints.length>=70){warning('Límite de 70 puntos obligatorios por tramo.');return;}state.waypoints.push(c);}
  else if(state.mode==='block'){var k=key(c),idx=state.blocked.findIndex(function(a){return key(a)===k;});if(idx>=0)state.blocked.splice(idx,1);else state.blocked.push(c);}
  localEdit();refresh(false);
 });
 showLayers();
 window.__AETERNALIS_TRAZADOR_CAMINOS__={version:'1.0.0',stats:evidence.stats,getState:function(){return {edgeId:state.edgeId,active:state.active,mode:state.mode,waypoints:state.waypoints.length,blocked:state.blocked.length,quality:state.quality&&{hexes:state.quality.hexes,coverage:state.quality.coverage,grade:state.quality.grade},acceptedCount:Object.keys(storage.accepted).length};},analyze:function(id){if(!byEdge.has(id))return null;state.edgeId=id;state.waypoints=[];state.blocked=[];return route();},getEvidence:function(q,r){return sample([q,r]);}};
 if(new URLSearchParams(location.search).get('caminos')==='1'){state.active=true;showLayers();select(state.edgeId);}
}
var attempts=0;
function wait(){var api=window.__AE_ATLAS_LEAFLET_DEBUG__;
 if(api&&api.map&&api.data&&api.getEdges&&window.L){clearInterval(timer);fetch(ROOT+DATA+'?v=1.0.0').then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(function(d){if(d.schema!=='aeternalis-caminos-evidencia-v1')throw Error('Datos incompatibles');start(api,d);}).catch(function(err){console.error('[Aeternalis caminos]',err);window.__AETERNALIS_TRAZADOR_LOADING__=false;});return;}
 if(++attempts>100){clearInterval(timer);window.__AETERNALIS_TRAZADOR_LOADING__=false;console.warn('[Aeternalis caminos] El Atlas no está disponible');}
}
var timer=setInterval(wait,350);wait();
})();