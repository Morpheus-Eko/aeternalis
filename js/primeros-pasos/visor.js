/* AETERNALIS · LA SENDA DEL AVENTURERO v1.2.0
   Módulo de acogida independiente. Todo el contenido/las URLs se leen del JSON.
   No altera reglas del foro ni utiliza CSS/JS de otros sistemas.
*/
(function(){
'use strict';
var host=document.getElementById('ae-primeros-pasos');
if(!host||host.dataset.apBoot)return;
host.dataset.apBoot='loading';
var BASE='https://morpheus-eko.github.io/aeternalis/';
function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];});}
function image(path){return /^assets\/[a-z0-9_\-/]+\.(webp|png|svg)$/i.test(path||'')?BASE+path:'';}
function linkAllowed(href){
 if(!href||typeof href!=='string')return null;
 try{
  var u=new URL(href,window.location.origin);
  if(u.protocol==='https:'&&u.hostname==='aeternalis.foroactivo.com')return u.href;
 }catch(e){}
 return null;
}
function boot(db){
 if(!db||db.schema!=='aeternalis-primeros-pasos-v1'||!Array.isArray(db.etapas)||!Array.isArray(db.recursos)||!db.etapas.length)throw Error('Catálogo incompleto');
 var steps=db.etapas, byId=Object.create(null), resourceStep=Object.create(null);
 db.recursos.forEach(function(r){byId[r.id]=r;});
 steps.forEach(function(step,i){step.recursos.forEach(function(id){if(!byId[id])throw Error('Recurso inexistente '+id);resourceStep[id]=i;});});
 var selected=0,opened=null;
 host.innerHTML='<section class="ap-shell" aria-label="Manual de primeros pasos">'
 +'<header class="ap-hero"><div class="ap-hero__intro"><span class="ap-eyebrow">AETERNALIS · GUÍA DE INICIACIÓN</span><h1>'+esc(db.guia.titulo)+'</h1><p class="ap-subtitle">'+esc(db.guia.subtitulo)+'</p><p class="ap-lead">'+esc(db.guia.bienvenida)+'</p></div>'
 +'<div class="ap-hero__illustration" aria-hidden="true"><img class="ap-hero__compass" src="'+image(db.assets.compass)+'" alt=""><img class="ap-hero__map" src="'+image(db.assets.route)+'" alt=""></div></header>'
 +'<div class="ap-milestones" aria-label="Hitos del viaje">'+(db.hitos||[]).map(function(h){return '<div class="ap-milestone"><img src="'+image(h.icono)+'" alt="" loading="lazy"><div><strong>'+esc(h.titulo)+'</strong><small>'+esc(h.subtitulo)+'</small></div></div>';}).join('')+'</div>'
 +'<div class="ap-shortcuts"><p>Consulta rápida</p><div class="ap-shortcuts__actions"></div></div>'
 +'<div class="ap-layout"><nav class="ap-trail" aria-label="Etapas del manual"><div class="ap-trail__heading">Tu itinerario <small>Cinco paradas para comenzar</small></div><div class="ap-trail__steps"></div></nav>'
 +'<main class="ap-current" aria-live="polite"></main></div>'
 +'<footer class="ap-footer"><img src="'+image(db.assets.lantern)+'" alt="" loading="lazy"><p>'+esc(db.guia.despedida)+'</p></footer></section>';
 var trail=host.querySelector('.ap-trail__steps'),current=host.querySelector('.ap-current'),shortcuts=host.querySelector('.ap-shortcuts__actions');
 function trailItem(s,i){
  return '<button type="button" class="ap-trail__stop'+(i===selected?' is-active':'')+'" data-ap-stage="'+i+'" aria-current="'+(i===selected?'step':'false')+'">'
  +'<span class="ap-trail__number">'+String(i+1).padStart(2,'0')+'</span>'
  +'<span class="ap-trail__label"><strong>'+esc(s.titulo)+'</strong><small>'+esc(s.subtitulo)+'</small></span>'
  +'<img src="'+image(s.insignia)+'" alt="" loading="lazy"></button>';
 }
 function resourceCard(r){
  return '<button type="button" data-ap-resource="'+esc(r.id)+'" class="ap-resource'+(opened===r.id?' is-open':'')+'">'
  +'<span class="ap-resource__icon"><img src="'+image(r.imagen)+'" alt="" loading="lazy"></span>'
  +'<span class="ap-resource__copy"><small class="ap-resource__priority">'+esc(r.prioridad)+'</small><strong>'+esc(r.titulo)+'</strong><span>'+esc(r.resumen)+'</span></span>'
  +'<span class="ap-resource__arrow" aria-hidden="true">›</span></button>';
 }
 function detail(r){
  var href=linkAllowed(db.enlaces&&db.enlaces[r.id]);
  return '<section class="ap-detail" aria-label="Información sobre '+esc(r.titulo)+'" id="ap-recurso-detalle">'
  +'<div class="ap-detail__top"><span class="ap-detail__eyebrow">GUÍA DE CONSULTA</span><button type="button" data-ap-close aria-label="Cerrar orientación">×</button></div>'
  +'<h3>'+esc(r.titulo)+'</h3><p>'+esc(r.detalle)+'</p><div class="ap-detail__foot">'
  +(href?'<a class="ap-destination" href="'+esc(href)+'" rel="noopener noreferrer">Visitar esta sección <span aria-hidden="true">↗</span></a>':
  '<span class="ap-destination ap-destination--pending" aria-label="Enlace todavía no disponible">Enlace en preparación</span>')
  +'<small>'+(href?'Acceso habilitado al apartado del foro':'Podrás acceder desde aquí cuando se publique la sección actualizada')+'</small></div></section>';
 }
 function stageCard(s,i){
  return '<article class="ap-page" id="ap-etapa-actual"><div class="ap-page__head"><div class="ap-page__title"><span class="ap-page__eyebrow">ETAPA '+String(i+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0')+'</span><h2>'+esc(s.titulo)+'</h2><p>'+esc(s.subtitulo)+'</p></div><img src="'+image(s.insignia)+'" alt="" loading="lazy"></div>'
  +'<div class="ap-page__body"><p class="ap-page__intro">'+esc(s.resumen)+'</p>'
  +'<div class="ap-hint"><span aria-hidden="true">✦</span><p>'+esc(s.recomendacion)+'</p></div>'
  +'<h3 class="ap-page__resources-heading">Lugares que debes conocer</h3><div class="ap-resources">'+s.recursos.map(function(id){return resourceCard(byId[id]);}).join('')+'</div>'
  +(opened&&byId[opened]?detail(byId[opened]):'')
  +'<div class="ap-actions"><button type="button" class="ap-actions__previous" data-ap-move="-1"'+(i===0?' disabled':'')+'>← Etapa anterior</button>'
  +'<button type="button" class="ap-actions__next" data-ap-move="1"'+(i===steps.length-1?' disabled':'')+'>Siguiente etapa →</button></div></div></article>';
 }
 function shortcutsHTML(){
  return (db.accesos||[]).map(function(id){var r=byId[id];if(!r)return '';return '<button type="button" data-ap-quick="'+esc(id)+'" class="'+(opened===id?'is-active':'')+'"><img src="'+image(r.imagen)+'" alt="" loading="lazy">'+esc(r.titulo)+'</button>';}).join('');
 }
 function show(opts){
  opts=opts||{};
  trail.innerHTML=steps.map(trailItem).join('');
  current.innerHTML=stageCard(steps[selected],selected);
  shortcuts.innerHTML=shortcutsHTML();
  if(opts.scroll){var el=host.querySelector('.ap-current');if(el&&el.scrollIntoView){var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;el.scrollIntoView({block:'start',behavior:reduced?'auto':'smooth'});}}
 }
 function activateResource(id){
  if(!byId[id])return;
  selected=resourceStep[id];opened=id;show({scroll:true});
 }
 host.addEventListener('click',function(ev){
  var btn=ev.target.closest&&ev.target.closest('button');if(!btn||!host.contains(btn)||btn.disabled)return;
  if(btn.hasAttribute('data-ap-stage')){selected=Number(btn.getAttribute('data-ap-stage'));opened=null;show({scroll:true});}
  else if(btn.hasAttribute('data-ap-quick'))activateResource(btn.getAttribute('data-ap-quick'));
  else if(btn.hasAttribute('data-ap-resource')){var id=btn.getAttribute('data-ap-resource');opened=(opened===id?null:id);show({scroll:false});if(opened){var target=host.querySelector('.ap-detail');if(target)target.scrollIntoView({behavior:'smooth',block:'nearest'});}}
  else if(btn.hasAttribute('data-ap-close')){opened=null;show({scroll:false});}
  else if(btn.hasAttribute('data-ap-move')){var next=selected+Number(btn.getAttribute('data-ap-move'));if(next>=0&&next<steps.length){selected=next;opened=null;show({scroll:true});}}
 });
 show();host.dataset.apBoot='ready';
}
fetch(BASE+'data/primeros-pasos.json?v=1.2.0',{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(boot).catch(function(e){
 host.dataset.apBoot='error';host.innerHTML='<p>No pudo cargarse la guía de iniciación. <a href="'+BASE+'primeros-pasos-preview.html">Abrir la vista alternativa</a>.</p>';console.error('[Aeternalis/Primeros Pasos]',e);
});
})();
