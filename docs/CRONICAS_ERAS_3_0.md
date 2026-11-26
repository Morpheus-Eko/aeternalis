# Aeternalis · Crónicas de las Eras 3.0

## Objetivo
Conservar las cinco tarjetas del directorio original y abrir las crónicas extensas sin abandonar la página de Foroactivo. La interfaz es un lector modal con portada, papel envejecido, sellos, glifos marginales (plumas y calaveras), runas, marcadores de sección y separadores provenientes de la biblioteca de GitHub. CSS y JS separados.

## Vista de prueba
https://morpheus-eko.github.io/aeternalis/cronologia-preview.html

## Archivos
- `data/cronologia/manifest.json`: orden, imágenes, colores y fuentes de los cinco capítulos.
- `data/cronologia/eras/*.md`: narraciones completas, un archivo por era.
- `js/cronologia/visor.js`: aplicación del índice y del lector.
- `css/cronologia-v3.css`: estilos originales del directorio v2 + lector v3; no modifica estilos de otros módulos.
- `foroactivo/JS_CARGADOR_CRONOLOGIA_V3.js`: cargador alojado en GitHub.
- `foroactivo/JS_INSTALAR_CRONOLOGIA_V3.js`: mínimo fragmento que se instala en Foroactivo.
- `foroactivo/HTML_CRONOLOGIA_V3.html`: HTML mínimo de la publicación.
- `data/cronologia/cuarta-era/codex-adaptado-yugen.md`: versión completa del Códice de la Cuarta Era con continuidad Yūgen.
- `docs/CONTINUIDAD_YUGEN_CODEX.md`: registro de los ajustes con respecto al manuscrito de origen.

## Activación en Foroactivo
1. Conservar el tema/post original, que debe contener `<div id="aec-cronologia"></div>`. Si no existe, usar el archivo HTML mínimo. No es necesario reemplazar el post si el id ya existe.
2. **Desactivar el JS anterior de Cronología v2**, para evitar que dos motores intenten escribir sobre `#aec-cronologia`.
3. En **Módulos → Gestión de los códigos JavaScript** de Foroactivo, pegar el contenido íntegro de `foroactivo/JS_INSTALAR_CRONOLOGIA_V3.js` (sin etiquetas `<script>`). Puedes elegir «En los temas» o «En todas las páginas»: el cargador se ejecuta solo si existe el contenedor.
4. Ya no es necesario que el JS de cronología lea estilos desde `/hNUM-css-cronologia`. **No borrar la página antigua** si contiene CSS utilizado por otros módulos; desactivar solamente el cargador viejo.
5. Probar los cinco botones, cambio de capítulo, barra de lectura, saltos a secciones, cierre por Escape/X/clic fuera, Tab y vista móvil. En caso de fallo de descarga de una era, se ofrece el enlace histórico.
6. Las modificaciones posteriores de narración se hacen en GitHub sin reescribir el JavaScript del foro. GitHub Pages puede tardar en servir commits nuevos.

## Fuentes, decisiones y canon
- Las cinco tarjetas corresponden a **Génesis, Primera, Segunda, Tercera y Cuarta Era**.
- El manuscrito `01_ Lore_ Mitología + Crono [Propuesta en construcción](2).docx` utiliza una periodización distinta: separa Fairae/dragones como Primera Era, desplaza otras etapas y denomina Quinta Era a la llegada de la humanidad. **Para este directorio se respeta el esquema público de cinco tarjetas**: la historia sagrada antigua se cuenta dentro del Génesis; migraciones y exilios en Primera; Guerra del Nox en Segunda; escuelas, confederación y Farathia en Tercera; humanidad, imperios y Guerra de Northia en Cuarta.
- La Cuarta Era sigue `02_ CODEX(1).docx`, con las alteraciones explícitas de `codex-adaptado-yugen.md`: Eko es hijo de Istak y avatar de caos y locura; bendición Kuro física de esencia vital; tres clanes Yūgen independientes en la isla del mar Ithar’iamil. **No existe Reino Yokai ni control de espíritus**.
- La lista base de veinte Aehnir se basa en la precisión editorial suministrada por el usuario. Las formas de nacimiento de los hijos de Anue, Nyeru y Rhoroe permanecen abiertas, por ser ideas y no decisiones canónicas confirmadas.
- El material antiguo contiene diferencias internas de fechas, nombres, títulos y etapas. La versión de lectura evita resolverlas inventando hechos; cuando corresponde, emplea expresiones aproximadas. No presenta los apartados rotulados FUERA DEL CANON como hechos establecidos.
- Se han preservado los cinco fondos y cinco emblemas panorámicos originales de Postimg para no modificar la portada familiar del índice.
- Ornamentación **alojada en GitHub**: fondos de Grimorio (cuero y pergamino), marca de agua arcana, separadores de filigrana/estrella/fases lunares y seis imágenes rúnicas. La calavera y la pluma marginal se reproducen como glifos en lugar de intentar descargar las imágenes individuales de Imgur, que el catálogo solo registra como enlaces externos sin una URL de archivo verificada.

## Alcance y limitaciones
- Este commit modifica el repositorio GitHub. **No instala de forma automática en Foroactivo**.
- Los documentos fuente y la versión anterior se conservan; los cambios son aditivos.
- Para futuras correcciones de textos, editar `data/cronologia/eras/id.md`. El índice de pasajes se genera automáticamente a partir de encabezados `##`.
