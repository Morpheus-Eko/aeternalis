/* AETERNALIS · Carta Náutica para el Supermapa 2.0
   Capa Leaflet externa no invasiva. No altera las rutas terrestres.
   JS sólo lógica; CSS separado en css/supermapa-naval.css.
   Agua roja de Nelson 1.1: hexágonos de mar separados de lagos y cauces. */
(function () {
 'use strict';
 if(window.__AETERNALIS_SUPERMAPA_NAVAL_LOADER__) return;
 window.__AETERNALIS_SUPERMAPA_NAVAL_LOADER__=true;
 var BASE='https://morpheus-eko.github.io/aeternalis/';
 var VERSION='3.8.0';
 var MAX_WAIT=90;
 var retries=0;
 function loadJSON(file){return fetch(BASE+file+'?v='+VERSION,{credentials:'omit',mode:'cors'}).then(function(r){if(!r.ok)throw Error(file+': '+r.status);return r.json();});}
 function normalize(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
 function html(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function xy(latlng){return [latlng[0],latlng[1]];}
 function decodeRedWater(packed){
    if(typeof DecompressionStream!=='function')return Promise.reject(new Error('El navegador no admite descompresión de datos cartográficos'));
    var binary=atob(packed),arr=new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++)arr[i]=binary.charCodeAt(i);
    return new Response(new Blob([arr]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer().then(function(b){return new Uint8Array(b);});
 }
 function init(host) {
   if(window.__AETERNALIS_SUPERMAPA_NAVAL__)return;
   var L=window.L, map=host.map, D=host.data;
   if(!L||!map||!D)throw Error('Leaflet o Atlas no disponibles');
   var toolbar=document.querySelector('#aeternalis-atlas .ae-leaf-toolbar-actions');
   var viewport=document.getElementById('ae-map-viewport');
   if(!toolbar||!viewport)throw Error('Barra o mapa de Aeternalis no encontrados');
   Promise.all([
     loadJSON('data/atlas/naval/agua-roja-nelson-1-1.json'),
     loadJSON('data/atlas/naval/rutas-por-agua.json'),
     loadJSON('data/atlas/naval/zonas-maritimas.json'),
     loadJSON('data/atlas/naval/puertos.json'),
     loadJSON('data/atlas/naval/red-fluvial-declarada-v01.json'),
     loadJSON('data/atlas/naval/politica-corredores-cercanos-v01.json'),
     loadJSON('data/atlas/naval/cauces-verificados-kargast-v01.json')
   ]).then(async function(docs){
     var source=docs[0],routes=docs[1],zones=docs[2],nav=docs[3],fluvial=docs[4],localPolicy=docs[5],riverRaster=docs[6];
     if(source.schema!=='aeternalis-agua-roja-nelson-v1'||routes.schema!=='aeternalis-rutas-agua-v1'||zones.schema!=='aeternalis-zonas-maritimas-v1'||nav.schema!=='aeternalis-puertos-atlas-v1'||fluvial.schema!=='aeternalis-red-fluvial-declarada-v1'||localPolicy.schema!=='aeternalis-politica-corredores-cercanos-v1'||riverRaster.schema!=='aeternalis-cauces-verificados-v1')throw Error('Datos náuticos Nelson incompatibles');
     var c=source.grid,R=c.radius,H=Math.sqrt(3)*R,steps=source.encoding.navBitOrder;
     if(source.source.width!==2048||source.source.height!==1571||Math.abs(R-9.3333)>.01)throw Error('La máscara roja no coincide con el Atlas');
     var decoded=await decodeRedWater(source.packed);
     if(decoded.length!==source.stats.rawByteCount)throw Error('Datos rojos truncados');
     var typeBytes=Math.ceil(source.stats.gridCells/4),maskBytes=decoded.subarray(typeBytes);
     var waterNodes=new Map(),surfaceWater=[],navInOrder=[],cellIndex=0,deep=0,shores=0,interior=0;
     for(var q0=c.qMin;q0<=c.qMax;q0++){
       // q=2 produce 27.9999 px, por ello se admite tolerancia de 0.02 px.
       var x0=1.5*R*q0;if(x0<c.minX-.02||x0>c.maxX+.02)continue;
       var startR=Math.ceil(c.minY/H-q0/2),endR=Math.floor(c.maxY/H-q0/2);
       for(var r0=startR;r0<=endR;r0++){
         var type=(decoded[cellIndex>>2]>>((cellIndex%4)*2))&3;cellIndex++;
         if(type===1||type===2){
           var n=[q0,r0,type,type===2?95:62,0];
           waterNodes.set(q0+','+r0,n);navInOrder.push(n);
           if(type===2)deep++;else shores++;
         }else if(type===3){interior++;surfaceWater.push([q0,r0,3,35,0]);}
       }
     }
     if(cellIndex!==source.stats.gridCells||deep!==source.stats.deepSea||shores!==source.stats.coastalNavigable||interior!==source.stats.otherRedWater||navInOrder.length!==source.stats.shipCells)throw Error('La máscara roja no coincide con sus contadores');
     for(var ni=0;ni<navInOrder.length;ni++){
       var mask=0,offset=ni*6;
       for(var bit=0;bit<6;bit++){var pos=offset+bit;if(maskBytes[pos>>3]&(1<<(pos%8)))mask|=1<<bit;}
       navInOrder[ni][4]=mask;
       for(var bi=0;bi<steps.length;bi++)if(mask&(1<<bi)){
         var node=navInOrder[ni],adj=(node[0]+steps[bi][0])+','+(node[1]+steps[bi][1]);
         if(!waterNodes.has(adj))throw Error('Enlace marítimo sobre tierra en '+node[0]+','+node[1]);
       }
     }
     var water={grid:{radius:R,neighborDeltas:steps},source:source.source,cells:navInOrder,revision:source.revision};
     var referenceRoutes=routes.routes.slice();
     routes.routes=[]; // Rutas antiguas sólo se muestran tras recalcularse sobre agua roja.
     var pinById=new Map(D.places.filter(function(p){return !p.atlasArchiveReason;}).map(function(p){return [p.id,p];}));
     var portById=new Map(nav.ports.map(function(p){return [p.id,p];}));
     var riverSiteById=new Map(fluvial.sites.map(function(p){return [p.id,p];}));
     var verifiedRiverGraph=new Map();
     var verifiedRiverSegments=riverRaster.riverSegments||[];
     var riverOutlet=(riverRaster.seaOutlets||[]).find(function(x){return x.from==='place-014';})||null;
     function attachRiverSegment(id,edge,reverse){
       if(!verifiedRiverGraph.has(id))verifiedRiverGraph.set(id,[]);
       verifiedRiverGraph.get(id).push({edge:edge,reverse:reverse});
     }
     verifiedRiverSegments.forEach(function(e){
       if(!Array.isArray(e.waypoints)||e.waypoints.length<2||
         !pinById.has(e.from)||!pinById.has(e.to))throw Error('Cauce fluvial incompatible con el Atlas: '+e.id);
       var a=pinById.get(e.from),b=pinById.get(e.to),first=e.waypoints[0],last=e.waypoints[e.waypoints.length-1];
       if(Math.hypot(a.x-first[0],a.y-first[1])>4||
          Math.hypot(b.x-last[0],b.y-last[1])>4)throw Error('Cauce rojo no termina en la localidad correspondiente: '+e.id);
       attachRiverSegment(e.from,e,false);attachRiverSegment(e.to,e,true);
     });
     function verifiedRiverPath(start,end){
       if(!verifiedRiverGraph.has(start)||!verifiedRiverGraph.has(end))return null;
       var queue=[{node:start,legs:[]}],seen=new Set([start]);
       while(queue.length){
         var cur=queue.shift();
         if(cur.node===end){
           var points=[];
           cur.legs.forEach(function(leg,i){
             var segment=leg.reverse?leg.edge.waypoints.slice().reverse():leg.edge.waypoints;
             if(i)segment=segment.slice(1);
             Array.prototype.push.apply(points,segment);
           });
           return {from:start,to:end,waypoints:points,legs:cur.legs.length};
         }
         (verifiedRiverGraph.get(cur.node)||[]).forEach(function(e){
           var next=e.reverse?e.edge.from:e.edge.to;
           if(!seen.has(next)){seen.add(next);queue.push({node:next,legs:cur.legs.concat([e])});}
         });
       }
       return null;
     }
     function riverLengthPixels(pts){var length=0;
       for(var i=1;i<pts.length;i++)length+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
       return length;
     }
     var basinBySite=new Map();
     fluvial.basins.forEach(function(b){b.sites.forEach(function(id){
       if(!basinBySite.has(id))basinBySite.set(id,[]);
       basinBySite.get(id).push(b);
     });});
     function declaredRiverLink(a,b){
       return fluvial.directLinks.find(function(e){return (e.from===a&&e.to===b)||(e.from===b&&e.to===a);})||null;
     }
     function sharedFluvialBasin(a,b){
       var left=basinBySite.get(a)||[],right=basinBySite.get(b)||[];
       return left.find(function(x){return right.some(function(y){return y.id===x.id;});})||null;
     }
     var center=function(q,r){return [1.5*R*q,H*(r+q/2)];};
     // Reajustar el acceso de cada localidad a la celda de agua real más cercana.
     var anchorById=new Map(),waterPositions=water.cells.map(function(n){var p=center(n[0],n[1]);return [n,p[0],p[1]];});
     nav.ports.forEach(function(port){
       var place=pinById.get(port.id);if(!port.endpoint||!place)return;
       var nearest=null,d2=625.01;
       waterPositions.forEach(function(w){var dx=w[1]-place.x,dy=w[2]-place.y,dsq=dx*dx+dy*dy;if(dsq<d2){nearest=w[0];d2=dsq;}});
       if(nearest&&d2<=625)anchorById.set(port.id,{id:port.id,hex:[nearest[0],nearest[1]],snap_distance:+Math.sqrt(d2).toFixed(1),water_type:nearest[2],accessStatus:'litoral-verificable-en-mascara'});
     });
     // Mostrar escalas fluviales aunque su río aún no alcance una celda de mar.
     // Las localidades sin coordenadas solo aparecen en el selector, no en el mapa.
     // Faro Durgath ocupa el río junto a su desembocadura; solo conectarlo
     // a mar abierto mediante el tramo rojo georreferenciado.
     if(riverOutlet){
       var seaHex=riverOutlet.suggestedSeaHex,seaCell=waterNodes.get(seaHex.join(','));
       if(seaCell){
         var seaPoint=center(seaCell[0],seaCell[1]),mouthTip=riverOutlet.waypoints[riverOutlet.waypoints.length-1];
         if(Math.hypot(seaPoint[0]-mouthTip[0],seaPoint[1]-mouthTip[1])<=5){
           anchorById.set('place-014',{id:'place-014',hex:[seaCell[0],seaCell[1]],
             snap_distance:0,water_type:seaCell[2],accessStatus:'desembocadura_roja_verificada'});
         }
       }
     }
     var ports=nav.ports.filter(function(p){return p.endpoint&&(pinById.has(p.id)||riverSiteById.has(p.id));});
     var policy=localPolicy.parameters;
     function hasOpenSeaAccess(id){
       var a=anchorById.get(id),p=portById.get(id);
       if(!a||a.snap_distance>10||!p)return false;
       return !(p.fluvialConnection&&p.role==='ribera'&&!p.seaOutlet);
     }
     var maritimePorts=ports.filter(function(p){return hasOpenSeaAccess(p.id);});
     var lookup=function(id){return pinById.get(id)||null;};
     var placeLabel=function(id){
       var p=lookup(id)||portById.get(id)||riverSiteById.get(id);
       return p?p.name:id;
     };
     var coord=function(x,y){return L.latLng(-y,x);};
     var cellCoord=function(n){var v=center(n[0],n[1]);return coord(v[0],v[1]);};
     var state={active:false,showHex:false,showRegions:true,showNetwork:true,from:'place-017',to:'place-018',sails:1,route:null,region:null,inspect:false};
     var zonesLayer=L.layerGroup(),routeNetworkLayer=L.layerGroup(),riverNetworkLayer=L.layerGroup(),routeLayer=L.layerGroup(),portLayer=L.layerGroup(),hexLayer=null;
     var portMarkers=new Map(),regionPolys=new Map();
     var button=document.createElement('button');button.type='button';button.id='ae-toggle-naval';button.textContent='⚓ Carta Náutica';button.setAttribute('aria-pressed','false');button.title='Puertos, ríos navegables, rutas marítimas y regiones del océano';toolbar.appendChild(button);
     var panel=document.createElement('aside');panel.id='ae-supermapa-naval-panel';panel.className='ae-naval-panel';panel.hidden=true;panel.setAttribute('aria-label','Carta Náutica de Aeternalis');viewport.appendChild(panel);
     panel.innerHTML='<div class="ae-naval-head"><span class="ae-naval-kicker">ATLAS DE LOS MARES · AETERNALIS</span><button type="button" id="ae-naval-close" aria-label="Cerrar Carta Náutica">✕</button><h2>Carta Náutica</h2><p>Cartografía de puertos, corrientes y regiones marítimas.</p></div>'+
      '<div class="ae-naval-body"><section class="ae-naval-section"><h3>Itinerario marítimo y fluvial</h3><label for="ae-naval-from">Escala o ribera de partida</label><select id="ae-naval-from"></select><label for="ae-naval-to">Escala o ribera de destino</label><select id="ae-naval-to"></select><label for="ae-naval-sails">Velas del navío</label><select id="ae-naval-sails"><option value="1">I · 24 h por hexágono</option><option value="2">II · 18 h por hexágono</option><option value="3">III · 12 h por hexágono</option><option value="4">Legendarias · 8 h por hexágono</option></select><button type="button" class="ae-naval-action" id="ae-naval-route">Trazar travesía</button><div class="ae-naval-result" id="ae-naval-result" aria-live="polite">Selecciona los puertos para consultar el rumbo.</div></section>'+
      '<section class="ae-naval-section"><h3>Puertos próximos</h3><div id="ae-naval-nearby" class="ae-naval-nearby"><p>Las conexiones cercanas se calculan al abrir la carta.</p></div></section>'+ 
      '<section class="ae-naval-section"><h3>Capas náuticas</h3><label class="ae-naval-switch"><input type="checkbox" id="ae-naval-toggle-hex"> Hexágonos de agua</label><label class="ae-naval-switch"><input type="checkbox" id="ae-naval-toggle-network" checked> Corredores marítimos y ríos</label><label class="ae-naval-switch"><input type="checkbox" id="ae-naval-toggle-regions" checked> Regiones del mar</label></section>'+
      '<section class="ae-naval-section"><h3>Mares y regiones</h3><div id="ae-naval-region-list" class="ae-naval-region-list"></div><article id="ae-naval-region-detail" class="ae-naval-region-detail"><p>Selecciona una región para consultar sus mares, vientos y peligros.</p></article></section>'+
      '<p class="ae-naval-meta" id="ae-naval-metrics"></p></div>';
     var q=function(id){return document.getElementById(id);};
     var from=q('ae-naval-from'),to=q('ae-naval-to'),sails=q('ae-naval-sails'),result=q('ae-naval-result');
     function portOption(p){
       var v=document.createElement('option');v.value=p.id;
       v.textContent=placeLabel(p.id)+(p.fluvialConnection?' · río':'')+(!lookup(p.id)?' · sin ubicar':'');
       return v;
     }
     ports.slice().sort(function(a,b){return placeLabel(a.id).localeCompare(placeLabel(b.id),'es');}).forEach(function(p){from.appendChild(portOption(p));to.appendChild(portOption(p));});
     if(!ports.some(function(p){return p.id===state.from;}))state.from=ports[0]?ports[0].id:'';
     if(!ports.some(function(p){return p.id===state.to;}))state.to=ports[1]?ports[1].id:state.from;
     from.value=state.from;to.value=state.to;
     q('ae-naval-metrics').textContent=water.cells.length.toLocaleString('es-CL')+' hexágonos marinos · '+surfaceWater.length.toLocaleString('es-CL')+' otras aguas · Corredores en preparación.';
     function setVisible(){
       panel.hidden=!state.active;button.setAttribute('aria-pressed',String(state.active));button.classList.toggle('is-active',state.active);
       var ops=[[zonesLayer,state.showRegions],[routeNetworkLayer,state.showNetwork],[riverNetworkLayer,state.showNetwork],[routeLayer,true],[portLayer,true]];
       ops.forEach(function(p){if(state.active&&p[1]){if(!map.hasLayer(p[0]))p[0].addTo(map)}else{if(map.hasLayer(p[0]))map.removeLayer(p[0]);}});
       if(state.active&&state.showHex){if(!hexLayer)hexLayer=makeHexOverlay();if(!map.hasLayer(hexLayer))hexLayer.addTo(map);}
       else if(hexLayer&&map.hasLayer(hexLayer))map.removeLayer(hexLayer);
       if(state.active){map.invalidateSize({pan:false});}
     }
     button.addEventListener('click',function(){state.active=!state.active;setVisible();if(state.active)ensureSeaCorridors();});
     q('ae-naval-close').addEventListener('click',function(){state.active=false;setVisible();button.focus();});
     function makeHexOverlay(){
       var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg'),sea=document.createElementNS(NS,'path'),shore=document.createElementNS(NS,'path'),inland=document.createElementNS(NS,'path');
       var seaD=[],shoreD=[],inlandD=[];
       svg.setAttribute('viewBox','0 0 '+water.source.width+' '+water.source.height);
       svg.setAttribute('width',String(water.source.width));svg.setAttribute('height',String(water.source.height));
       water.cells.concat(surfaceWater).forEach(function(n){
         var v=center(n[0],n[1]),parts=[];
         for(var i=0;i<6;i++){var theta=Math.PI/3*i,x=v[0]+R*Math.cos(theta),y=v[1]+R*Math.sin(theta);parts.push((i?'L':'M')+x.toFixed(1)+','+y.toFixed(1));}
         (n[2]===2?seaD:n[2]===1?shoreD:inlandD).push(parts.join('')+'Z');
       });
       sea.setAttribute('d',seaD.join(''));sea.setAttribute('class','ae-naval-hex-open');
       shore.setAttribute('d',shoreD.join(''));shore.setAttribute('class','ae-naval-hex-shore');
       inland.setAttribute('d',inlandD.join(''));inland.setAttribute('class','ae-naval-hex-inland');
       svg.appendChild(sea);svg.appendChild(shore);svg.appendChild(inland);
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
       routeNetworkLayer.clearLayers();
       routes.routes.forEach(function(route){
         var points=route.waypoints.map(function(x){return coord(x[0],x[1]);});
         var line=L.polyline(points,{color:'#81bad3',weight:2.0,opacity:.56,dashArray:'6 7',interactive:true,className:'ae-naval-route-network'});
         line.bindTooltip(placeLabel(route.from)+' — '+placeLabel(route.to)+' · conexión costera cercana · '+route.hexes+' hex.');
         line.on('click',function(){from.value=route.from;to.value=route.to;plotRoute();});
         line.addTo(routeNetworkLayer);
       });
     }
     function drawVerifiedRivers(){
       riverNetworkLayer.clearLayers();
       verifiedRiverSegments.forEach(function(e){
         var pts=e.waypoints.map(function(p){return coord(p[0],p[1]);});
         var line=L.polyline(pts,{color:'#79cfcc',weight:3.2,opacity:.83,
           dashArray:'7 4',interactive:true,className:'ae-naval-river-network'});
         line.bindTooltip(placeLabel(e.from)+' — '+placeLabel(e.to)+' · río rojo de Kargast');
         line.on('click',function(){
           from.value=e.from;to.value=e.to;state.from=e.from;state.to=e.to;plotRoute();updateNearby();
         });
         line.addTo(riverNetworkLayer);
       });
       if(riverOutlet){
         var outlet=L.polyline(riverOutlet.waypoints.map(function(p){return coord(p[0],p[1]);}),
           {color:'#94cfcb',weight:2.8,opacity:.85,dashArray:'4 4',
             className:'ae-naval-river-outlet',interactive:false});
         outlet.addTo(riverNetworkLayer);
       }
     }
     function drawRiverPath(points,style){
       var latlngs=points.map(function(p){return coord(p[0],p[1]);});
       L.polyline(latlngs,Object.assign({color:'#8de4d6',weight:4.7,opacity:.98,
         className:'ae-naval-river-selected'},style||{})).addTo(routeLayer);
       return latlngs;
     }
     function showVerifiedRiver(resultRoute){
       var points=resultRoute.waypoints,routePoints=drawRiverPath(points);
       var riverPx=riverLengthPixels(points),
          hexApprox=Math.round(riverPx/(Math.sqrt(3)*R));
       result.innerHTML='<strong>'+html(placeLabel(resultRoute.from))+' → '+html(placeLabel(resultRoute.to))+'</strong>'+
         '<span>Río rojo georreferenciado · '+resultRoute.legs+
         (resultRoute.legs===1?' tramo':' tramos')+' fluviales</span>'+
         '<span>Recorrido aproximado: '+hexApprox+' hexágonos equivalentes</span>'+
         '<p class="ae-naval-fluvial-note">El cauce sigue la cartografía original de Kargast. No se asignan horas de travesía porque la velocidad de navegación fluvial no está reglamentada.</p>';
       state.route={from:resultRoute.from,to:resultRoute.to,kind:'river',
         status:'trazado_rojo_verificado',riverPx:riverPx,hexesApprox:hexApprox,
         points:points.length};
       if(!state.active){state.active=true;setVisible();}
       map.fitBounds(L.latLngBounds(routePoints).pad(.20),{maxZoom:.85,padding:[36,36]});
     }
     function updateNearby(){
       var el=q('ae-naval-nearby');if(!el)return;
       var id=from.value||state.from,near=routes.routes.filter(function(e){return e.from===id||e.to===id;})
         .map(function(e){return {id:e.from===id?e.to:e.from,hexes:e.hexes};})
         .sort(function(a,b){return a.hexes-b.hexes;});
       var riverNeighbors=new Map();
       (basinBySite.get(id)||[]).forEach(function(b){
         b.sites.forEach(function(other){
           if(other!==id&&portById.has(other))riverNeighbors.set(other,b.region);
         });
       });
       var out='<p>Escalas cercanas a '+html(placeLabel(id))+':</p>';
       if(!networkRequested)out+='<p>Abre la Carta Náutica para verificar los corredores marítimos.</p>';
       else if(!near.length&&!riverNeighbors.size)out+='<p>No hay una conexión próxima verificada desde esta escala.</p>';
       if(near.length)out+='<div class="ae-naval-nearby__sea">'+
         near.map(function(e){return '<button type="button" data-port="'+html(e.id)+'">'+
           html(placeLabel(e.id))+' <small>'+e.hexes+' hex. · mar</small></button>';}).join('')+'</div>';
       if(riverNeighbors.size)out+='<p class="ae-naval-nearby__label">Cuenca fluvial reconocida · cauce por cartografiar</p>'+
         '<div class="ae-naval-nearby__river">'+Array.from(riverNeighbors).map(function(pair){
           return '<button type="button" data-port="'+html(pair[0])+'" title="Conexión fluvial declarada; no existe ruta geométrica validada">'+
           html(placeLabel(pair[0]))+' <small>río · pendiente</small></button>';
         }).join('')+'</div>';
       el.innerHTML=out;
     }
     q('ae-naval-nearby').addEventListener('click',function(e){
       var button=e.target.closest('button[data-port]');if(!button)return;
       to.value=button.dataset.port;state.to=to.value;plotRoute();
     });
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
     function findPath(fromId,toId,maxHexes){
       var a=anchorById.get(fromId),b=anchorById.get(toId);
       if(!hasOpenSeaAccess(fromId)||!hasOpenSeaAccess(toId))return null;
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
           if(maxHexes&&distance(a.hex,[x,y])+distance([x,y],b.hex)>maxHexes)continue;
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
       // Selección cartográfica local: pares próximos, no líneas heredadas que
       // den la vuelta al continente. A* comprueba todos los hexágonos del tramo.
       var nearest=Number(policy.nearestCandidatesPerPort)||8,
           maxStraight=Number(policy.maxStraightHexDistance)||32,
           preferred=Number(policy.preferredConnectionsPerPort)||3,
           maximum=Number(policy.maximumConnectionsPerPort)||5,
           maxEdges=Number(policy.networkMaxEdges)||140,
           batchSize=Number(policy.batchSize)||3;
       var pairs=new Map(),degree=new Map(),candidates=[],selected=[],rejected=0;
       maritimePorts.forEach(function(p){
         var a=anchorById.get(p.id);if(!a)return;
         degree.set(p.id,0);
         var near=maritimePorts.filter(function(other){return other.id!==p.id;})
           .map(function(other){
             var b=anchorById.get(other.id);
             return {from:p.id,to:other.id,straight:distance(a.hex,b.hex)};
           })
           .filter(function(x){return x.straight>0&&x.straight<=maxStraight;})
           .sort(function(a,b){return a.straight-b.straight;}).slice(0,nearest);
         near.forEach(function(pair){
           var key=[pair.from,pair.to].sort().join('|');
           if(!pairs.has(key))pairs.set(key,pair);
         });
       });
       candidates=Array.from(pairs.values()).sort(function(a,b){
         return a.straight-b.straight;
       });
       var index=0;
       function step(){
         for(var i=0;i<batchSize&&index<candidates.length;i++,index++){
           if(selected.length>=maxEdges){index=candidates.length;break;}
           var pair=candidates[index],aDegree=degree.get(pair.from)||0,bDegree=degree.get(pair.to)||0;
           // Intentar tres enlaces por escala, hasta cinco cuando un vecino
           // necesite conectarse; no saturar los puertos más centrales.
           if(aDegree>=maximum||bDegree>=maximum||(aDegree>=preferred&&bDegree>=preferred))continue;
           var allowed=Math.min(Number(policy.maxDirectRouteHexes)||50,
             Math.floor(pair.straight*(Number(policy.maxDetourRatio)||1.75)+(Number(policy.maxDetourSlackHexes)||8)));
           var cells=findPath(pair.from,pair.to,allowed);
           if(!cells||cells.length<2||cells.length-1>allowed){rejected++;continue;}
           var points=cells.map(function(n){
             var xy=center(n[0],n[1]);return [Number(xy[0].toFixed(1)),Number(xy[1].toFixed(1))];
           });
           selected.push({
             id:'local-'+[pair.from,pair.to].sort().join('-'),from:pair.from,to:pair.to,
             status:'corredor_cercano_verificado_sobre_mar_rojo',kind:'coastal-nearby',
             hexes:cells.length-1,straightHexes:pair.straight,waypoints:points,
             qa:{source:source.revision,redWaterOnly:true,verifiedEdges:true,maximumRouteHexes:allowed}
           });
           degree.set(pair.from,aDegree+1);degree.set(pair.to,bDegree+1);
         }
         if(index<candidates.length){setTimeout(step,0);return;}
         routes.routes=selected;drawNetwork();updateNearby();
         q('ae-naval-metrics').textContent=
           water.cells.length.toLocaleString('es-CL')+' hexágonos marinos · '+
           surfaceWater.length.toLocaleString('es-CL')+' de otras aguas · '+
           ports.length+' escalas registradas · '+maritimePorts.length+' con acceso marítimo · '+
           selected.length+' corredores cercanos ('+rejected+' propuestas sin paso corto verificado).';
         console.info('[Aeternalis/Naval v3.8]',{
           maritimePorts:maritimePorts.length,fluvialSites:fluvial.sites.length,
           candidatePairs:candidates.length,localRoutes:selected.length,rejected:rejected
         });
       }
       updateNearby();
       step();
     }
     function plotRoute(){
       var first=from.value,last=to.value;state.from=first;state.to=last;state.sails=Number(sails.value)||1;
       routeLayer.clearLayers();
       if(!first||!last||first===last){result.textContent='Selecciona dos puertos o riberas diferentes.';state.route=null;return;}
       var verified=verifiedRiverPath(first,last);
       if(verified){showVerifiedRiver(verified);return;}
       // Rinnos y Reddas pueden continuar hasta otros puertos atravesando
       // su río cartografiado, el Faro Durgath y la desembocadura.
       var riverToSea=null,seaPart=null,viaMouth=null,seaPortsReversed=false;
       if(verifiedRiverGraph.has(first)&&first!=='place-014'&&hasOpenSeaAccess(last)){
         riverToSea=verifiedRiverPath(first,'place-014');
         if(riverToSea){seaPart=findPath('place-014',last);viaMouth=riverToSea;}
       }else if(verifiedRiverGraph.has(last)&&last!=='place-014'&&hasOpenSeaAccess(first)){
         riverToSea=verifiedRiverPath('place-014',last);
         if(riverToSea){seaPart=findPath(first,'place-014');viaMouth=riverToSea;seaPortsReversed=true;}
       }
       if(viaMouth&&seaPart&&seaPart.length&&riverOutlet){
         var waterCoordinates=seaPart.map(cellCoord);
         var riverCoordinates=drawRiverPath(viaMouth.waypoints);
         var mouthCoords=riverOutlet.waypoints.map(function(p){return coord(p[0],p[1]);});
         L.polyline(mouthCoords,{color:'#99dece',weight:3.8,opacity:.96,
           className:'ae-naval-river-outlet-selected'}).addTo(routeLayer);
         L.polyline(waterCoordinates,{color:'#eec389',weight:4.5,opacity:.95,
           className:'ae-naval-route-selected'}).addTo(routeLayer);
         var seaHexes=seaPart.length-1,
             estimatedSeaHours=seaHexes*[24,18,12,8][state.sails-1],
             riverHexes=Math.round(riverLengthPixels(viaMouth.waypoints)/(Math.sqrt(3)*R));
         result.innerHTML='<strong>'+html(placeLabel(first))+' → '+html(placeLabel(last))+'</strong>'+
           '<span>'+riverHexes+' hexágonos equivalentes por río + '+seaHexes+' hexágonos por mar</span>'+
           '<span>Tiempo únicamente marítimo: '+estimatedSeaHours+' h</span>'+
           '<p class="ae-naval-fluvial-note">Travesía mixta a través de Faro Durgath y su desembocadura. La duración fluvial queda por determinar; no se aplica automáticamente la velocidad oceánica al río.</p>';
         state.route={from:first,to:last,kind:'mixed-river-sea',status:'trazado_rojo_verificado',
           riverHexesApprox:riverHexes,seaHexes:seaHexes,seaHours:estimatedSeaHours};
         if(!state.active){state.active=true;setVisible();}
         map.fitBounds(L.latLngBounds(riverCoordinates.concat(mouthCoords,waterCoordinates)).pad(.18),
           {maxZoom:.65,padding:[36,36]});
         return;
       }
       var river=declaredRiverLink(first,last),basin=sharedFluvialBasin(first,last);
       if(river||basin){
         result.innerHTML='<strong>'+html(placeLabel(first))+' → '+html(placeLabel(last))+'</strong>'+
           '<p class="ae-naval-fluvial-note">'+
           (river?'Conexión por río confirmada por el autor.':'Ambas escalas pertenecen a la red fluvial de '+html(basin.region)+'.')+
           ' El cauce preciso aún debe dibujarse sobre los hexágonos de agua. No se representa una recta sobre tierra ni se estima tiempo de viaje sin el trazado.</p>';
         state.route={from:first,to:last,kind:'river',status:'course-pending'};return;
       }
       if(!hasOpenSeaAccess(first)||!hasOpenSeaAccess(last)){
         var faro=first==='place-014'||last==='place-014';
         result.innerHTML='<strong>'+html(placeLabel(first))+' → '+html(placeLabel(last))+'</strong>'+
           '<p class="ae-naval-fluvial-note">'+(faro?
            'Faro Durgath tiene salida al mar confirmada y su desembocadura está cartografiada. Sin embargo, no se ha podido vincular esta travesía con un corredor oceánico comprobado.':
            'La localidad está identificada como escala fluvial, pero el paso hasta el mar o hasta esta otra escala todavía no tiene un cauce verificado.')+
           ' No se habilita un atajo sobre tierra.</p>';
         state.route={from:first,to:last,kind:'river',status:'unverified-waterway'};return;
       }
       var path=findPath(first,last);
       if(!path){result.textContent='No existe continuidad comprobada por agua marina entre estas escalas.';state.route=null;return;}
       var latlngs=path.map(cellCoord);
       L.polyline(latlngs,{color:'#eec389',weight:4.5,opacity:.95,className:'ae-naval-route-selected'}).addTo(routeLayer);
       var start=lookup(first),end=lookup(last),accessFrom=anchorById.get(first),accessTo=anchorById.get(last);
        // No dibujar accesos fluviales por tierra si el origen queda lejos de la máscara de agua.
        if(start&&accessFrom&&accessFrom.accessStatus==='desembocadura_roja_verificada'&&riverOutlet){
          L.polyline(riverOutlet.waypoints.map(function(p){return coord(p[0],p[1]);}),
            {color:'#89ccbf',weight:3.5,dashArray:'5 4',opacity:.95,interactive:false}).addTo(routeLayer);
        }else if(start&&accessFrom&&accessFrom.snap_distance<=10)
          L.polyline([coord(start.x,start.y),latlngs[0]],{color:'#d7ae72',weight:2,dashArray:'3 5',opacity:.7,interactive:false}).addTo(routeLayer);
        if(end&&accessTo&&accessTo.accessStatus==='desembocadura_roja_verificada'&&riverOutlet){
          L.polyline(riverOutlet.waypoints.slice().reverse().map(function(p){return coord(p[0],p[1]);}),
            {color:'#89ccbf',weight:3.5,dashArray:'5 4',opacity:.95,interactive:false}).addTo(routeLayer);
        }else if(end&&accessTo&&accessTo.snap_distance<=10)
          L.polyline([latlngs[latlngs.length-1],coord(end.x,end.y)],{color:'#d7ae72',weight:2,dashArray:'3 5',opacity:.7,interactive:false}).addTo(routeLayer);
        var hexes=path.length-1,hours=hexes*[24,18,12,8][state.sails-1];
       var pendingAccess=!!((accessFrom&&accessFrom.snap_distance>10)||(accessTo&&accessTo.snap_distance>10));
        result.innerHTML='<strong>'+html(placeLabel(first))+' → '+html(placeLabel(last))+'</strong><span>'+hexes.toLocaleString('es-CL')+' hexágonos sobre red preliminar</span><span>'+hours.toLocaleString('es-CL')+' horas · '+(hours/24).toLocaleString('es-CL',{maximumFractionDigits:2})+' días estimados</span>'+(pendingAccess?'<p class="ae-naval-access-warning">Acceso fluvial aún no verificado entre la localidad y la red oceánica. El tiempo no incluye ese tramo; no se dibuja una línea sobre tierra.</p>':'<p class="ae-naval-access-warning">Ruta provisional sobre hexágonos marinos del Mapa Nelson 1.1. Los lagos y ríos aparecen como agua, pero no están habilitados automáticamente para buques.</p>');
        state.route={from:first,to:last,hexes:hexes,hours:hours,points:path.length};
       if(!state.active){state.active=true;setVisible();}
       var fit=L.latLngBounds(latlngs);
       map.fitBounds(fit.pad(.15),{maxZoom:.6,padding:[38,38]});
     }
     from.addEventListener('change',function(){state.from=from.value;updateNearby();});
     to.addEventListener('change',function(){state.to=to.value;});
     sails.addEventListener('change',function(){state.sails=Number(sails.value)||1;if(state.route)plotRoute();});
     q('ae-naval-route').addEventListener('click',plotRoute);
     q('ae-naval-toggle-hex').addEventListener('change',function(e){state.showHex=e.target.checked;setVisible();});
     q('ae-naval-toggle-regions').addEventListener('change',function(e){state.showRegions=e.target.checked;setVisible();});
     q('ae-naval-toggle-network').addEventListener('change',function(e){state.showNetwork=e.target.checked;setVisible();});
     plotZones();drawPorts();drawVerifiedRivers();setVisible();
     // Public API for other modules, deliberately read-only for region and water data.
     window.__AETERNALIS_SUPERMAPA_NAVAL__={version:VERSION,map:map,toggle:function(){button.click();},getState:function(){return Object.assign({},state);},getSummary:function(){return {hexagons:water.cells.length,otherWaterHexagons:surfaceWater.length,regions:zones.regions.length,connections:routes.routes.length,ports:ports.length,verifiedRiverSegments:verifiedRiverSegments.length,riverMouthReady:!!anchorById.get('place-014')};}};
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