/* AETERNALIS — Libro de Monturas v3.3 (correspondencias verificadas por el usuario)
   HTML: <div id="am-app"></div>
   CSS: bloque AM_BOOK_V3_CSS_START / AM_BOOK_V3_CSS_END en /h4-mapa-kawaii-css
   Incluir este código SIN <script> en Gestión de códigos JavaScript, posición: Todas las páginas.
   No contiene CSS ni modifica los demás módulos del foro.
*/
(function () {
  "use strict";
  const ROOT_ID = 'am-app';
  const STYLE_ID = 'am-monturas-v3-estilos';
  const CSS_URL = 'https://morpheus-eko.github.io/aeternalis/css/monturas-libro.css?v=3.3.0';
  const CSS_START = '/* AM_BOOK_V3_CSS_START */';
  const CSS_END   = '/* AM_BOOK_V3_CSS_END */';
  const DEBUG = '[Aeternalis/Monturas v3.3]';


  // CATÁLOGO CORREGIDO POR NOMBRE DE MONTURA. Los 10 iconos rúnicos se mantienen.
  // ÚNICO CATÁLOGO DE IMÁGENES: cambiar los enlaces aquí, sin tocar las fichas.
  // Cada dirección viene de un ID de Imgur aportado por el administrador.
  // Imgur utiliza i.imgur.com para embeber imágenes en <img>.
  const IMAGES = Object.freeze({
    "horse": "https://i.imgur.com/NKG3AOl.jpg",
    "bison": "https://i.imgur.com/PcdV4A2.jpg",
    "rhino": "https://i.imgur.com/JhyeQTo.jpg",
    "goat": "https://i.imgur.com/AY9KD47.jpg",
    "boar": "https://i.imgur.com/gu1MG3M.jpg",
    "elk": "https://i.imgur.com/XLJDvMW.jpg",
    "fox": "https://i.imgur.com/HETKWg4.jpg",
    "lizard": "https://i.imgur.com/WpTX7T8.jpg",
    "wolf": "https://i.imgur.com/1fH8aWT.jpg",
    "sabertooth": "https://i.imgur.com/jWMXlug.jpg",
    "icon_horse": "https://i.imgur.com/9GJYS8r.png",
    "icon_bison": "https://i.imgur.com/H8IvTjE.png",
    "icon_rhino": "https://i.imgur.com/9RFD6on.png",
    "icon_goat": "https://i.imgur.com/BTL3qbT.png",
    "icon_boar": "https://i.imgur.com/Kroq4UQ.png",
    "icon_elk": "https://i.imgur.com/A59pgWY.png",
    "icon_fox": "https://i.imgur.com/SDmow1I.png",
    "icon_lizard": "https://i.imgur.com/JD0aqkO.png",
    "icon_wolf": "https://i.imgur.com/QZ7DT3a.png",
    "icon_sabertooth": "https://i.imgur.com/xjFMMuB.png",
    "next": "https://i.imgur.com/eVt1Z5o.png",
    "paper": "https://i.imgur.com/ttyLE4a.jpg",
    "openbook": "https://i.imgur.com/6eMwDUd.jpg",
    "ink": "https://i.imgur.com/oyLMYwv.png",
    "prev": "https://i.imgur.com/ZB7RMBL.png",
    "divider": "https://i.imgur.com/lMYG0rh.png",
    "divider_alt": "https://i.imgur.com/mTtNeTg.jpg",
    "feather": "https://i.imgur.com/PbzwkvY.png",
    "cover_plain": "https://i.imgur.com/l21ChS9.jpg",
    "cover": "https://i.imgur.com/RzfvzvB.jpg"
});

  const MARKUP = `<div class="am-shell">
    <div class="am-overline"><span>AETERNALIS · ARCHIVO DE LOS VIAJEROS</span><span class="am-overline-secondary">Cuaderno ilustrado de monturas</span></div>
    <div class="am-stage">
      <div class="am-book is-cover" id="am-book" aria-label="Libro interactivo de monturas">
        <div class="am-book-inner"><div class="am-slot is-left" id="am-left"></div><div class="am-slot is-right" id="am-right"></div></div>
        <div class="am-cover-spread" id="am-cover-spread"><button class="am-cover-card" id="am-open-cover" aria-label="Abrir el libro de monturas" title="Abrir el libro"><span>Abrir el libro</span></button></div>
        <div class="am-turner" id="am-turner" aria-hidden="true"></div>
      </div>
    </div>
    <nav class="am-book-controls" aria-label="Navegación de páginas">
      <button class="am-control" id="am-prev" type="button" aria-label="Retroceder página"><img src="${IMAGES.prev}" alt=""><span>Anterior</span></button>
      <div class="am-control-center"><button class="am-home" id="am-home" type="button">✣ Índice</button><span id="am-indicator" class="am-page-indicator" aria-live="polite">Portada</span></div>
      <button class="am-control" id="am-next" type="button" aria-label="Avanzar página"><span>Siguiente</span><img src="${IMAGES.next}" alt=""></button>
    </nav>
    <p class="am-footer">Las descripciones son provisionales. Los costes, habilidades y requisitos definitivos se consultarán en la tienda del foro. <a href="/">Volver al foro</a></p>
  </div>`;

  function reportError(root, message, error) {
    console.error(DEBUG, message, error || '');
    root.textContent = 'No se pudo cargar el Libro de Monturas. ' + message +
      ' Revisa la consola del navegador (F12) y comprueba el bloque CSS en h4.';
    root.setAttribute('role','alert');
  }

  // Lee solo el CSS de Monturas: la página h4 contiene otros estilos que NO deben inyectarse aquí.
  function fetchBookCSS() {
    return fetch(CSS_URL, { credentials:'same-origin', cache:'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('La página CSS devolvió HTTP ' + res.status);
        return res.text();
      })
      .then(function (raw) {
        // La página puede contener CSS plano, una etiqueta <style> o HTML generado por Foroactivo.
        const parsed = new DOMParser().parseFromString(raw, 'text/html');
        const container = parsed.querySelector('style#am-book-v3-source');
        let source = container ? container.textContent : raw;
        let start = source.indexOf(CSS_START);
        let end = source.indexOf(CSS_END, start + CSS_START.length);
        if (start < 0 || end < 0) {
          throw new Error('No aparecen las marcas AM_BOOK_V3_CSS_START / END dentro de ' + CSS_URL);
        }
        let css = source.slice(start + CSS_START.length, end);
        // Si Foroactivo escapa el contenido en el HTML, recuperamos caracteres originales.
        if (/&(?:lt|gt|amp|quot|#39);/.test(css)) {
          const textarea = document.createElement('textarea');
          textarea.innerHTML = css;
          css = textarea.value;
        }
        if (css.length < 300 || css.indexOf('#am-app') < 0) {
          throw new Error('El bloque de Monturas está vacío o no contiene #am-app.');
        }
        return css;
      });
  }

  function start() {
    const root = document.getElementById(ROOT_ID);
    if (!root || root.dataset.amV3Started === 'yes') return;
    root.dataset.amV3Started = 'yes';
    root.setAttribute('aria-label', 'Cargando libro de monturas');
    fetchBookCSS().then(function (css) {
      if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;
        document.head.appendChild(style);
      }
      // Evita que los contenedores estrechos/transformados de la skin recorten el libro.
      if (root.parentElement !== document.body) document.body.appendChild(root);
      document.body.classList.add('am-v3-open');
      root.innerHTML = MARKUP;
      root.removeAttribute('aria-label');
      initBook(root);
      console.info(DEBUG, 'Libro montado; CSS de h4 aplicado.');
    }).catch(function (err) {
      reportError(root, err && err.message ? err.message : 'Error desconocido.', err);
    });
  }

  function initBook(app) {

    const IMG=IMAGES;
    const MOUNTS=[{"key": "horse", "name": "Caballo", "kind": "Paquete inicial", "origin": "General", "species": "Equino", "tagline": "El compañero de los caminos", "life": "Habitualmente, unos 25 a 30 años", "young": "Una cría tras una larga gestación; los nacimientos son frecuentes en estaciones templadas", "body": ["Pocas criaturas han acompañado durante tantos siglos a los pueblos de Aeternalis como el caballo. Su temperamento, rapidez y capacidad de adaptación lo convierten en compañero de mensajeros, peregrinos, comerciantes y soldados. Desde las fértiles llanuras hasta los caminos de montaña, es habitual encontrar establos que ofrecen agua, forraje y refugio a estas bestias.", "La silla se coloca sobre una manta que protege el lomo de la fricción. Los estribos proporcionan equilibrio al jinete, mientras que las riendas permiten comunicarse mediante pequeñas presiones y movimientos. El herrador debe vigilar cascos y herraduras, sobre todo en las rutas empedradas.", "Algunos ejemplares se crían para la guerra y soportan bardas de cuero, malla o metal. Esa protección aumenta su seguridad en una carga, pero también su cansancio; para las travesías largas, hasta un caballero experimentado prefiere viajar con el animal ligero."]}, {"key": "bison", "name": "Bisonte", "kind": "Montura clásica", "origin": "General", "species": "Gran bovino", "tagline": "La fortaleza de las praderas", "life": "Variable; puede superar las dos décadas con buenos cuidados", "young": "Por lo general, una cría en las estaciones favorables", "body": ["El bisonte es una montaña de músculos envuelta en una espesa capa de pelo. No iguala al caballo en carreras prolongadas, pero conserva una marcha firme allí donde el viento, la nieve o el barro vuelven inseguro el camino. Por eso los convoyes que atraviesan grandes planicies aprecian su resistencia y su capacidad para cargar víveres.", "La montura requiere una silla especialmente ancha, asentada sobre una gruesa manta. Los arreos se ajustan con cuidado para no rozar los hombros ni limitar el movimiento del poderoso cuello. Antes de salir, los cuidadores comprueban las correas, los cuernos y el estado de sus pezuñas.", "Es un animal de carácter serio. Su jinete aprende pronto que la fuerza no sustituye la confianza: un bisonte asustado puede convertirse en un peligro para toda la caravana. Los ejemplares más tranquilos son, por ello, auténticos tesoros de las rutas comerciales."]}, {"key": "rhino", "name": "Rino", "kind": "Montura clásica", "origin": "General", "species": "Gran rinoceronte", "tagline": "El peso de la tierra", "life": "Longevidad elevada; algunos ejemplares viven varias décadas", "young": "Crianza lenta, normalmente de una sola cría", "body": ["El rino impone respeto incluso antes de comenzar a moverse. Su piel gruesa, su testa baja y sus poderosas patas lo convierten en una montura preferida para atravesar caminos pedregosos y para abrir paso en terrenos difíciles. Su avance es pesado, pero cuando acelera pocos obstáculos detienen su embestida.", "La silla se fija sobre una estructura acolchada que distribuye el peso, con correajes robustos y estribos elevados. Es fundamental evitar piezas que rocen sus pliegues de piel. Una revisión diaria de los cascos y las zonas de contacto previene heridas que pueden tardar en cicatrizar.", "El rino no es una bestia que admita prisas. Requiere paciencia, espacio y abundante alimento; los cuidadores experimentados advierten que un animal malhumorado no debe sujetarse a la fuerza. En manos prudentes, sin embargo, puede transportar a su dueño con una seguridad formidable."]}, {"key": "goat", "name": "Craneopiedra", "kind": "Montura especial", "origin": "Enanos", "species": "Gran cabra montés", "tagline": "Señora de los pasos imposibles", "life": "Su longevidad exacta varía según las líneas criadas en las montañas", "young": "La crianza se concentra en épocas de deshielo y pastos abundantes", "body": ["Los enanos llaman Craneopiedra a estas cabras de cornamenta formidable y mirada casi desafiante. Habitan riscos donde el viajero común solo ve precipicios. Sus pezuñas se afirman sobre cornisas estrechas y su equilibrio permite franquear senderos que resultarían imposibles para una cabalgadura ordinaria.", "Los arreos son obra de talabarteros acostumbrados a la roca: cuero grueso, hebillas de bronce, mantas de lana y estribos compactos para no golpear la pared de la montaña. Se prefieren alforjas pequeñas y muy bien sujetas, pues una carga desequilibrada puede convertirse en un peligro en altura.", "La confianza de un Craneopiedra no se gana levantando la voz. Los criadores dedican largos periodos a habituarlo al olor y el paso de su jinete. Quien consigue ese vínculo descubre un animal obstinado, sí, pero capaz de encontrar un camino donde otros solo ven niebla y piedra."]}, {"key": "boar", "name": "Tuk Tuk", "kind": "Montura especial", "origin": "Norin", "species": "Gran jabalí", "tagline": "El ariete de los senderos", "life": "Dependiente del entorno y de las condiciones de crianza", "young": "Las camadas suelen ser más numerosas que las de las grandes monturas herbívoras", "body": ["Entre los Norin, el nombre de Tuk Tuk despierta una mezcla de cariño y respeto. Se trata de enormes jabalíes de hocico infatigable, cuerpo compacto y colmillos capaces de partir raíces duras. Recorren matorrales y terrenos embarrados sin perder fácilmente el paso, motivo por el que se los aprecia en caminos rurales.", "La silla suele ser baja y resistente, con correas anchas y pequeñas bolsas de viaje bien distribuidas. Los colmillos se inspeccionan antes de cada salida y el animal necesita lugares donde remover la tierra y refrescarse. Un jinete que lo confunda con un caballo descubrirá pronto su testarudez.", "En fiestas de aldea se narran historias de Tuk Tuk que regresaron a casa por su cuenta, cargados de cestas y mantas después de perder al dueño en el bosque. Quizá sean exageraciones, pero todos coinciden en que su olfato para encontrar alimento y rutas familiares es extraordinario."]}, {"key": "elk", "name": "A’eanslyr", "kind": "Montura especial", "origin": "Altos Elfos", "species": "Gran alce", "tagline": "El guardián de las sendas verdes", "life": "Longevidad variable, asociada a sus bosques de origen", "young": "Una cría en los ciclos de reproducción habituales", "body": ["El A’eanslyr es una criatura majestuosa, de cuello alto, andar silencioso y cornamenta que parece recoger las ramas del bosque. Los Altos Elfos lo consideran una montura digna de sus caminos más antiguos, especialmente allí donde las raíces y la maleza dificultan el avance de los animales comunes.", "Su silla se confecciona con cuero suave, telas verdes y piezas ornamentales que no entorpecen el movimiento de los hombros. Los arneses evitan presionar la base de las astas, que necesitan espacio libre al cruzar arboledas espesas. Durante determinadas estaciones, la cornamenta cambia y exige particular cuidado.", "Es sensible al ruido y al trato brusco. Quien cabalga uno aprende a interpretar la inclinación de sus orejas, la tensión del cuello y el modo en que olfatea el viento. En un bosque tranquilo, parece moverse como si ya conociera todos sus senderos."]}, {"key": "fox", "name": "Kitsune", "kind": "Montura especial", "origin": "Yūgen", "species": "Gran zorro", "tagline": "El espíritu de los caminos otoñales", "life": "No establecida; se dice que algunos viven más de lo esperable", "young": "Reproducción estacional, sujeta a los ciclos del territorio", "body": ["Los Yūgen crían grandes zorros de pelaje sedoso y movimientos ágiles, conocidos como Kitsune. Su figura es habitual en relatos sobre bosques de arces, senderos de montaña y aldeas ocultas entre la niebla. Son rápidos al cambiar de dirección y observan con atención todo lo que sucede a su alrededor.", "Sus arreos acostumbran ser más ligeros que los de un caballo, con sillas estrechas, cordones trenzados y adornos discretos inspirados en la tradición de los Yūgen. La cola necesita espacio suficiente y las correas deben permitir que el animal encoja el cuerpo al atravesar pasos estrechos.", "El Kitsune rara vez responde bien a la impaciencia. Sus cuidadores combinan juegos, señales y recompensas para establecer una relación duradera. Se dice que no escoge al jinete más fuerte, sino al que sabe reconocer cuándo conviene avanzar y cuándo guardar silencio."]}, {"key": "lizard", "name": "Garranegra", "kind": "Montura especial", "origin": "Amarant", "species": "Gran lagarto", "tagline": "El vigía de las selvas húmedas", "life": "Poco documentada fuera de sus lugares de cría", "young": "La puesta y crianza dependen del calor y la humedad del territorio", "body": ["En las selvas de las Amarant, el Garranegra avanza entre raíces, rocas mojadas y aguas turbias con una seguridad sorprendente. Su cuerpo robusto y su piel de escamas oscuras lo hacen diferente de cualquier montura de pelo. Una cola poderosa le ayuda a mantener el equilibrio en terrenos inestables.", "La silla se asegura mediante un armazón flexible que distribuye el peso sin comprimir la caja torácica. Los arneses resisten la humedad, mientras que las mantas se secan después de cada jornada para evitar irritaciones en la piel. Sus garras deben revisarse con frecuencia; son una ventaja en barro y piedra, pero también pueden dañar suelos delicados.", "Los cuidadores lo acostumbran desde joven a reconocer señales, silbidos y rutas seguras. En días de calor busca sombra y agua, y durante las noches más frías se mueve con mayor lentitud. Su dueño aprende así que la selva impone sus propios ritmos."]}, {"key": "wolf", "name": "Huargo", "kind": "Montura especial", "origin": "Montaraces", "species": "Gran cánido", "tagline": "Hermano de la ventisca", "life": "Varía según manada y condiciones de vida", "young": "Las camadas requieren una crianza cercana y prolongada", "body": ["El huargo de los montaraces no es un simple lobo crecido. Sus patas fuertes, su pecho ancho y su pelaje espeso le permiten recorrer desfiladeros y bosques nevados con rapidez. Reconoce olores y sonidos imperceptibles para sus compañeros de viaje y suele detenerse antes de que el jinete advierta un peligro.", "Los arreos se confeccionan con correas ajustables y acolchados que evitan presionar el tórax. La silla es ligera para conservar la agilidad del animal y las alforjas no deben estorbarle al correr. Es habitual que los jinetes revisen almohadillas, garras y pelaje al regresar de una larga expedición.", "Los montaraces hablan del vínculo con un huargo como de una alianza y no de una posesión. La confianza se cultiva con tiempo, alimento compartido y respeto por sus instintos. Un huargo leal puede acompañar a su jinete a través de la tormenta, pero jamás será una bestia dócil a cualquier mano."]}, {"key": "sabertooth", "name": "Dientesable", "kind": "Montura especial", "origin": "Sin’Hair", "species": "Gran felino", "tagline": "La sombra de las grandes presas", "life": "Desconocida; los registros de ejemplares domesticados son escasos", "young": "Crías generalmente escasas y de cuidado exigente", "body": ["El Dientesable inspira temor incluso cuando permanece inmóvil. Sus grandes colmillos, hombros poderosos y andar sigiloso lo convierten en una presencia formidable en los territorios de los Sin’Hair. Se desplaza entre la maleza con pasos medidos y es capaz de lanzar carreras breves y explosivas.", "La silla debe permitir el trabajo flexible de la columna y no interferir con las potentes extremidades delanteras. Los arreos son ceñidos, ligeros y preparados para soportar movimientos repentinos. En los descansos se limpian correas, garras y colmillos; el animal requiere además abundante espacio y una alimentación apropiada.", "No es una montura para un viajero descuidado. Se muestra territorial y atento a su entorno, y una relación estable exige respeto por sus hábitos de caza y descanso. Quienes llegan a comprenderlo hablan de una criatura orgullosa, veloz y extraordinariamente perceptiva."]}];
    const book=document.getElementById('am-book'),left=document.getElementById('am-left'),right=document.getElementById('am-right'),turner=document.getElementById('am-turner');
    const cover=document.getElementById('am-cover-spread');
    const prev=document.getElementById('am-prev'),next=document.getElementById('am-next'),home=document.getElementById('am-home'),indicator=document.getElementById('am-indicator');
    const mq=window.matchMedia('(max-width:820px)');
    let state={spread:-1,side:0,mobile:mq.matches,busy:false};
    const escapeHTML=(str)=>String(str).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
    const leaf=(content,kind,number)=>`<article class="am-leaf am-leaf--${kind}">${content}${number?`<span class="am-page-num">${number}</span>`:''}</article>`;
    const indexHTML=()=>{
     const links=MOUNTS.map((m,i)=>`<button class="am-index-link" data-mount="${i}" title="Ir a ${escapeHTML(m.name)}"><img src="${IMG['icon_'+m.key]}" alt="" loading="eager" referrerpolicy="no-referrer"><span>${escapeHTML(m.name)}<small>${escapeHTML(m.kind)}${m.origin==='General'?'':` · ${escapeHTML(m.origin)}`}</small></span></button>`).join('');
     return `<span class="am-smallcaps">Libro de los viajeros · Folio I</span><h2>Índice de monturas</h2><p class="am-index-intro">Que cada senda encuentre su compañero.</p><div class="am-index-list">${links}</div><img class="am-ink-decoration" src="${IMG.ink}" alt="" aria-hidden="true">`;
    };
    // Los recursos externos no deben fallar en silencio. Estos avisos son visibles en la página.
    function reportBrokenImage(e){
      const image=e.target;
      if(!image || image.tagName!=='IMG' || image.dataset.amBroken==='yes') return;
      // Algunos uploads de Imgur conservaron una extensión distinta de la original.
      // Intentamos extensiones alternativas antes de declararlos fallidos.
      const current=image.currentSrc||image.src;
      const match= current.match(/^https:\/\/i\.imgur\.com\/([A-Za-z0-9]{7})\.(png|jpe?g|webp|gif)(?:[?#]|$)/i);
      if(match){
        const alternatives=['png','jpg','jpeg','webp','gif'];
        const tried=(image.dataset.amTried||'').split(',').filter(Boolean);
        const ext=match[2].toLowerCase();
        if(!tried.includes(ext))tried.push(ext);
        const candidate=alternatives.find(e=>!tried.includes(e));
        if(candidate){
          image.dataset.amTried=tried.join(',');
          image.src='https://i.imgur.com/'+match[1]+'.'+candidate;
          return;
        }
      }
      image.dataset.amBroken='yes';
      const src=image.currentSrc||image.src;
      console.warn(DEBUG, 'No se pudo cargar la imagen:', src);
      const frame=image.closest('.am-photo-frame');
      if(frame){
        image.remove();
        const warning=document.createElement('div');
        warning.className='am-legend-card';
        const label=document.createElement('strong');
        label.textContent='No se ha podido mostrar la ilustración.';
        const para=document.createElement('p');
        para.textContent='El servidor de imágenes no respondió correctamente. Comprueba el enlace original:';
        const link=document.createElement('a');
        link.href=src;
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.textContent='Abrir la imagen';
        warning.append(label,para,link);
        frame.append(warning);
      }else{
        const fallback=document.createElement('span');
        fallback.textContent='ᛟ';
        fallback.title='Icono no disponible';
        image.replaceWith(fallback);
      }
    }
    app.addEventListener('error',reportBrokenImage,true);

    const openingHTML=()=>`<span class="am-smallcaps">Prefacio del viajero</span><h2>Bestias de camino y leyenda</h2><img class="am-ornament" src="${IMG.feather}" alt=""><p>Un aventurero puede reconocer sus tierras por los caminos que recorre; sin embargo, también por las criaturas que le permiten atravesarlos.</p><p>Al comenzar el viaje, cada personaje puede disponer de un <strong>caballo</strong> mediante el paquete inicial, respetando la coherencia de su historia. Las monturas clásicas se adquieren en la tienda sin prerrequisitos; las especiales requieren oro y condiciones interpretativas vinculadas con sus lugares de origen.</p><p>Las monturas legendarias se reservan a eventos. Sus facultades, ventajas, desventajas y costes concretos se detallarán en la <strong>tienda del foro</strong>.</p><img class="am-pennant" src="${IMG.divider}" alt="" aria-hidden="true"><p><em>Estas notas descriptivas son provisionales y podrán crecer con el mundo de Aeternalis.</em></p>`;
    const photoHTML=(m,i)=>`<span class="am-smallcaps">Lámina ${String(i+1).padStart(2,'0')} · ${escapeHTML(m.kind)}</span><div class="am-photo-frame"><img src="${IMG[m.key]}" alt="Ilustración de ${escapeHTML(m.name)}, equipada para ser montada" loading="eager" decoding="async" referrerpolicy="no-referrer"></div><h2 class="am-animal-name">${escapeHTML(m.name)}</h2><p class="am-photo-caption">${escapeHTML(m.tagline)}</p><img class="am-photo-symbol" src="${IMG['icon_'+m.key]}" alt="" aria-hidden="true" loading="eager" referrerpolicy="no-referrer">`;
    const detailHTML=(m,i)=>`<span class="am-smallcaps">Anotaciones de campo · ${escapeHTML(m.kind)}</span><h2>${escapeHTML(m.name)}</h2><p class="am-detail-intro">${escapeHTML(m.tagline)}</p><div class="am-meta-row"><div class="am-meta"><b>Cultura o procedencia</b>${escapeHTML(m.origin)}</div><div class="am-meta"><b>Tipo</b>${escapeHTML(m.species)}</div></div><div class="am-reading">${m.body.map(p=>`<p>${escapeHTML(p)}</p>`).join('')}<div class="am-notes"><b>Vida:</b> ${escapeHTML(m.life)}.<br><b>Cría:</b> ${escapeHTML(m.young)}.</div></div><span class="am-smallcaps">Cuaderno del viajero · Registro ${String(i+1).padStart(2,'0')}</span>`;
    const legendLeft=()=>`<span class="am-smallcaps">Los anales aún cerrados</span><h2>Monturas legendarias</h2><img class="am-ornament" src="${IMG.ink}" alt="" aria-hidden="true"><div class="am-legend-card"><strong>Próximamente...</strong><p>Las monturas legendarias —incluidas algunas criaturas capaces de volar— no se adquieren mediante una compra ordinaria. Se reservan para acontecimientos y recompensas de eventos del foro.</p><p>Sus nombres y relatos todavía no han sido inscritos en estas páginas.</p></div><img class="am-pennant" src="${IMG.divider}" alt="" aria-hidden="true">`;
    const legendRight=()=>`<span class="am-smallcaps">Última nota</span><h2>Antes de emprender la ruta</h2><img class="am-ornament" src="${IMG.feather}" alt="" aria-hidden="true"><p>Las habilidades, ventajas y desventajas particulares de cada montura se describirán en la tienda del foro.</p><p>Este cuaderno presenta su apariencia, costumbres y maneras de viajar con ellas; no reemplaza los requisitos oficiales de obtención.</p><p><em>Guarda bien las páginas de tu viaje. Hay senderos que solo se descubren una vez.</em></p><img class="am-pennant" src="${IMG.divider}" alt="" aria-hidden="true">`;
    const spreads=[{left:{kind:'index',html:indexHTML()},right:{kind:'opening',html:openingHTML()}}];
    MOUNTS.forEach((m,i)=>spreads.push({left:{kind:'photo',html:photoHTML(m,i)},right:{kind:'detail',html:detailHTML(m,i)}}));
    spreads.push({left:{kind:'opening',html:legendLeft()},right:{kind:'opening',html:legendRight()}});
    function markup(p,no){return leaf(p.html,p.kind,no)}
    function render(){
     const s=spreads[state.spread];
     book.classList.toggle('is-cover',state.spread<0);
     if(state.spread<0){left.innerHTML='';right.innerHTML='';}
     else if(state.mobile){left.innerHTML='';right.innerHTML=markup(state.side===0?s.left:s.right,2*state.spread+state.side+1);}
     else{left.innerHTML=markup(s.left,2*state.spread+1);right.innerHTML=markup(s.right,2*state.spread+2)}
     prev.disabled=state.spread===-1;
     next.disabled=state.spread===spreads.length-1 && (!state.mobile || state.side===1);
     indicator.textContent=state.spread===-1?'Portada · Libro cerrado':(state.mobile?`Página ${2*state.spread+state.side+1} de ${spreads.length*2}`:`Páginas ${state.spread*2+1}–${state.spread*2+2} de ${spreads.length*2}`);
    }
    function move(toSpread,toSide=0){
     if(state.busy||toSpread<-1||toSpread>=spreads.length)return;
     const oldSpread=state.spread, oldSide=state.side;
     if(toSpread===oldSpread && toSide===oldSide)return;
     state.busy=true;
     const forward=toSpread>oldSpread || (toSpread===oldSpread&&toSide>oldSide);
     const finish=()=>{state.spread=toSpread;state.side=toSide;state.busy=false;turner.style.display='none';turner.className='am-turner';turner.innerHTML='';book.classList.remove('is-opening','is-closing','am-show-cover');render()};
     if(oldSpread===-1){
      state.spread=toSpread;state.side=toSide;book.classList.add('am-show-cover');render();book.classList.add('is-opening');
      window.setTimeout(finish,880);return;
     }
     if(toSpread===-1){
      book.classList.add('am-show-cover','is-closing');window.setTimeout(finish,880);return;
     }
     const from=spreads[oldSpread],target=spreads[toSpread];
     let front,back;
     if(state.mobile){
      front=oldSide===0?from.left:from.right;
      back=toSide===0?target.left:target.right;
      right.innerHTML=markup(back,toSpread*2+toSide+1);
      left.innerHTML='';
     }else if(forward){
      front=from.right;back=target.left;
      left.innerHTML=markup(from.left,oldSpread*2+1);
      right.innerHTML=markup(target.right,toSpread*2+2);
     }else{
      front=from.left;back=target.right;
      left.innerHTML=markup(target.left,toSpread*2+1);
      right.innerHTML=markup(from.right,oldSpread*2+2);
     }
     turner.innerHTML=`<div class="am-turner-face am-turner-front">${markup(front,0)}</div><div class="am-turner-face am-turner-back">${markup(back,0)}</div>`;
     turner.className='am-turner '+(forward?'to-next':'to-prev');turner.style.display='block';
     window.setTimeout(finish,885);
    }
    function forward(){if(state.busy)return;if(state.spread===-1){move(0,0);return}if(state.mobile&&state.side===0){move(state.spread,1);return}move(state.spread+1,0)}
    function backward(){if(state.busy)return;if(state.spread===-1)return;if(state.mobile&&state.side===1){move(state.spread,0);return}if(state.spread===0){move(-1,0);return}move(state.spread-1,state.mobile?1:0)}
    next.addEventListener('click',forward);
    prev.addEventListener('click',backward);
    home.addEventListener('click',()=>move(0,0));
    app.querySelector('#am-open-cover').addEventListener('click',()=>{if(state.spread===-1)forward()});
    app.addEventListener('click',e=>{const el=e.target.closest('[data-mount]');if(!el)return;const i=Number(el.getAttribute('data-mount'));if(Number.isInteger(i)&&i>=0&&i<MOUNTS.length)move(i+1,0)});
    document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes((document.activeElement && document.activeElement.tagName)))return;if(e.key==='ArrowRight'){e.preventDefault();forward()}if(e.key==='ArrowLeft'){e.preventDefault();backward()}if(e.key==='Home'){e.preventDefault();move(0,0)}});
    function checkSize(){const changed=state.mobile!==mq.matches;if(!changed)return;state.mobile=mq.matches;state.side=0;state.busy=false;turner.style.display='none';book.classList.remove('is-opening','is-closing','am-show-cover');render()}
    if(mq.addEventListener)mq.addEventListener('change',checkSize);else mq.addListener(checkSize);
    render();
    console.log(DEBUG, 'Libro montado con '+MOUNTS.length+' criaturas y '+spreads.length+' pliegos; imágenes de Imgur referenciadas individualmente.');
  } // initBook

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();