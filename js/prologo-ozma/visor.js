/* AETERNALIS · Prólogo del Bardo / Ozma v1.0.0
 * Una sola lámina vertical. Sin bibliotecas externas ni estilos en JS.
 * Texto: data/prologo-ozma/relato.json. Recursos: biblioteca Aeternalis.
 */
(function(){
 'use strict';
 const root=document.getElementById('ae-prologo-ozma');
 if(!root || root.dataset.aoBoot==='ready')return;
 const BASE='https://morpheus-eko.github.io/aeternalis/';
 const DATA=BASE+'data/prologo-ozma/relato.json?v=1.0.0';
 const ORNAMENT='assets/codex/separadores/filigrana_dorada_01.webp';
 const CORNER_A='assets/codex/esquinas/bronce_superior_izquierda_01.webp';
 const CORNER_B='assets/codex/esquinas/bronce_superior_derecha_01.webp';
 const CORNER_C='assets/codex/esquinas/bronce_inferior_izquierda_01.webp';
 const CORNER_D='assets/codex/esquinas/bronce_inferior_derecha_01.webp';
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const asset=path=>typeof path==='string'&&/^assets\/codex\/[a-zA-Z0-9/_-]+\.webp$/.test(path)?BASE+path:'';
 const image=(src,alt,cls,decor=false,priority=false)=>{
  if(!src||!/^https:\/\//.test(src))return '';
  return '<img'+(cls?' class="'+esc(cls)+'"':'')+' src="'+esc(src)+'" alt="'+esc(alt||'')+'"'+(decor?' aria-hidden="true"':'')+' loading="'+(priority?'eager':'lazy')+'" decoding="async"'+(priority?' fetchpriority="high"':'')+'>';
 };
 const decorative=(src,cls)=>image(asset(src),'',cls,true);
 const paragraphs=items=>(Array.isArray(items)?items:[]).map(item=>{
  const type=item&&item.type==='acotacion'?'acotacion':'voz';
  const raw=typeof item==='string'?item:item&&item.text||'';
  if(!raw.trim())return '';
  return '<p class="ao-paragraph ao-paragraph--'+type+'">'+esc(raw)+'</p>';
 }).join('');
 function chapter(c){
  if(!c || !/^[a-z-]+$/.test(c.id))return '';
  return '<section class="ao-canto" id="ao-canto-'+esc(c.id)+'" aria-labelledby="ao-canto-'+esc(c.id)+'-titulo">'+
   '<header class="ao-canto__header">'+
    '<div class="ao-canto__ornament" aria-hidden="true"><span></span>'+decorative(c.icon,'ao-canto__symbol')+'<span></span></div>'+
    '<div class="ao-canto__number">Canto '+esc(c.numero)+'</div>'+
    '<h2 id="ao-canto-'+esc(c.id)+'-titulo">'+esc(c.titulo)+'</h2>'+
   '</header><div class="ao-canto__text">'+paragraphs(c.paragraphs)+'</div></section>';
 }
 function related(link){
  if(!link||typeof link.url!=='string'||!/^https:\/\/aeternalis\.foroactivo\.com\//.test(link.url))return '';
  return '<a class="ao-route" href="'+esc(link.url)+'" target="_self">'+
   decorative(link.icon,'ao-route__icon')+
   '<span class="ao-route__copy"><strong>'+esc(link.label)+'</strong><small>'+esc(link.description)+'</small></span>'+
   '<span class="ao-route__arrow" aria-hidden="true">›</span></a>';
 }
 function render(d){
  if(!d||d.schema!=='aeternalis-prologo-ozma-v1'||!Array.isArray(d.cantos)||d.cantos.length!==5||!Array.isArray(d.links))throw Error('Formato del prólogo inválido');
  const n=d.narrator,sc=d.scene;
  root.innerHTML=
   '<article class="ao-lamina" aria-label="Prólogo de Ozma, ambientación de Aeternalis">'+
    '<div class="ao-frame" aria-hidden="true">'+
     decorative(CORNER_A,'ao-frame__corner ao-frame__corner--tl')+
     decorative(CORNER_B,'ao-frame__corner ao-frame__corner--tr')+
     decorative(CORNER_C,'ao-frame__corner ao-frame__corner--bl')+
     decorative(CORNER_D,'ao-frame__corner ao-frame__corner--br')+
    '</div>'+
    '<header class="ao-opening"><span class="ao-opening__eyebrow">'+esc(d.eyebrow)+'</span>'+
     '<h1>'+esc(d.title)+'</h1><p class="ao-opening__subtitle">'+esc(d.subtitle)+'</p>'+
     '<div class="ao-opening__divider" aria-hidden="true">'+decorative(ORNAMENT,'')+'</div>'+
    '</header>'+
    '<figure class="ao-scene">'+image(sc.image,sc.imageAlt,'ao-scene__image',false,true)+
     '<figcaption>'+esc(sc.caption)+'</figcaption>'+
     '<div class="ao-scene__vignette" aria-hidden="true"></div>'+
    '</figure>'+
    '<div class="ao-body">'+
     '<div class="ao-narrator">'+
      '<div class="ao-narrator__portrait">'+image(n.image,n.imageAlt,'ao-narrator__image',false,true)+'</div>'+
      '<div class="ao-narrator__identity"><span>La voz que te recibe</span><h2>'+esc(n.name)+'</h2>'+
      '<p>'+esc(n.role)+'</p><blockquote>«'+esc(n.invitation)+'»</blockquote></div>'+
     '</div>'+
     '<div class="ao-prologue">'+paragraphs(d.intro)+'</div>'+
     '<nav class="ao-cantos-index" aria-label="Los cinco cantos de Ozma">'+
      '<span class="ao-cantos-index__label">Sigue el relato</span>'+
      d.cantos.map(c=>'<a href="#ao-canto-'+esc(c.id)+'" aria-label="Ir al canto '+esc(c.numero)+': '+esc(c.titulo)+'">'+esc(c.numero)+'</a>').join('')+
     '</nav>'+
     '<main class="ao-cantos">'+d.cantos.map(chapter).join('')+'</main>'+
     '<div class="ao-finale">'+
      decorative('assets/codex/separadores/libro_alas_01.webp','ao-finale__crest')+
      '<p class="ao-finale__prelude">'+esc(d.finale.lead)+'</p>'+
      '<p class="ao-finale__question">'+esc(d.finale.question)+'</p>'+
      '<p class="ao-finale__signature">'+esc(d.finale.signature)+'</p>'+
     '</div>'+
     '<footer class="ao-journey" aria-labelledby="ao-journey-title">'+
       '<div class="ao-journey__ornament" aria-hidden="true">'+decorative(ORNAMENT,'')+'</div>'+
       '<h2 id="ao-journey-title">Continúa tu viaje</h2>'+
       '<p>Los caminos de Aeternalis comienzan aquí.</p>'+
       '<nav class="ao-routes" aria-label="Enlaces fundamentales del foro">'+d.links.map(related).join('')+'</nav>'+
     '</footer>'+
    '</div>'+
   '</article>';
  root.dataset.aoBoot='ready';
  root.querySelectorAll('.ao-scene__image,.ao-narrator__image').forEach(el=>el.addEventListener('error',()=>{el.classList.add('ao-image--unavailable');el.parentNode&&el.parentNode.classList.add('ao-image-failed');},{once:true}));
 }
 function load(){
  fetch(DATA,{mode:'cors',credentials:'omit',cache:'no-cache'})
  .then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
  .then(render)
  .catch(err=>{
   root.dataset.aoBoot='error';
   root.innerHTML='<section class="ao-failure" role="status"><h2>Prólogo del Bardo</h2><p>La crónica no pudo abrirse desde la biblioteca.</p><p><a href="'+BASE+'prologo-ozma/">Consultar la lámina en la biblioteca</a></p></section>';
   if(window.console&&console.warn)console.warn('[Aeternalis/Ozma]',err);
  });
 }
 window.AeternalisPrologoOzma={version:'1.0.0',reload:load};
 load();
})();
