# Aeternalis · Tomo de Medicina v3.3.0

Libro médico ilustrado para Foroactivo. El **Códice de la Salud** absorbe en su lectura el contenido reglamentario del antiguo **Libro de las Pestilencias**, sin alterar sus umbrales, valores de pociones/hechizos, contadores de secuelas ni preguntas frecuentes.

## Publicación

El instalador maestro de Aeternalis debe estar activo una sola vez. En el mensaje correspondiente, introducir únicamente:

```html
<div class="hidethisprofile"></div>
<div id="ae-codice-salud"></div>
```

No añadir JS ni CSS al HTML de la publicación. El maestro detecta `#ae-codice-salud` y carga `css/codice-salud.css?v=3.3.0` y `js/codice-salud/visor.js?v=3.3.0`. La vista autónoma está en [codice-salud/index.html](./index.html), servida por GitHub Pages.

## Inventario del tomo

- **105 folios** organizados en ocho secciones.
- **8 razas**, con estudio del cuerpo, rasgos, hábitos y riesgos ambientales. Las láminas que no correspondan a anatomías aprobadas mantienen la advertencia editorial.
- **16 plantas** descritas e ilustradas con una lámina principal y un detalle de archivo. Algunas imágenes son aproximaciones **preliminares**, nunca una identificación botánica canónica.
- **3 pestilencias reglamentadas**: Fiebre de Driadem, Canto de la Orquídea Marchita y Sangrenegra, cada una con historia clínica, exposición, calculadora, secuelas y etiologías disputadas.
- **2 tablas** de consulta: umbrales y protecciones, y matriz de modificadores raciales.
- **Calculadora de exposición 1d100** y **calculadora de porcentaje de atributo efectivo** (redondeo hacia arriba). Ninguna realiza tiradas oficiales ni modifica una ficha.
- Capítulo de cuidados que separa paliación narrativa de los modificadores mecánicos, más cinco preguntas frecuentes y láminas archivadas.

## Separación de responsabilidades

| Archivo | Función |
| --- | --- |
| `js/codice-salud/visor.js` | Renderizado del libro, navegación, formularios y cálculos |
| `css/codice-salud.css` | Maquetación de folios, grabados marginales, tablas y controles |
| `data/codice-salud/compendio.json` | Anatomías, pueblos, territorios, botica y archivo |
| `data/pestilencias/enfermedades.json` | Fuente de verdad del reglamento antiguo: sin reescrituras |
| `data/codice-salud/iconografia-clinica-v01.json` | Selección gráfica para las 16 plantas, tres expedientes patológicos y mesa de cuidados |
| `codice-salud/iconografia.html` | Gabinete para revisión visual de grabados y utensilios; separado del libro principal |
| `assets/medicina/atlas-v01/` | Grabados anatómicos históricos, con etiquetas de estado editorial |
| `assets/medicina/atlas-recortes-v01/manifest.json` | Catálogo de 329 recortes individuales, disponibles en pergamino y tinta transparente |
| `assets/medicina/atlas-recortes-v01/indice-visor-racial.json` | Selección editorial de figuras y detalles separados para las ocho razas |
| `assets/medicina/herbario-v01/` | Recortes botánicos, con manifiesto de rutas publicadas |
| `assets/pestilencias/` | Sellos y botones de los legajos clásicos |

### Integridad del reglamento

Se conservan las ambigüedades documentadas: cuándo se resuelve la quinta exposición y con qué frecuencia progresa Sangrenegra fuera de la primera exposición. Esas decisiones siguen siendo competencia del staff. Los estudios botánicos, hipótesis médicas, cuidados narrativos y láminas de anatomía **no añaden reglas o inmunidades**.

El módulo `#ae-pestilencias` continúa funcionando en las publicaciones antiguas como compatibilidad histórica; para el **nuevo tomo** utilizar sólo `#ae-codice-salud`.

## Comprobaciones manuales pendientes

Comprobar en Foroactivo la tipografía real del tema, proporciones de folios en desktop y móvil, recortes transparentes en las plantas, y comportamiento del libro junto a CSS global antiguo. Las pruebas de sintaxis y estructura de datos no sustituyen una revisión visual integrada.

## Biblioteca gráfica temática · v2.2

Los nueve recursos visuales WebP están publicados en `assets/medicina/tomo-v02/`: cubierta cerrada (`portada_cuero_serpiente.webp`) y un fondo para cada raza (`pagina_humanos.webp`, `pagina_altos_elfos.webp`, `pagina_montaraces.webp`, `pagina_yugen.webp`, `pagina_enanos.webp`, `pagina_norin.webp`, `pagina_sinhair.webp`, `pagina_amarant.webp`).

`assets/medicina/tomo-v02/catalogo-tematico.json` contiene el estado de publicación, integridad de cada imagen y rutas utilizadas por el visor. Al abrir el libro aparece primero la cubierta **sin títulos impresos**; pulsarla abre el índice. En las páginas anatómicas cambia el fondo según la raza. El movimiento de hojas 3D se aplica a cambios adyacentes; el salto directo desde el índice no realiza giros encadenados. Se respeta `prefers-reduced-motion`.

Botones de retroceder y avanzar: imágenes sin rótulos visibles, tamaño equivalente, accesibles por nombre ARIA. Los mecanismos y las ilustraciones deberán comprobarse también en Foroactivo, donde la hoja de estilo del tema puede condicionar los tamaños.


## Fase 2 · Hojas raciales temáticas

La cubierta, los ocho fondos raciales WebP y sus hashes se encuentran en `assets/medicina/tomo-v02/catalogo-tematico.json`. Cada tema añade ahora dos referencias reutilizadas del inventario de Codex: `ornament` y `divider`, con un `accent` común para encabezados, campos y notas marginales. No hay títulos ni datos raciales pintados sobre las imágenes.

**Laboratorio visual:** [Comparar los ocho folios](./temas-raciales.html). Este visor independiente utiliza `temas-raciales.html`, `temas-raciales.css` y `temas-raciales.js`; permite revisar las ocho ornamentaciones y, desde v1.1, las figuras anatómicas de mujer y hombre seleccionadas de la nueva biblioteca (solo mujer para Amarant), sin recorrer el tomo ni modificar fichas. En pantallas estrechas se visualizan ambos folios.

En el visor principal, la raza se aplica a las dos páginas anatómicas de cada pueblo y a los capítulos de entorno, herbario y archivo cuando existe una adscripción territorial inequívoca. Las materias interraciales conservan el pergamino general para no sugerir que una sola raza les pertenece. La visualización no implica que las cualidades médicas provisionales sean canónicas.

La Fase 2 es una actualización visual. Las animaciones de paso, la paginación, los cálculos 1d100 y el reglamento original de pestilencias permanecen separados de estos assets.


## Fase 3 · Atlas anatómico comparado · v2.4

El tomo utiliza ahora la biblioteca de ilustraciones anatómicas separadas, además de las láminas y ornamentos anteriores. El catálogo global `assets/medicina/atlas-recortes-v01/manifest.json` comprende **329 recortes individuales**, sus **329 variantes de tinta transparente** y **21 fuentes WebP**.

El archivo `assets/medicina/atlas-recortes-v01/indice-visor-racial.json` contiene una selección editorial legible por el visor; **no copia ni duplica los archivos de imagen**. Se presenta en las hojas «De la carne»: las fichas incluyen las figuras de mujer y hombre cuando la raza cuenta con ambos sexos, y en la hoja derecha las notas toman prioridad, con un detalle anatómico marginal. Se mantiene la imagen original como reserva si falla el índice y los grabados pueden ampliarse.

- **Amarant:** exclusivamente femeninas; no existe opción masculina en el índice.
- **Nórin:** se seleccionan provisionalmente las fuentes A, más próximas a las proporciones hobbit. Las B quedan archivadas para eventual revisión.
- **Resto de razas:** dibujos femenino y masculino disponibles. Cada imagen conserva trazabilidad de la lámina original y la clasificación `ilustracion_provisional`.
- **Transparencia:** los detalles se presentan con tinta transparente aproximada; sus bordes deben revisarse antes de uso final sobre fondos especialmente oscuros.

Los textos de los folios y rótulos son HTML con la tipografía heredada de Foroactivo: ninguna ilustración tiene títulos de interfaz incrustados. Los botones de navegación, los fondos de página y el reglamento antiguo siguen independientes de este atlas.

**Pruebas:** se ha comprobado la presencia de las 15 combinaciones de raza/sexo y la existencia de los archivos seleccionados en el árbol de GitHub; queda por contrastar su composición visual efectiva en una publicación real de Foroactivo y en móviles. Este índice no canoniza la anatomía de ninguna raza.

## Fase 4 · Iconografía clínica y botánica · v2.5

**Nuevo archivo:** `data/codice-salud/iconografia-clinica-v01.json`. Se verificó que sus **63 referencias de imagen**, correspondientes a **55 recursos WebP únicos**, existan en el repositorio.

- **Materia médica:** cada una de las 16 fichas conserva su lámina principal y detalle provisional. Añade una ilustración de utensilio de botica contextual, tomada preferentemente de la misma lámina fuente (14 de 16) y, de otro modo, de la biblioteca genérica. El utensilio no acredita la receta exacta.
- **Tres pestilencias:** se añaden grabados anatómicos generales apropiados para acompañar la lectura de síntomas, historia clínica y secuelas, con una advertencia visible que impide confundirlos con diagnósticos canónicos o con el agente patógeno.
- **Cuidados:** los expedientes muestran un frasco, un sello arcano y un grabado de vendajes. El frasco y el sello **no son diseños oficiales** de Ouriler ni Astarax. Los valores numéricos siguen leyendo en tiempo real `data/pestilencias/enfermedades.json`, sin valores duplicados en la iconografía.
- **Presentación:** títulos y fichas continúan en HTML, con la tipografía del foro. Las imágenes sirven como ornamentos y diagramas; se mantienen CSS y JS en archivos distintos, encapsulados bajo `#ae-codice-salud`.

**Gabinete de revisión:** [Examinar ilustraciones clínicas](./iconografia.html). Permite filtrar por plantas, enfermedades y mesa de cuidados, ampliar los grabados y revisar la pertinencia editorial antes de aprobar o sustituir imágenes. No modifica el antiguo Códice de Pestilencias ni introduce páginas adicionales en el tomo.

**Validación:** sintaxis JS correcta para visor, maestro y gabinete; rutas presentes en GitHub; hash del reglamento `data/pestilencias/enfermedades.json` sin cambios. Queda pendiente la prueba visual en un tema real de Foroactivo y la aprobación artística de las ilustraciones provisionales.

## Fase 5 · Grabados patológicos originales · v2.6.1

Se incorporaron **24 archivos SVG** para las tres pestilencias: doce láminas completas sobre pergamino (`*_paciente.svg`, `*_signos.svg`, `*_organo.svg`, `*_cuidados.svg`) y doce reproducciones de **tinta transparente** (`*_tinta.svg`), sin textos incrustados. Las figuras, separadas por enfermedad, se encuentran en `assets/medicina/patologias-v01/` y están referenciadas desde `data/codice-salud/iconografia-clinica-v01.json` (versión 1.2.0). Se trata de **grabados vectoriales esquemáticos**, no imágenes clínicas realistas ni ilustraciones aprobadas como canon.

Las ilustraciones se usan del siguiente modo:
- Folio de enfermedad: paciente y signos visibles.
- Notas clínicas: paciente y órgano o sistema simbólico.
- Folio de secuelas: signos y órgano.
- Cuidados: mesa de botica ilustrativa por enfermedad y protecciones conservadas sin cambios.

La navegación y las calculadoras del Códice se mantienen. Los textos visibles siguen siendo HTML con tipografía heredada; los SVG no contienen leyendas ni títulos. Los diagramas se superponen directamente al pergamino mediante sus variantes con alfa y ofrecen enlace de ampliación a la versión archivística de cada lámina.

### Implementación en Foroactivo

El cargador maestro `js/aeternalis-maestro.js` incluye ahora la revisión `2.6.1` del módulo Salud. **Siempre que ese cargador ya esté instalado en el foro y una publicación contenga** `<div id="ae-codice-salud"></div>`, el nuevo visor se descargará desde GitHub Pages automáticamente al abrir la publicación. Para una nueva publicación, utilizar `foroactivo/HTML_CODICE_SALUD_PEGAR.txt` y no copiar la aplicación completa dentro del editor.

La actualización en GitHub **no garantiza por sí sola** la presencia del contenedor en un tema real ni demuestra que el editor de Foroactivo contenga el cargador maestro. Por ello, la implementación pública en Foroactivo aún requiere comprobación visual dentro de un tema de prueba.

**Verificaciones de entrega:** 24 rutas SVG disponibles en el repositorio; fuentes de reglas de las tres enfermedades sin modificar; revisión de sintaxis JavaScript de visor, maestro y gabinete completada.

## Fase 6 · Arquitectura de libro abierto · v3.0.0

La versión 3 sustituye la composición de barras por una arquitectura de códice de dos hojas: **el índice a la izquierda al abrir el libro** y la introducción a la derecha; las anatomías y las fichas del herbario se organizan en pliegos de **grabado a la izquierda y escritura a la derecha**. Las enfermedades también reservan pliegos de ilustración y apuntes clínicos. Los contenidos escritos no se cambian en los JSON.

- **Anchura:** hasta 1.800 px, con centrado relativo a la ventana para salir de mensajes de Foroactivo estrechos cuando el contenedor externo lo permite.
- **Flechas laterales:** un único asset gótico de dirección se utiliza en los dos cantos del tomo, invertido horizontalmente para retroceder; mismo tamaño de caja, alto, ornamento y posición vertical del 50 %. Se elimina la barra inferior.
- **Cintas y pestañas:** once señaladores de colores rojo, oro y bronce sobresalen del canto derecho; ocho enlazan con los capítulos y tres abren Índice, Herramientas (calculadora de exposición) y Notas del facultativo. En lectores de pantalla tienen etiquetas específicas y su estado activo se señala visualmente.
- **Índice izquierdo:** cartelas decoradas, grabados, emblemas por capítulo, lacre y separador de filigrana; títulos y numeración permanecen como texto HTML.
- **Fondo:** las páginas raciales y la ilustración del tema pasan a dos capas de agua y tinta con desenfoque y opacidad reducida. No se dibujan delante del texto. Los recortes anatómicos siguen siendo visibles únicamente en los folios cuya finalidad es ilustrar.
- **Lectura:** se elimina el scroll interno de `.ac-leaf__body`. Las hojas adaptan su altura a la extensión del contenido, sin truncarlo. La división automática de un caso excesivamente largo en hojas físicas adicionales aún no forma parte de este motor: requiere medición tipográfica en Foroactivo para evitar cortes arbitrarios.
- **Responsive:** libro doble a partir de 1.070 px de ancho real del visor; por debajo se presenta una sola hoja. El cambio concuerda entre la detección JS y las reglas CSS.

El módulo permanece encapsulado en `#ae-codice-salud`. No modificar el CSS base de Foroactivo ni instalar de nuevo el maestro si ya está activo. Las imágenes, sus rótulos, las calculadoras y las reglas se obtienen de fuentes separadas como antes.

**Pruebas completadas:** arranque, apertura, cierre, navegación a herbario y enfermedad, pestañas de índice/herramientas/notas, un folio móvil y navegación mediante API, con DOM simulado; sintaxis de JavaScript correcta, CSS con llaves equilibradas y referencias nuevas de assets existentes. **Pendiente:** comparación visual en un tema real, y verificar si el contenedor externo del tema recorta el libro ampliado.

## Fase 7 · Apostillas del facultativo · v3.2.0

Las casillas al pie de los folios ya no son avisos de revisión. Se transformaron en **notas manuscritas narrativas**, con pequeña ornamentación de pluma, observación del autor y firma de personaje ficticio (o `Autor desconocido`).

**Fuente:** `data/codice-salud/apostillas-facultativo-v01.json`. En su edición inicial registraba 93 apostillas: 24 para las ocho razas, 32 para 16 plantas, 25 para tres enfermedades, ocho para secciones y cuatro para herramientas generales.

- Cada raza tiene una observación para el grabado, otra para costumbres o riesgos, y una para su archivo.
- Cada planta tiene un comentario visual de herbolario y otro sobre preparación, cuidado o recolección.
- Cada pestilencia contiene observaciones diferenciadas para síntomas, historia clínica, ilustración, evolución de secuelas, hipótesis, exposición, cálculos, cuidados y deterioro (donde corresponde).
- El cajón lateral «Notas» presenta la misma apostilla del folio. Se sustituyeron textos visibles de «pendiente de aprobación», «borrador», «no es canon» y advertencias semejantes por fragmentos literarios.
- La identidad de los autores pertenece a la ambientación narrativa y **no se postula como personaje canónico** sin validación del staff. Las reglas, umbrales y calculadoras **siguen procediendo exclusivamente** de `data/pestilencias/enfermedades.json`.

Esta edición también consolida el archivo anatómico con exactamente 8 razas: Altos Elfos, Humanos, Nórin, Yūgen, Montaraces, Enanos, Sin'hair y Amarant. Las láminas del antiguo catálogo de anatomía no muerta se conservan solo en el expediente de la Fiebre de Driadem como comparaciones de deterioro orgánico, no como raza ni transformación clínica obligatoria. Los orcos y reptilianos quedan fuera del visor.

**Pruebas con DOM simulado:** se recorrieron los 105 folios; sus 201 apariciones de recuadros de glosa en dobles páginas fueron firmadas y no contienen etiquetas editoriales de borrador. Se comprobaron anotaciones de Elfos, Llantén y Fiebre de Driadem. Pendiente inspección visual real en Foroactivo.

## Fase 8 · Una apostilla por folio · v3.3.0

Se eliminó el **fallback automático de una misma glosa por sección**, así como la frase de relleno cuando no existe entrada. Ahora `glossRecord` retorna cadena vacía si el registro carece de texto; `glossPage` selecciona glosas por raza, planta, enfermedad o **título exacto del folio** y nunca reutiliza una nota de otro capítulo. Las cinco consultas reglamentarias tienen apostillas diferentes; las páginas sin texto propio pueden permanecer sin una.

Se añadieron 21 glosas específicas de páginas, con 19 firmas distintas; se reescribieron las ocho notas del archivo racial para evitar fórmulas repetidas y se distinguieron los comentarios de dos láminas de deterioro de Driadem. El fichero narrativo `data/codice-salud/apostillas-facultativo-v01.json` está en **v1.2.0** y contiene **115 textos distintos en su catálogo** (incluidas entradas legadas no reutilizadas automáticamente).

**Validación con lector simulado:** 105 folios, 53 pliegos, 103 glosas efectivamente mostradas en su recorrido único; **103 textos diferentes, ninguna glosa duplicada**. Todas tienen firma. El panel lateral Notas muestra la apostilla concreta o informa que no se conserva ninguna para esa página. Las reglas y las calculadoras siguen intactas. Pendiente la inspección en navegador Foroactivo real.
