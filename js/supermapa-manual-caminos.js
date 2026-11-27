/* AETERNALIS · Dibujante manual de caminos · v1.2.0
   Herramienta cartográfica de edición local. NO publica ni confirma caminos.
   Los tramos se dibujan sobre hexágonos del Atlas, siguiendo los clics del autor. */
(function(){
 'use strict';
 if(window.__AETERNALIS_CAMINOS_MANUALES_LOADING__)return;
 window.__AETERNALIS_CAMINOS_MANUALES_LOADING__=true;
 var ROOT='https://morpheus-eko.github.io/aeternalis/';
 var STORE='aeternalis-caminos-manuales-v1';
 var MAX_CELLS=1400, MAX_ROUTES=500;
 var saved={version:1,routes:{}};
 try{
   var x=JSON.parse(localStorage.getItem(STORE)||'null');
   if(x&&x.version===1&&x.routes&&typeof x.routes==='object')saved.routes=x.routes;
 }catch(e){console.warn('[Caminos manuales] No se pudo recuperar el borrador',e);}
 function persist(){
   try{localStorage.setItem(STORE,JSON.stringify(saved));}
   catch(e){console.warn('[Caminos manuales] No se pudo guardar el borrador',e);}
 }
 function safeText(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function waitForAtlas(){
   var api=window.__AE_ATLAS_LEAFLET_DEBUG__;
   if(api&&api.map&&api.data&&window.L){clearInterval(timer);launch(api);return;}
   if(++attempts>120){clearInterval(timer);console.warn('[Caminos manuales] No se encontró el Atlas Leaflet.');window.__AETERNALIS_CAMINOS_MANUALES_LOADING__=false;}
 }
 var attempts=0,timer=setInterval(waitForAtlas,300);
 waitForAtlas();
 function launch(api){
   if(window.__AETERNALIS_CAMINOS_MANUALES__)return;
   var L=window.L,map=api.map,D=api.data;
   var toolbar=document.querySelector('#aeternalis-atlas .ae-leaf-toolbar-actions');
   var viewport=document.getElementById('ae-map-viewport');
   if(!toolbar||!viewport)return;
   var R=9.3333, SQRT3=Math.sqrt(3), H=SQRT3*R;
   var W=D.map.width||2048,HEIGHT=D.map.height||1571, evidence=new Map();
   var sites=D.places.filter(function(p){return !p.atlasArchiveReason&&Number.isFinite(p.x)&&Number.isFinite(p.y);})
     .slice().sort(function(a,b){return a.name.localeCompare(b.name,'es');});
   var city=new Map(sites.map(function(p){return [p.id,p];}));
   var original=api.getEdges().filter(function(e){return e.kind!=='sea'&&city.has(e.from)&&city.has(e.to);});
   var originalById=new Map(original.map(function(e){return [e.id,e];}));
   var state={active:false,drawing:false,selected:'',waterOverride:false};
   function key(c){return c[0]+','+c[1];}
   function center(c){return [1.5*R*c[0],H*(c[1]+c[0]/2)];}
   function loc(c){var a=center(c);return L.latLng(-a[1],a[0]);}
   function hexDistance(a,b){var q=a[0]-b[0],r=a[1]-b[1];return Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));}
   function cubeRound(q,r){var y=-q-r,x=Math.round(q),z=Math.round(r),ry=Math.round(y),dx=Math.abs(x-q),dy=Math.abs(ry-y),dz=Math.abs(z-r);if(dx>dy&&dx>dz)x=-ry-z;else if(dy>dz)ry=-x-z;else z=-x-ry;return [x,z];}
   function atXY(x,y){return cubeRound(2*x/(3*R),(-x/3+y/SQRT3)/R);}
   function within(c){var a=center(c);return a[0]>=0&&a[0]<=W&&a[1]>=0&&a[1]<=HEIGHT;}
   function line(a,b){
     var n=hexDistance(a,b);if(n>350)return null;
     var result=[],seen=new Set();
     for(var i=0;i<=n;i++){
       var t=n?i/n:0,c=cubeRound(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);
       if(!seen.has(key(c))){result.push(c);seen.add(key(c));}
     }
     return result;
   }
   function isHexArray(value){
     return Array.isArray(value)&&value.length<=MAX_CELLS&&value.every(function(c){return Array.isArray(c)&&c.length===2&&c.every(Number.isInteger)&&within(c);})
       &&value.every(function(c,i){return i===0||hexDistance(value[i-1],c)===1;});
   }
   function sanitize(raw){
     if(!raw||typeof raw!=='object'||typeof raw.id!=='string'||!city.has(raw.from)||!city.has(raw.to)||raw.from===raw.to)return null;
     var kind=raw.kind==='trail'?'trail':raw.kind==='road'?'road':null;
     if(!kind||!isHexArray(raw.hexPath)||raw.hexPath.length<1)return null;
     return {id:raw.id,from:raw.from,to:raw.to,kind:kind,hexPath:raw.hexPath.map(function(c){return c.slice();}),
       strokes:Array.isArray(raw.strokes)?raw.strokes.filter(function(v){return Number.isInteger(v)&&v>=1&&v<=raw.hexPath.length;}).slice(0,MAX_CELLS):[],
       finished:!!raw.finished&&raw.hexPath.length>=2,checked:!!raw.checked,updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt:''};
   }
   // Read any existing local drafts conservatively: do not trust imported coordinates.
   Object.keys(saved.routes).forEach(function(id){var clean=sanitize(saved.routes[id]);if(!clean||clean.id!==id)delete saved.routes[id];else saved.routes[id]=clean;});
   persist();
   var button=document.createElement('button');
   button.type='button';button.id='ae-toggle-caminos-manuales';button.textContent='✎ Dibujar caminos';
   button.title='Dibujo manual de caminos sobre hexágonos';button.setAttribute('aria-pressed','false');
   toolbar.appendChild(button);
   var panel=document.createElement('aside');
   panel.id='ae-caminos-manuales-panel';panel.className='ae-caminos-manuales-panel';panel.hidden=true;
   panel.setAttribute('aria-label','Dibujante manual de caminos');
   viewport.appendChild(panel);
   panel.innerHTML='<header class="ae-mc-head"><span>ATLAS · MODO CARTÓGRAFO</span><h2>✎ Dibujar caminos</h2><button type="button" id="ae-mc-close" aria-label="Cerrar editor">✕</button><p>Marca sobre el mapa los giros del camino. Entre dos clics se trazan hexágonos consecutivos; no se buscan rutas automáticas.</p></header>'+
     '<div class="ae-mc-scroll"><section><h3>Selecciona el recorrido</h3><label for="ae-mc-existing">Camino original o borrador</label><select id="ae-mc-existing"></select>'+
     '<label for="ae-mc-from">Localidad de origen</label><select id="ae-mc-from"></select><label for="ae-mc-to">Localidad de destino</label><select id="ae-mc-to"></select><label for="ae-mc-kind">Clase de vía</label><select id="ae-mc-kind"><option value="road">Camino</option><option value="trail">Senda</option></select>'+
     '<div class="ae-mc-two"><button type="button" id="ae-mc-new">Crear conexión nueva</button><button type="button" id="ae-mc-delete">Eliminar borrador</button></div></section>'+
     '<section><h3>Dibujo sobre hexágonos</h3><p class="ae-mc-tip">Selecciona una conexión existente o crea una nueva. Pulsa «Empezar / continuar» y haz clic en el mapa siguiendo sus puntitos. Puedes cambiar el zoom o desplazar el mapa entre clics.</p>'+
     '<button type="button" class="ae-mc-primary" id="ae-mc-start">Empezar / continuar dibujo</button>'+
     '<div class="ae-mc-two"><button type="button" id="ae-mc-finish">Finalizar cerca del destino</button><button type="button" id="ae-mc-undo">Deshacer última pincelada</button></div>'+
     '<div class="ae-mc-two"><button type="button" id="ae-mc-pause">Pausar para navegar</button><button type="button" id="ae-mc-clear">Borrar trazado</button></div>'+
     '<label class="ae-mc-check"><input id="ae-mc-water" type="checkbox"> Permitir cruces de hexágonos no clasificados como suelo (puentes, pasos o errores del mapa)</label>'+
     '<div class="ae-mc-status" id="ae-mc-status" aria-live="polite"></div></section>'+
     '<section><h3>Compartir el resultado</h3><p class="ae-mc-tip">Los dibujos se guardan en este navegador y se exportan aunque estén incompletos. No se altera ninguna ruta publicada.</p>'+
     '<label class="ae-mc-check"><input type="checkbox" id="ae-mc-reviewed"> He revisado personalmente este trazado sobre el mapa</label>'+
     '<button class="ae-mc-primary" type="button" id="ae-mc-export">Exportar TODOS mis caminos (JSON)</button><button type="button" id="ae-mc-import">Importar JSON de caminos</button><input type="file" id="ae-mc-file" accept="application/json,.json" hidden>'+
     '<div class="ae-mc-message" id="ae-mc-message" aria-live="polite">Los borradores no se publican automáticamente.</div></section></div>';
   var g=function(id){return document.getElementById('ae-mc-'+id);};
   var drawingLayer=L.layerGroup(),pointsLayer=L.layerGroup();
   var current=function(){return saved.routes[state.selected]||null;};
   var mkOption=function(text,value){var o=document.createElement('option');o.textContent=text;o.value=value;return o;};
   sites.forEach(function(p){g('from').appendChild(mkOption(p.name,p.id));g('to').appendChild(mkOption(p.name,p.id));});
   function renderChoices(){
     var before=state.selected;g('existing').innerHTML='';
     g('existing').appendChild(mkOption('— Elige un tramo existente o uno de tus dibujos —',''));
     original.forEach(function(e){var a=city.get(e.from),b=city.get(e.to),isSaved=!!saved.routes[e.id];
       g('existing').appendChild(mkOption((isSaved?'✎ ':'')+a.name+' → '+b.name+' · '+(e.kind==='road'?'camino':'senda'),e.id));
     });
     Object.values(saved.routes).filter(function(d){return !originalById.has(d.id);}).sort(function(a,b){return (a.updatedAt||'').localeCompare(b.updatedAt||'');}).forEach(function(d){
       g('existing').appendChild(mkOption('✎ NUEVO · '+city.get(d.from).name+' → '+city.get(d.to).name,d.id));
     });
     if(before&&g('existing').querySelector('option[value="'+before+'"]'))g('existing').value=before;
     else if(g('existing').options.length>1){state.selected=g('existing').options[1].value;g('existing').value=state.selected;}
     else state.selected='';
     displaySelection();
   }
   function notify(msg){g('message').textContent=msg;}
   function save(d){d.updatedAt=new Date().toISOString();saved.routes[d.id]=d;persist();state.selected=d.id;updateUI();}
   function ensureDraft(){
     var d=current();if(d)return d;
     var e=originalById.get(state.selected);if(!e){notify('Selecciona primero un tramo existente o crea uno nuevo.');return null;}
     d={id:e.id,from:e.from,to:e.to,kind:e.kind,hexPath:[],strokes:[],finished:false,checked:false,updatedAt:''};
     save(d);return d;
   }
   function status(){
     var d=current(),e=d||originalById.get(state.selected);
     if(!e){g('status').textContent='Selecciona una conexión para comenzar.';return;}
     var path=d?d.hexPath:[],errors=path.filter(function(c){return evidence.size&&!evidence.has(key(c));}).length;
     g('status').innerHTML='<strong>'+safeText(city.get(e.from).name)+' → '+safeText(city.get(e.to).name)+'</strong>'+
       '<span>'+(d&&d.finished?'Recorrido terminado':state.drawing?'Dibujando…':'Borrador editable')+' · '+Math.max(0,path.length-1)+' hexágonos · '+(d?d.strokes.length:0)+' pinceladas</span>'+
       (errors?'<span>'+errors+' hexágonos sin suelo detectado: comprobar puentes y cauces.</span>':'')+
       '<span>'+(Object.keys(saved.routes).length)+' camino(s) en tu colección local.</span>';
   }
   function paint(){
     drawingLayer.clearLayers();pointsLayer.clearLayers();var d=current();
     if(!d||!d.hexPath.length)return;
     L.polyline(d.hexPath.map(loc),{color:'#f1bc6e',weight:4.3,opacity:.95,interactive:false,className:'ae-mc-road'}).addTo(drawingLayer);
     var a=city.get(d.from),b=city.get(d.to);
     L.circleMarker(L.latLng(-a.y,a.x),{radius:6,color:'#f2dba2',fillColor:'#704b26',fillOpacity:1,weight:2,interactive:false}).addTo(pointsLayer);
     L.circleMarker(L.latLng(-b.y,b.x),{radius:6,color:'#f2dba2',fillColor:'#704b26',fillOpacity:1,weight:2,interactive:false}).addTo(pointsLayer);
     var last=d.hexPath[d.hexPath.length-1];
     L.circleMarker(loc(last),{radius:5,color:'#ffe7ad',fillColor:'#df8f40',fillOpacity:1,weight:2,interactive:false}).addTo(pointsLayer);
     d.strokes.forEach(function(index){var c=d.hexPath[Math.max(0,index-1)];if(c)L.circleMarker(loc(c),{radius:3,color:'#fbf0ce',fillColor:'#db8d4d',fillOpacity:1,weight:1,interactive:false}).addTo(pointsLayer);});
   }
   function updateUI(){
     var d=current();status();paint();
     g('finish').disabled=!d||!d.hexPath.length||d.finished;
     g('undo').disabled=!d||!d.strokes.length;
     g('clear').disabled=!d||!d.hexPath.length;
     g('delete').disabled=!d;
     g('reviewed').checked=!!(d&&d.checked);
     g('reviewed').disabled=!d;
     g('start').textContent=state.drawing?'Dibujando: pulsa sobre el mapa':'Empezar / continuar dibujo';
     g('pause').disabled=!state.drawing;
     g('status').classList.toggle('is-drawing',state.drawing);
   }
   function displaySelection(){
     state.drawing=false;
     var e=current()||originalById.get(state.selected);
     if(e){g('from').value=e.from;g('to').value=e.to;g('kind').value=e.kind;}
     updateUI();
   }
   function focusRoute(){
     var d=current();if(!d||!d.hexPath.length)return;
     if(d.hexPath.length===1)map.setView(loc(d.hexPath[0]),Math.max(map.getZoom(),.4));
     else map.fitBounds(L.latLngBounds(d.hexPath.map(loc)).pad(.2),{maxZoom:.65,padding:[32,32]});
   }
   function setActive(open){
     state.active=!!open;panel.hidden=!state.active;button.setAttribute('aria-pressed',String(state.active));
     button.classList.toggle('is-active',state.active);
     [drawingLayer,pointsLayer].forEach(function(l){if(state.active&&!map.hasLayer(l))l.addTo(map);else if(!state.active&&map.hasLayer(l))map.removeLayer(l);});
     if(state.active){
       // Avoid writing into the A* tracer and the original cartographer simultaneously.
       ['ae-toggle-trazador','ae-toggle-editor'].forEach(function(id){var other=document.getElementById(id);if(other&&other.getAttribute('aria-pressed')==='true')other.click();});
       map.invalidateSize({pan:false});updateUI();
     }else state.drawing=false;
   }
   function select(id){state.selected=id;g('existing').value=id;displaySelection();notify('Tramo seleccionado. Pulsa «Empezar / continuar dibujo».');}
   function newDraft(){
     var from=g('from').value,to=g('to').value,kind=g('kind').value;
     if(!city.has(from)||!city.has(to)||from===to){notify('Elige dos localidades diferentes.');return;}
     if(Object.keys(saved.routes).length>=MAX_ROUTES){notify('Has alcanzado el límite de 500 borradores; exporta el archivo antes de crear más.');return;}
     var id='manual-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*10000000).toString(36);
     save({id:id,from:from,to:to,kind:kind==='trail'?'trail':'road',hexPath:[],strokes:[],finished:false,checked:false,updatedAt:''});
     renderChoices();select(id);startDrawing();
   }
   function startDrawing(){
     var d=ensureDraft();if(!d)return;
     if(d.finished){
       if(!window.confirm('La ruta ya está terminada. ¿Quieres reabrirla para corregirla?'))return;
       d.finished=false;if(d.strokes.length){var n=d.strokes.pop();d.hexPath.length=n;}
       d.checked=false;
     }
     if(!d.hexPath.length){
       var from=city.get(d.from),start=atXY(from.x,from.y);
       if(!within(start)){notify('El origen queda fuera del mapa. Corrige la ubicación de la localidad.');return;}
       d.hexPath=[start];d.strokes=[];
     }
     state.drawing=true;save(d);paint();status();
     notify('Dibujo activado. Haz clic sobre los puntos del camino; cada clic seguirá exactamente los hexágonos elegidos.');
   }
   function appendCell(target,finishing){
     var d=current();if(!d||!state.drawing){notify('Pulsa primero «Empezar / continuar dibujo».');return false;}
     if(!within(target)){notify('El hexágono seleccionado está fuera de los límites del mapa.');return false;}
     var segment=line(d.hexPath[d.hexPath.length-1],target);
     if(!segment){notify('La pincelada es demasiado larga. Agrega puntos intermedios.');return false;}
     segment=segment.slice(1);
     if(!segment.length){
       if(finishing&&d.hexPath.length>1){d.finished=true;d.checked=false;state.drawing=false;save(d);return true;}
       notify('Ese hexágono ya es el último punto del camino.');return false;
     }
     if(d.hexPath.length+segment.length>MAX_CELLS){notify('Máximo 1.400 hexágonos por camino. Divide el trazado en varios tramos.');return false;}
     var unknown=segment.filter(function(c){return evidence.size&&!evidence.has(key(c));});
     if(unknown.length&&!state.waterOverride){
       notify('La pincelada cruza '+unknown.length+' hexágono(s) sin suelo detectado. Traza otro recorrido o activa la excepción para puentes y errores cartográficos.');
       return false;
     }
     if(!segment.every(within)){notify('La pincelada sale de los límites del mapa.');return false;}
     d.strokes.push(d.hexPath.length);
     d.hexPath.push.apply(d.hexPath,segment);
     d.finished=!!finishing;d.checked=false;
     if(finishing)state.drawing=false;
     save(d);
     return true;
   }
   function finishDrawing(){
     var d=current();if(!d||!d.hexPath.length){notify('Primero debes dibujar un camino.');return;}
     state.drawing=true;
     var p=city.get(d.to),dest=atXY(p.x,p.y),n=hexDistance(d.hexPath[d.hexPath.length-1],dest);
     if(n>6){notify('Faltan '+n+' hexágonos para la localidad de destino. Continúa dibujando hasta acercarte a seis hexágonos como máximo.');return;}
     if(appendCell(dest,true))notify('Camino terminado. Puedes marcarlo revisado y exportar el JSON.');
   }
   function undo(){
     var d=current();if(!d||!d.strokes.length){notify('No hay pinceladas para deshacer.');return;}
     d.hexPath.length=d.strokes.pop();d.finished=false;d.checked=false;
     state.drawing=true;save(d);notify('Última pincelada eliminada. Puedes seguir dibujando.');
   }
   function clear(){
     var d=current();if(!d||!d.hexPath.length||!window.confirm('¿Borrar el dibujo de esta conexión? Los demás caminos permanecerán guardados.'))return;
     d.hexPath=[];d.strokes=[];d.finished=false;d.checked=false;state.drawing=false;
     save(d);notify('Dibujo borrado. La conexión original sigue intacta.');
   }
   function removeDraft(){
     var d=current();if(!d||!window.confirm('¿Eliminar este borrador de dibujo? No cambia las conexiones publicadas.'))return;
     delete saved.routes[d.id];persist();state.selected='';renderChoices();notify('Borrador eliminado.'); 
   }
   function countInfo(){return {paths:Object.keys(saved.routes).length,finished:Object.values(saved.routes).filter(function(d){return d.finished;}).length};}
   function exportJSON(){
     var routes=Object.values(saved.routes).map(function(d){
       var from=city.get(d.from),to=city.get(d.to);
       return {id:d.id,existingConnection:originalById.has(d.id),from:d.from,fromName:from.name,to:d.to,toName:to.name,kind:d.kind,
         finished:d.finished,reviewedByAuthor:d.checked,hexagons:Math.max(0,d.hexPath.length-1),
         hexPath:d.hexPath.map(function(c){return c.slice();}),
         via:d.hexPath.slice(1,-1).map(function(c){var p=center(c);return {x:+p[0].toFixed(1),y:+p[1].toFixed(1)};}),
         unknownLandCells:d.hexPath.filter(function(c){return evidence.size&&!evidence.has(key(c));}).map(function(c){return c.slice();}),
         updatedAt:d.updatedAt};
     });
     if(!routes.length){notify('Todavía no hay dibujos que exportar.');return;}
     var output={schema:'aeternalis-caminos-manuales-v1',version:1,generatedAt:new Date().toISOString(),
       map:'Mapa_3.21(2).png',coordinateSystem:{width:W,height:HEIGHT,hexRadius:R,phaseX:0,phaseY:0},
       status:'borrador_para_revision',notice:'No se han modificado ni confirmado automáticamente las rutas publicadas. El autor compartirá este JSON para integrar los caminos al Atlas.',
       summary:countInfo(),routes:routes};
     var file=new Blob([JSON.stringify(output,null,2)],{type:'application/json;charset=utf-8'});
     var url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;
     a.download='Aeternalis_Caminos_Manuales_'+new Date().toISOString().slice(0,10)+'.json';
     document.body.appendChild(a);a.click();a.remove();
     setTimeout(function(){URL.revokeObjectURL(url);},1000);
     notify('Exportados '+routes.length+' caminos ('+countInfo().finished+' terminados). Envíame el archivo JSON y podré incorporarlos al Atlas.');
   }
   function importJSON(file){
     if(!file||file.size>5000000){notify('El JSON debe pesar menos de 5 MB.');return;}
     var reader=new FileReader();
     reader.onload=function(){
       try{
         var data=JSON.parse(String(reader.result));
         if(data.schema!=='aeternalis-caminos-manuales-v1'||!Array.isArray(data.routes))throw Error('Formato de caminos manuales incompatible.');
         if(data.routes.length>MAX_ROUTES)throw Error('Demasiados caminos.');
         var added=0;
         data.routes.forEach(function(r){
           if(!r||typeof r.id!=='string'||(!originalById.has(r.id)&&!/^manual-[a-zA-Z0-9-]+$/.test(r.id)))return;
           var clean=sanitize({id:r.id,from:r.from,to:r.to,kind:r.kind,hexPath:r.hexPath,strokes:[],finished:r.finished,checked:r.reviewedByAuthor,updatedAt:r.updatedAt});
           if(!clean||originalById.has(clean.id)&&(originalById.get(clean.id).from!==clean.from||originalById.get(clean.id).to!==clean.to))return;
           saved.routes[clean.id]=clean;added++;
         });
         persist();renderChoices();notify('Importados '+added+' caminos. Se han conservado también los demás dibujos locales.');
       }catch(e){notify('No se pudo importar: '+e.message);}
     };
     reader.readAsText(file);
   }
   button.addEventListener('click',function(){setActive(!state.active);});
   g('close').addEventListener('click',function(){setActive(false);button.focus();});
   g('existing').addEventListener('change',function(){select(g('existing').value);});
   g('new').addEventListener('click',newDraft);
   g('delete').addEventListener('click',removeDraft);
   g('start').addEventListener('click',startDrawing);
   g('finish').addEventListener('click',finishDrawing);
   g('undo').addEventListener('click',undo);
   g('clear').addEventListener('click',clear);
   g('pause').addEventListener('click',function(){state.drawing=false;updateUI();notify('Dibujo pausado. Puedes desplazarte por el mapa y luego reanudar.');});
   g('water').addEventListener('change',function(){state.waterOverride=g('water').checked;});
   g('reviewed').addEventListener('change',function(){var d=current();if(!d)return;d.checked=!!g('reviewed').checked;save(d);});
   g('export').addEventListener('click',exportJSON);
   g('import').addEventListener('click',function(){g('file').click();});
   g('file').addEventListener('change',function(){importJSON(g('file').files&&g('file').files[0]);g('file').value='';});
   map.on('click',function(ev){
     if(!state.active||!state.drawing)return;
     var at=atXY(ev.latlng.lng,-ev.latlng.lat);
     appendCell(at,false);
   });
   fetch(ROOT+'data/atlas/caminos-evidencia.json?v=1.2.0').then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
     .then(function(d){if(d.schema==='aeternalis-caminos-evidencia-v1'&&Array.isArray(d.cells)){
       d.cells.forEach(function(c){evidence.set(key(c),c);});notify('Malla terrestre cargada. Ya puedes seguir los caminos del mapa.');updateUI();
     }}).catch(function(e){notify('La máscara de suelo no está disponible. Se permite dibujar sin verificación automática de cruces.');console.warn('[Caminos manuales]',e);});
   renderChoices();setActive(false);
   window.__AETERNALIS_CAMINOS_MANUALES__={
     version:'1.2.0',
     getStatus:function(){return {selected:state.selected,active:state.active,drawing:state.drawing,...countInfo()};},
     getRoute:function(id){var d=saved.routes[id||state.selected];return d?JSON.parse(JSON.stringify(d)):null;},
     open:function(){setActive(true);}
   };
   if(new URLSearchParams(location.search).get('dibujar')==='1')setActive(true);
 }
})();
