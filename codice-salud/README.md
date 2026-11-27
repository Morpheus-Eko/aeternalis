# Aeternalis · Tomo de Medicina v2.2

Libro médico ilustrado para Foroactivo. El **Códice de la Salud** absorbe en su lectura el contenido reglamentario del antiguo **Libro de las Pestilencias**, sin alterar sus umbrales, valores de pociones/hechizos, contadores de secuelas ni preguntas frecuentes.

## Publicación

El instalador maestro de Aeternalis debe estar activo una sola vez. En el mensaje correspondiente, introducir únicamente:

```html
<div class="hidethisprofile"></div>
<div id="ae-codice-salud"></div>
```

No añadir JS ni CSS al HTML de la publicación. El maestro detecta `#ae-codice-salud` y carga `css/codice-salud.css?v=2.0.0` y `js/codice-salud/visor.js?v=2.0.0`. La vista autónoma está en [codice-salud/index.html](./index.html), servida por GitHub Pages.

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
| `assets/medicina/atlas-v01/` | Grabados anatómicos, con etiquetas de estado editorial |
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
