# Aeternalis · Tomo de Medicina v2.4

Libro médico ilustrado para Foroactivo. El **Códice de la Salud** absorbe en su lectura el contenido reglamentario del antiguo **Libro de las Pestilencias**, sin alterar sus umbrales, valores de pociones/hechizos, contadores de secuelas ni preguntas frecuentes.

## Publicación

El instalador maestro de Aeternalis debe estar activo una sola vez. En el mensaje correspondiente, introducir únicamente:

```html
<div class="hidethisprofile"></div>
<div id="ae-codice-salud"></div>
```

No añadir JS ni CSS al HTML de la publicación. El maestro detecta `#ae-codice-salud` y carga `css/codice-salud.css?v=2.4.0` y `js/codice-salud/visor.js?v=2.4.0`. La vista autónoma está en [codice-salud/index.html](./index.html), servida por GitHub Pages.

## Inventario del tomo

- **88 folios** organizados en ocho secciones.
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

El archivo `assets/medicina/atlas-recortes-v01/indice-visor-racial.json` contiene una selección editorial legible por el visor; **no copia ni duplica los archivos de imagen**. Se presenta en las hojas «De la carne»: las fichas incluyen las figuras de mujer y hombre cuando la raza cuenta con ambos sexos, y en la hoja de notas se ven detalles anatómicos comparados. Se mantiene la imagen original como reserva si falla el índice y los grabados pueden ampliarse.

- **Amarant:** exclusivamente femeninas; no existe opción masculina en el índice.
- **Nórin:** se seleccionan provisionalmente las fuentes A, más próximas a las proporciones hobbit. Las B quedan archivadas para eventual revisión.
- **Resto de razas:** dibujos femenino y masculino disponibles. Cada imagen conserva trazabilidad de la lámina original y la clasificación `ilustracion_provisional`.
- **Transparencia:** los detalles se presentan con tinta transparente aproximada; sus bordes deben revisarse antes de uso final sobre fondos especialmente oscuros.

Los textos de los folios y rótulos son HTML con la tipografía heredada de Foroactivo: ninguna ilustración tiene títulos de interfaz incrustados. Los botones de navegación, los fondos de página y el reglamento antiguo siguen independientes de este atlas.

**Pruebas:** se ha comprobado la presencia de las 15 combinaciones de raza/sexo y la existencia de los archivos seleccionados en el árbol de GitHub; queda por contrastar su composición visual efectiva en una publicación real de Foroactivo y en móviles. Este índice no canoniza la anatomía de ninguna raza.
