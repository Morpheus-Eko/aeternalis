/* AETERNALIS · Carta Náutica para el Supermapa 2.0
   Capa Leaflet externa no invasiva. No altera las rutas terrestres.
   JS sólo lógica; CSS separado en css/supermapa-naval.css.
   Malla oriental recalculada sobre Mapa 3.3; ríos estrechos no son automáticamente navegables. */
(function () {
 'use strict';
 if(window.__AETERNALIS_SUPERMAPA_NAVAL_LOADER__) return;
 window.__AETERNALIS_SUPERMAPA_NAVAL_LOADER__=true;
 var BASE='https://morpheus-eko.github.io/aeternalis/';
 var VERSION='3.4.2';
 var MAX_WAIT=90;
 var retries=0;
 function loadJSON(file){return fetch(BASE+file+'?v='+VERSION,{credentials:'omit',mode:'cors'}).then(function(r){if(!r.ok)throw Error(file+': '+r.status);return r.json();});}
 function normalize(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
 function html(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function xy(latlng){return [latlng[0],latlng[1]];}
 function init(host) {
   if(window.__AETERNALIS_SUPERMAPA_NAVAL__)return;
   var L=window.L, map=host.map, D=host.data;
   if(!L||!map||!D)throw Error('Leaflet o Atlas no disponibles');
   var toolbar=document.querySelector('#aeternalis-atlas .ae-leaf-toolbar-actions');
   var viewport=document.getElementById('ae-map-viewport');
   if(!toolbar||!viewport)throw Error('Barra o mapa de Aeternalis no encontrados');
   Promise.all([
     loadJSON('data/atlas/naval/hexagonos-navegables.json'),
     loadJSON('data/atlas/naval/rutas-por-agua.json'),
     loadJSON('data/atlas/naval/zonas-maritimas.json'),
     loadJSON('data/atlas/naval/puertos.json'),
     loadJSON('data/atlas/naval/agua-mapa33-verdanteyl.json')
   ]).then(function(docs){
     var water=docs[0],routes=docs[1],zones=docs[2],nav=docs[3],patch=docs[4];
     if(water.schema!=='aeternalis-hex-agua-v1'||routes.schema!=='aeternalis-rutas-agua-v1'||zones.schema!=='aeternalis-zonas-maritimas-v1'||nav.schema!=='aeternalis-puertos-atlas-v1')throw Error('Datos navales incompatibles');
     var c=water.grid, R=c.radius, H=Math.sqrt(3)*R, steps=c.neighborDeltas;
     if(patch.schema!=='aeternalis-agua-mapa33-parche-v1'||Math.abs(patch.coordinateSystem.hexRadius-R)>.01||patch.coordinateSystem.width!==water.source.width||patch.coordinateSystem.height!==water.source.height)throw Error('El parche hídrico 3.3 no coincide con el Atlas');
     // Los puntos de río se dibujan en el mapa, pero no son automáticamente aguas navegables.
     var inside=function(n){var x=1.5*R*n[0],y=H*(n[1]+n[0]/2),b=patch.rect;return x>=b.xmin&&x<=b.xmax&&y>=b.ymin&&y<=b.ymax;};
     var waterNodes=new Map();
     water.cells.forEach(function(n){if(!inside(n))waterNodes.set(n[0]+','+n[1],n.slice());});
     var classified=0;
     patch.encoded.split(';').forEach(function(line){
       var pair=line.split(':'),q=parseInt(pair[0],36);
       pair[1].split(',').forEach(function(token){
         var shore=token.endsWith('s'),bits=(shore?token.slice(0,-1):token).split('.');
         var zigzag=parseInt(bits[0],36),lo=zigzag%2?-(zigzag+1)/2:zigzag/2,hi=lo+parseInt(bits[1],36);
         for(var r=lo;r<=hi;r++){var n=[q,r,shore?1:2,shore?50:90,0];if(!inside(n))throw Error('Hexágono fuera del ámbito revisado');waterNodes.set(q+','+r,n);classified++;}
       });
     });
     if(classified!==patch.statistics.hexes)throw Error('Número de hexágonos de Mapa 3.3 inconsistente');
     waterNodes.forEach(function(n){var mask=0;steps.forEach(function(d,i){if(waterNodes.has((n[0]+d[0])+','+(n[1]+d[1])))mask|=(1<<i);});n[4]=mask;});
     water.cells=Array.from(waterNodes.values());
     water.revision=patch.revision;water.source.filename=patch.sourceImage;water.source.sha256=patch.sourceSha256;water.source.method='Máscara 3.3 en el litoral oriental; cauces estrechos no autorizados para navegación de navíos.';
     var pinById=new Map(D.places.filter(function(p){return !p.atlasArchiveReason;}).map(function(p){return [p.id,p];}));
     var center=function(q,r){return [1.5*R*q,H*(r+q/2)];};
     // Reajustar el acceso de cada localidad a la celda de agua real más cercana.
     var anchorById=new Map(),waterPositions=water.cells.map(function(n){var p=center(n[0],n[1]);return [n,p[0],p[1]];});
     nav.ports.forEach(function(port){
       var place=pinById.get(port.id);if(!port.endpoint||!place)return;
       var nearest=null,d2=625.01;
       waterPositions.forEach(function(w){var dx=w[1]-place.x,dy=w[2]-place.y,dsq=dx*dx+dy*dy;if(dsq<d2){nearest=w[0];d2=dsq;}});
       if(nearest&&d2<=625)anchorById.set(port.id,{id:port.id,hex:[nearest[0],nearest[1]],snap_distance:+Math.sqrt(d2).toFixed(1),water_type:nearest[2],accessStatus:'litoral-verificable-en-mascara'});
     });
     var ports=nav.ports.filter(function(p){return p.endpoint&&anchorById.has(p.id);});
     var lookup=function(id){return pinById.get(id);};
     var placeLabel=function(id){var p=lookup(id);return p?p.name:id;};
     var coord=function(x,y){return L.latLng(-y,x);};
     var cellCoord=function(n){var v=center(n[0],n[1]);return coord(v[0],v[1]);};
     var state={active:false,showHex:false,showRegions:true,showNetwork:true,from:'place-017',to:'place-018',sails:1,route:null,region:null,inspect:false};
     var zonesLayer=L.layerGroup(),routeNetworkLayer=L.layerGroup(),routeLayer=L.layerGroup(),portLayer=L.layerGroup(),hexLayer=null;
     var portMarkers=new Map(),regionPolys=new Map();
     var button=document.createElement('button');button.type='button';button.id='ae-toggle-naval';button.textContent='⚓ Carta Náutica';button.setAttribute('aria-pressed','false');button.title='Puertos, rutas marítimas y regiones del océano';toolbar.appendChild(button);
     var panel=document.createElement('aside');panel.id='ae-supermapa-naval-panel';panel.className='ae-naval-panel';panel.hidden=true;panel.setAttribute('aria-label','Carta Náutica de Aeternalis');viewport.appendChild(panel);
     panel.innerHTML='<div class="ae-naval-head"><span class="ae-naval-kicker">ATLAS DE LOS MARES · AETERNALIS</span><button type="button" id="ae-naval-close" aria-label="Cerrar Carta Náutica">✕</button><h2>Carta Náutica</h2><p>Cartografía de puertos, corrientes y regiones marítimas.</p></div>'+
      '<div class="ae-naval-body"><section class="ae-naval-section"><h3>Itinerario marítimo</h3><label for="ae-naval-from">Escala o ribera de partida</label><select id="ae-naval-from"></select><label for="ae-naval-to">Escala o ribera de destino</label><select id="ae-naval-to"></select><label for="ae-naval-sails">Velas del navío</label><select id="ae-naval-sails"><option value="1">I · 24 h por hexágono</option><option value="2">II · 18 h por hexágono</option><option value="3">III · 12 h por hexágono</option><option value="4">Legendarias · 8 h por hexágono</option></select><button type="button" class="ae-naval-action" id="ae-naval-route">Trazar travesía</button><div class="ae-naval-result" id="ae-naval-result" aria-live="polite">Selecciona los puertos para consultar el rumbo.</div></section>'+
      '<section class="ae-naval-section"><h3>Capas náuticas</h3><label class="ae-naval-switch"><input type="checkbox" id="ae-naval-toggle-hex"> Hexágonos de agua</label><label class="ae-naval-switch"><input type="checkbox" id="ae-naval-toggle-network" checked> Corredores marítimos</label><label class="ae-naval-switch"><input type="checkbox" id="ae-naval-toggle-regions" checked> Regiones del mar</label></section>'+
      '<section class="ae-naval-section"><h3>Mares y regiones</h3><div id="ae-naval-region-list" class="ae-naval-region-list"></div><article id="ae-naval-region-detail" class="ae-naval-region-detail"><p>Selecciona una región para consultar sus mares, vientos y peligros.</p></article></section>'+
      '<p class="ae-naval-meta" id="ae-naval-metrics"></p></div>';
     var q=function(id){return document.getElementById(id);};
     var from=q('ae-naval-from'),to=q('ae-naval-to'),sails=q('ae-naval-sails'),result=q('ae-naval-result');
     function portOption(p){var v=document.createElement('option');v.value=p.id;v.textContent=placeLabel(p.id);return v;}
     ports.slice().sort(function(a,b){return placeLabel(a.id).localeCompare(placeLabel(b.id),'es');}).forEach(function(p){from.appendChild(portOption(p));to.appendChild(portOption(p));});
     if(!anchorById.has(state.from))state.from=ports[0]?ports[0].id:'';
     if(!anchorById.has(state.to))state.to=ports[1]?ports[1].id:state.from;
     from.value=state.from;to.value=state.to;
     q('ae-naval-metrics').textContent=water.cells.length.toLocaleString('es-CL')+' hexágonos de agua · Los corredores se preparan al abrir la Carta Náutica.';
     function setVisible(){
       panel.hidden=!state.active;button.setAttribute('aria-pressed',String(state.active));button.classList.toggle('is-active',state.active);
       var ops=[[zonesLayer,state.showRegions],[routeNetworkLayer,state.showNetwork],[routeLayer,true],[portLayer,true]];
       ops.forEach(function(p){if(state.active&&p[1]){if(!map.hasLayer(p[0]))p[0].addTo(map)}else{if(map.hasLayer(p[0]))map.removeLayer(p[0]);}});
       if(state.active&&state.showHex){if(!hexLayer)hexLayer=makeHexOverlay();if(!map.hasLayer(hexLayer))hexLayer.addTo(map);}
       else if(hexLayer&&map.hasLayer(hexLayer))map.removeLayer(hexLayer);
       if(state.active){map.invalidateSize({pan:false});}
     }
     button.addEventListener('click',function(){state.active=!state.active;setVisible();if(state.active)ensureSeaCorridors();});
     q('ae-naval-close').addEventListener('click',function(){state.active=false;setVisible();button.focus();});
     function makeHexOverlay(){
       var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg'),sea=document.createElementNS(NS,'path'),shore=document.createElementNS(NS,'path'),seaD=[],shoreD=[];
       svg.setAttribute('viewBox','0 0 '+water.source.width+' '+water.source.height);
       svg.setAttribute('width',String(water.source.width));svg.setAttribute('height',String(water.source.height));
       water.cells.forEach(function(n){var v=center(n[0],n[1]),parts=[];
         for(var i=0;i<6;i++){var theta=Math.PI/3*i,x=v[0]+R*Math.cos(theta),y=v[1]+R*Math.sin(theta);parts.push((i?'L':'M')+x.toFixed(1)+','+y.toFixed(1));}
         (n[2]===2?seaD:shoreD).push(parts.join('')+'Z');
       });
       sea.setAttribute('d',seaD.join(''));sea.setAttribute('class','ae-naval-hex-open');
       shore.setAttribute('d',shoreD.join(''));shore.setAttribute('class','ae-naval-hex-shore');
       svg.appendChild(sea);svg.appendChild(shore);
       return L.svgOverlay(svg,L.latLngBounds([-water.source.height,0],[0,water.source.width]),{interactive:false,className:'ae-naval-hex-overlay'});
     }
     function plotZones(){
       zones.regions.forEach(function(z){var pts=z.points.map(function(v){return coord(v[0],v[1]);});
         var p=L.polygon(pts,{className:'ae-naval-zone ae-naval-zone-'+z.id,color:z.color,weight:1.8,opacity:.9,fillColor:z.color,fillOpacity:.10});
         p.bindTooltip(z.name,{sticky:true});p.on('click',function(e){L.DomEvent.stopPropagation(e);selectRegion(z.id,true);});
         p.addTo(zonesLayer);regionPolys.set(z.id,p);
         var btn=document.createElement('button');btn.type='button';btn.textContent=z.name;btn.dataset.region=z.id;q('ae-naval-region-list').appendChild(btn);
       });
     }
     function selectRegion(id,move){
       var z=zones.regions.find(function(x){return x.id===id;});if(!z)return;
       state.region=id;
       regionPolys.forEach(function(p,key){p.setStyle({fillOpacity:key===id?.22:.10,weight:key===id?3.2:1.8});});
       q('ae-naval-region-list').querySelectorAll('button').forEach(function(b){b.classList.toggle('is-active',b.dataset.region===id);});
       var w=z.weather||{};
       var detail=q('ae-naval-region-detail');
       detail.innerHTML='<h4>'+html(z.name)+'</h4><p>'+html(z.description)+'</p><dl>'+
         [['Vientos',w.wind],['Oleaje',w.waves],['Corrientes',w.currents],['Visibilidad',w.visibility],['Peligros',w.dangers]].map(function(row){return '<div><dt>'+html(row[0])+'</dt><dd>'+html(row[1]||'—')+'</dd></div>';}).join('')+'</dl>';
       if(!state.active){state.active=true;setVisible();}
       if(move&&regionPolys.has(id))map.fitBounds(regionPolys.get(id).getBounds(),{maxZoom:.45,padding:[40,40]});
     }
     q('ae-naval-region-list').addEventListener('click',function(e){var b=e.target.closest('button[data-region]');if(b)selectRegion(b.dataset.region,true);});
     function drawNetwork(){
       routes.routes.forEach(function(route){
         var points=route.waypoints.map(function(x){return coord(x[0],x[1]);});
         var line=L.polyline(points,{color:'#81bad3',weight:2.0,opacity:.56,dashArray:'6 7',interactive:true,className:'ae-naval-route-network'});
         line.bindTooltip(placeLabel(route.from)+' — '+placeLabel(route.to)+' · '+route.hexes+' hex.');
         line.on('click',function(){from.value=route.from;to.value=route.to;plotRoute();});
         line.addTo(routeNetworkLayer);
       });
     }
     var chooseOriginNext=true;
     function drawPorts(){
       ports.forEach(function(p){var place=lookup(p.id);if(!place)return;
         var m=L.circleMarker(coord(place.x,place.y),{radius:5,color:'#edc890',fillColor:'#9a7140',fillOpacity:.85,weight:2,className:'ae-naval-port'});
         m.bindTooltip(place.name,{direction:'top'});
         m.on('click',function(){if(chooseOriginNext){from.value=p.id;state.from=p.id;result.textContent='Selecciona el puerto de destino.';}else{to.value=p.id;state.to=p.id;if(from.value!==to.value)plotRoute();}chooseOriginNext=!chooseOriginNext;});
         m.addTo(portLayer);portMarkers.set(p.id,m);
       });
     }
     function distance(a,b){var dq=a[0]-b[0],dr=a[1]-b[1];return Math.max(Math.abs(dq),Math.abs(dr),Math.abs(dq+dr));}
     // Binary heap for A*: avoids O(N^2) scans over the 5,500+ water cells.
     function Heap(){this.a=[];}
     Heap.prototype.push=function(p){var a=this.a;a.push(p);var i=a.length-1;while(i){var j=(i-1)>>1;if(a[j][0]<=p[0])break;a[i]=a[j];i=j;}a[i]=p;};
     Heap.prototype.pop=function(){var a=this.a,top=a[0],p=a.pop();if(a.length){var i=0;while(true){var j=i*2+1;if(j>=a.length)break;if(j+1<a.length&&a[j+1][0]<a[j][0])j++;if(p[0]<=a[j][0])break;a[i]=a[j];i=j;}a[i]=p;}return top;};
     Heap.prototype.size=function(){return this.a.length;};
     function findPath(fromId,toId){
       var a=anchorById.get(fromId),b=anchorById.get(toId);
       if(!a||!b)return null;
       var start=a.hex.join(','),goal=b.hex.join(',');if(!waterNodes.has(start)||!waterNodes.has(goal))return null;
       var queue=new Heap(),parent=new Map(),cost=new Map(),closed=new Set();parent.set(start,null);cost.set(start,0);queue.push([distance(a.hex,b.hex),0,start]);
       while(queue.size()){
         var item=queue.pop(),id=item[2],g=item[1];if(closed.has(id))continue;closed.add(id);
         if(id===goal){var route=[],n=id;while(n!==null){route.push(waterNodes.get(n));n=parent.get(n);}return route.reverse();}
         var node=waterNodes.get(id);if(!node)continue;
         for(var i=0;i<steps.length;i++){
           if(!(node[4]&(1<<i)))continue;
           var x=node[0]+steps[i][0],y=node[1]+steps[i][1],key=x+','+y,nxt=waterNodes.get(key);
           if(!nxt||closed.has(key))continue;
           var weight=1+(100-nxt[3])/155+(nxt[2]===1?.17:0),newCost=g+weight;
           if(newCost< (cost.has(key)?cost.get(key):Infinity)){
             cost.set(key,newCost);parent.set(key,id);queue.push([newCost+distance([x,y],b.hex),newCost,key]);
           }
         }
       }
       return null;
     }
     var networkRequested=false;
      function ensureSeaCorridors(){
        if(networkRequested)return;
        networkRequested=true;
        rebuildSeaCorridors();
      }
      function rebuildSeaCorridors(){
       // No reutilizar como dibujo ninguna ruta sobre un hexágono terrestre.
       var prior=routes.routes.slice(),valid=[],excluded=0,index=0;
       function batch(){
         for(var k=0;k<4&&index<prior.length;k++,index++){
           var old=prior[index],a=anchorById.get(old.from),b=anchorById.get(old.to);
           if(!a||!b){excluded++;continue;}
           var cells=findPath(old.from,old.to),straight=distance(a.hex,b.hex);
           if(!cells||cells.length<2||cells.length-1>Math.max(25,3*straight+15)){excluded++;continue;}
           var points=cells.filter(function(n,i){return i===0||i===cells.length-1||i%3===0;}).map(function(n){var xy=center(n[0],n[1]);return [Number(xy[0].toFixed(1)),Number(xy[1].toFixed(1))];});
           valid.push(Object.assign({},old,{waypoints:points,hexes:cells.length-1,status:'trazado_recalculado_mascara_mapa33',qa:Object.assign({},old.qa||{},{source3_3Verified:'sector_oriental',maskRevision:patch.revision})}));
         }
         if(index<prior.length){setTimeout(batch,0);return;}
         routes.routes=valid;drawNetwork();
         q('ae-naval-metrics').textContent=water.cells.length.toLocaleString('es-CL')+' hexágonos acuáticos · '+ports.length+' escalas accesibles · '+valid.length+' corredores ('+excluded+' no verificables excluidos).';
         console.info('[Aeternalis/Naval v3.4]',{waterHexes:water.cells.length,ports:ports.length,routes:valid.length,excluded:excluded});
       }
       batch();
     }
     function plotRoute(){
       var first=from.value,last=to.value;state.from=first;state.to=last;state.sails=Number(sails.value)||1;
       routeLayer.clearLayers();
       if(!first||!last||first===last){result.textContent='Selecciona dos puertos diferentes.';return;}
       var path=findPath(first,last);if(!path){result.textContent='No se encontró continuidad marítima entre esos puertos.';return;}
       var latlngs=path.map(cellCoord);
       L.polyline(latlngs,{color:'#eec389',weight:4.5,opacity:.95,className:'ae-naval-route-selected'}).addTo(routeLayer);
       var start=lookup(first),end=lookup(last),accessFrom=anchorById.get(first),accessTo=anchorById.get(last);
        // No dibujar accesos fluviales por tierra si el origen queda lejos de la máscara de agua.
        if(start&&accessFrom&&accessFrom.snap_distance<=25)L.polyline([coord(start.x,start.y),latlngs[0]],{color:'#d7ae72',weight:2,dashArray:'3 5',opacity:.7,interactive:false}).addTo(routeLayer);
        if(end&&accessTo&&accessTo.snap_distance<=25)L.polyline([latlngs[latlngs.length-1],coord(end.x,end.y)],{color:'#d7ae72',weight:2,dashArray:'3 5',opacity:.7,interactive:false}).addTo(routeLayer);
        var hexes=path.length-1,hours=hexes*[24,18,12,8][state.sails-1];
       var pendingAccess=!!((accessFrom&&accessFrom.snap_distance>25)||(accessTo&&accessTo.snap_distance>25));
        result.innerHTML='<strong>'+html(placeLabel(first))+' → '+html(placeLabel(last))+'</strong><span>'+hexes.toLocaleString('es-CL')+' hexágonos sobre red preliminar</span><span>'+hours.toLocaleString('es-CL')+' horas · '+(hours/24).toLocaleString('es-CL',{maximumFractionDigits:2})+' días estimados</span>'+(pendingAccess?'<p class="ae-naval-access-warning">Acceso fluvial aún no verificado entre la localidad y la red oceánica. El tiempo no incluye ese tramo; no se dibuja una línea sobre tierra.</p>':'<p class="ae-naval-access-warning">Ruta provisional sobre agua cartografiada en Mapa 3.3 (sector oriental). Los cauces interiores aún requieren verificación de navegabilidad.</p>');
        state.route={from:first,to:last,hexes:hexes,hours:hours,points:path.length};
       if(!state.active){state.active=true;setVisible();}
       var fit=L.latLngBounds(latlngs);
       map.fitBounds(fit.pad(.15),{maxZoom:.6,padding:[38,38]});
     }
     from.addEventListener('change',function(){state.from=from.value;});
     to.addEventListener('change',function(){state.to=to.value;});
     sails.addEventListener('change',function(){state.sails=Number(sails.value)||1;if(state.route)plotRoute();});
     q('ae-naval-route').addEventListener('click',plotRoute);
     q('ae-naval-toggle-hex').addEventListener('change',function(e){state.showHex=e.target.checked;setVisible();});
     q('ae-naval-toggle-regions').addEventListener('change',function(e){state.showRegions=e.target.checked;setVisible();});
     q('ae-naval-toggle-network').addEventListener('change',function(e){state.showNetwork=e.target.checked;setVisible();});
     plotZones();drawPorts();setVisible();
     // Public API for other modules, deliberately read-only for region and water data.
     window.__AETERNALIS_SUPERMAPA_NAVAL__={version:VERSION,map:map,toggle:function(){button.click();},getState:function(){return Object.assign({},state);},getSummary:function(){return {hexagons:water.cells.length,regions:zones.regions.length,connections:routes.routes.length,ports:ports.length};}};
     // Optional deep-link: ?naval=1 opens the maritime chart directly.
     if(new URLSearchParams(window.location.search).get('naval')==='1'){state.active=true;setVisible();ensureSeaCorridors();}
   }).catch(function(err){console.error('[Supermapa Naval]',err);window.__AETERNALIS_SUPERMAPA_NAVAL_LOADER__=false;});
 }
 function waitForHost(){
   var api=window.__AE_ATLAS_LEAFLET_DEBUG__;
   if(api&&api.map&&api.data&&window.L){clearInterval(timer);try{init(api);}catch(e){console.error('[Supermapa Naval]',e);}return;}
   if(++retries>MAX_WAIT){clearInterval(timer);console.warn('[Supermapa Naval] Atlas no disponible.');window.__AETERNALIS_SUPERMAPA_NAVAL_LOADER__=false;}
 }
 var timer=setInterval(waitForHost,350);waitForHost();
})();