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

## Rework ornamental 3.1 (26 de noviembre de 2026)

**Alcance:** solo presentación gráfica, sin cambios en los cinco textos, el orden de eras, el índice, los enlaces de respaldo o la navegación. Se conserva el CSS original y se añade al final un bloque aislado con marcador `AETERNALIS_ORNAMENTOS_CRONOLOGIA_V3_1`, fácil de revertir.

- **Directorio:** esquinas de bronce, cabecera con estrella y cinta, divisor de reloj de arena, marcos reforzados y sello detrás de cada icono histórico. Se mantienen los fondos y emblemas de las cinco eras.
- **Lector:** cantoneras de bronce, esfera armilar como marca de agua tenue, plumas y ornamentos de esquina, capitulares y separadores del Gran Códex, manteniendo legibilidad del pergamino.
- **Manifiesto:** los tres `separadores` y el `sello` ahora apuntan a `assets/codex/` (WebP transparentes publicados).
- **Rendimiento:** se reutilizan recursos existentes; no se incorporan hojas de sprites pesadas ni scripts nuevos. Los estilos permanecen aislados bajo `#aec-cronologia` y `#aec-chronicle-overlay`.
- **Responsive:** motivos pequeños en pantallas estrechas; animaciones respetan `prefers-reduced-motion`.

**Actualización en Foroactivo:** el instalador en `foroactivo/JS_INSTALAR_CRONOLOGIA_V3.js` enlaza al cargador `?v=3.1.0` y este solicita `css/cronologia-v3.css?v=3.1.0`. Si Foroactivo conserva el instalador anterior pegado en su panel, hay que sustituir su línea de instalación (o actualizar el parámetro `v`) para evitar el CSS guardado en caché. No es preciso alterar HTML ni pegar CSS en h4/h5.

**Previsualización:** https://morpheus-eko.github.io/aeternalis/cronologia-preview.html

Los emblemas, cantoneras y sellos añadidos son *elementos de interfaz*, no declaraciones canónicas de heráldica o símbolos oficiales de las eras.


## v3.2 · Escritura perdida y desbloqueos por trama

Génesis, Primera, Segunda y Tercera Era aparecen en el alfabeto ficticio Aen-Vahr. La Cuarta Era permanece legible. Para revelar pasajes, editar data/cronologia/desbloqueos.json: la clave `revelados` es una lista de índices, con 0 para el prólogo y 1 en adelante para los apartados ## del manuscrito original. Rangos: génesis 0–5, primera 0–6, segunda 0–6, tercera 0–8. Todos empiezan cerrados, sin botones de autodesbloqueo. El cliente no solicita los manuscritos sellados cuando ningún pasaje está liberado. La escritura Aen-Vahr es ambiental y no constituye una traducción literal ni agrega canon lingüístico.

**Nota de seguridad narrativa:** los relatos originales markdown permanecen públicos en GitHub, incluidos en el historial. La ocultación en el foro es visual, no criptográfica. Los futuros secretos que deban mantenerse realmente privados deben conservarse fuera del repositorio público y publicarse solo a medida que se revelen.


## v3.3 · Interfaz cifrada completa
Los cuatro capítulos sellados muestran glifos Aen-Vahr en todas las etiquetas visibles de sus tarjetas: número de capítulo, nombre de era, subtítulo y distintivo inferior. El visor usa la misma escritura para cabecera, prólogo, rótulos del lector y navegación entre eras. La Cuarta Era continúa en castellano y las desbloqueadas completamente vuelven a mostrar su título original. La configuración de desbloqueo y los relatos originales no se modifican.
