/* Aeternalis · laboratorio iconográfico v1.2.0 · no altera datos del juego */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),root=$('ae-gallery'),status=$('ae-status'),search=$('ae-find');
 const data={view:'herbs',query:'',herbs:[],diseases:[],icon:null,rules:null};
 const valid=path=>typeof path==='string'&&( /^assets\/(medicina|codex|pestilencias)\/[a-zA-Z0-9_/-]+\.webp$/.test(path)|| /^assets\/medicina\/patologias-v01\/(fd|com|sn)_(paciente|signos|organo|cuidados)(?:_tinta)?\.svg$/.test(path) )&&!path.includes('..');
 const image=(path,caption,archival)=>{
  if(!valid(path))return null;
  const figure=document.createElement('figure'),link=document.createElement('a'),img=document.createElement('img'),text=document.createElement('figcaption');
  link.href='../'+(valid(archival)?archival:path);link.target='_blank';link.rel='noopener noreferrer';link.title='Ampliar grabado';
  img.src='../'+path;img.loading='lazy';img.decoding='async';img.alt=caption;
  text.textContent=caption;link.appendChild(img);figure.append(link,text);return figure;
 };
 const paragraph=(text,cls)=>{const el=document.createElement('p');if(cls)el.className=cls;el.textContent=text;return el;};
 const card=(title,sub,kind)=>{
  const article=document.createElement('article');article.className='gabinete__card gabinete__card--'+kind;
  const h=document.createElement('h2');h.textContent=title;article.append(h,paragraph(sub,'gabinete__sub'));return article;
 };
 const imageBand=(article,items)=>{
  const band=document.createElement('div');band.className='gabinete__plates';
  for(const item of items){if(!item)continue;const f=image(item.path,item.label,item.archival);if(f)band.appendChild(f);}
  if(band.childElementCount)article.appendChild(band);
 };
 const filtered=(name)=>name.toLocaleLowerCase('es').includes(data.query);
 function herbCards(){
  return data.herbs.filter(h=>filtered(h.name)).map(h=>{
   const item=data.icon.herbs[h.id],a=card(h.name,'Lámina de botica · '+h.region,'herb');
   if(item)imageBand(a,[
    {path:item.principal,label:'Estudio de espécimen, sin identificación canónica'},
    {path:item.detail,label:'Detalle morfológico de estudio'},
    {path:item.instrument,label:'Utensilio de botica de archivo'}]);
   a.appendChild(paragraph(h.preparation,'gabinete__field'),paragraph('El dibujo es provisional y no acredita identidad botánica, preparación ni efectos mecánicos.','gabinete__warning'));
   return a;
  });
 }
 function diseaseCards(){
  return data.diseases.filter(d=>filtered(d.name)).map(d=>{
   const item=data.icon.diseases[d.id],a=card(d.name,d.region,'disease');
   if(item)imageBand(a,item.specific?[
    item.specific.patient,item.specific.signs,item.specific.organ,
    {path:item.seal,label:'Sello del expediente'}
   ]:[{path:item.seal,label:'Sello del expediente'},item.anatomy,item.detail,item.consequence]);
   a.appendChild(paragraph('Umbral de exposición: superar '+d.target+' en 1d100 modificado.','gabinete__field'),paragraph(item&&(item.specificDisclaimer||item.disclaimer)||'Grabados no diagnósticos.','gabinete__warning'));
   return a;
  });
 }
 function careCards(){
  const c=data.icon.care,rows=[];
  if(!c)return rows;
  for(const d of data.diseases.filter(d=>filtered(d.name)||!data.query)){
   const a=card('Cuidados · '+d.name,'Las bonificaciones proceden del reglamento original; las imágenes son genéricas.','care');
   const specific=data.icon.diseases[d.id]&&data.icon.diseases[d.id].specific;
   imageBand(a,[...(specific?[specific.care]:[]),c.potion,c.spell,c.followup]);
   a.appendChild(paragraph(data.rules.potion+' +'+d.potion+' · '+data.rules.spell+' +'+d.spell,'gabinete__field'),paragraph('Los vendajes y utensilios no curan ni revierten secuelas automáticamente.','gabinete__warning'));
   rows.push(a);
  }
  return rows;
 }
 function render(){
  root.replaceChildren();const cards=data.view==='herbs'?herbCards():data.view==='diseases'?diseaseCards():careCards();
  for(const c of cards)root.appendChild(c);
  status.textContent=cards.length+' fichas a la vista · catálogo ilustrativo no canónico';
 }
 for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{
  data.view=button.dataset.view;for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b===button));
  search.value='';data.query='';render();
 });
 search.addEventListener('input',()=>{data.query=search.value.trim().toLocaleLowerCase('es');render();});
 Promise.all([
  fetch('../data/codice-salud/compendio.json?v=2.0.0'),
  fetch('../data/pestilencias/enfermedades.json?v=1.4.0'),
  fetch('../data/codice-salud/iconografia-clinica-v01.json?v=1.2.0')
 ].map(r=>r.then(x=>{if(!x.ok)throw Error('HTTP '+x.status);return x.json();})))
 .then(([book,rules,icon])=>{
  if(!Array.isArray(book.herbs)||!Array.isArray(rules.diseases)||icon.schema!=='aeternalis-codice-salud-iconografia-v1')throw Error('Catálogos incompatibles');
  data.herbs=book.herbs;data.diseases=rules.diseases;data.rules=rules.rules;data.icon=icon;render();
 }).catch(e=>{status.textContent='No se pudo leer la biblioteca: '+e.message;});
})();
