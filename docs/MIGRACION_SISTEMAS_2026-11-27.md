# Migración de sistemas a GitHub — Aeternalis

## Rescatados y publicados

| Sistema | Archivo | Fuente | Estado |
| --- | --- | --- | --- |
| Calculadora de stats, Brújula Arcana v1.1 | `js/stats/calculadora.js` | 01_JS_COMPLETO_REEMPLAZO_V1_1.txt | Copia funcional adaptada a CSS en GitHub |
| Apariencia de la calculadora | `css/stats-brujula.css` | 02_CSS_COMPLETO_AÑADIR_A_H4.html | CSS encapsulado, sin tocar h4 |
| Manual / Grimorio de stats | `foroactivo/HTML_GRIMORIO_STATS.html` | 01_HTML_PUBLICACION.txt | HTML original |
| Apariencia del manual | `css/stats-grimorio.css` | 02_CSS_PAGINA_INDEPENDIENTE.txt | CSS original |
| Libro de Monturas v3.3 | `js/monturas/libro.js` | 01_JS_COMPLETO_MONTURAS_V3_3_CORREGIDO.txt | Copia con catálogo corregido por el usuario; CSS desde GitHub |
| Monturas — diseño | `css/monturas-libro.css` | 02_CSS_COMPLETO_MONTURAS_PARA_H4.html | CSS encapsulado; era 3.2, compatibilidad visual v3.3 por verificar |
| Libro Nórdico de Progresión — CSS | `css/progresion-libro.css` | 02_CSS_PARA_PAGINA_HTML.txt | Publicado; falta localizar HTML del libro |

## Cargadores, instalación y seguridad

Para insertar la calculadora en una publicación de Foroactivo, utilizar el HTML de `foroactivo/HTML_CALCULADORA_STATS.html` y cargar una sola vez `foroactivo/JS_CARGADOR_CALCULADORA_STATS.js` desde la Gestión de JavaScript, sin scripts anteriores de la Brújula. Para Monturas, utilizar `foroactivo/HTML_MONTURAS.html` y el cargador `foroactivo/JS_CARGADOR_MONTURAS.js`. **No activar estos cargadores todavía** en páginas donde los módulos antiguos sigan instalados: podrían duplicarse. Cada JS lee únicamente su hoja CSS desde GitHub y no escribe en la CSS base.

La versión 1.1 de la calculadora indica expresamente que está inspirada en la calculadora original de Arlequín. Se conserva ese crédito. La calculadora de creación emplea 9 atributos, base 5, bono racial 35, 25 puntos finales y máximo 20 durante la creación. **No confundir esos límites de creación con las cifras avanzadas de la progresión**.

La versión de Monturas contiene 10 tipos ilustrados. Sus imágenes originales siguen apuntando a Imgur; su migración física a los assets requiere revisar las correspondencias para no intercambiar monturas.

## Otros módulos ya existentes en GitHub

Supermapa, rutas terrestres y Carta Náutica; Astillero y Almirantazgo; Bestiario, razas y cronología. Mantenerlos sin cambios y evitar duplicar sus cargadores.

## Por terminar

1. Rescatar el contenido HTML del Libro Nórdico de Progresión; ya se conserva su CSS.
2. Versionar integralmente el texto de Sistema de magia (1).docx y revisar contradicciones con el nuevo lore Yūgen antes de declarar canon nuevo.
3. Crear un manifiesto de reglas de avance basado en fuentes completas, no estimar tablas de XP ni costes faltantes.
4. Inspeccionar si existen tienda, inventario, oficios, calendario de eventos y otras secciones fuera del repositorio.

## Segunda etapa: magia y progresión

- Magia: `foroactivo/HTML_MAGIA_CODICE.html` y `css/magia-codice.css`, recuperados de la publicación compacta y del CSS v1.1. Cargador de CSS GitHub: `foroactivo/JS_CARGADOR_MAGIA.js`; demostración: `magia-codice-preview.html`.
- Reglamentación íntegra de magia: `data/reglamentos/magia/sistema-magia-original.md`, transcripción sin reescritura de las 32 páginas del archivo «Sistema de magia (1).docx». Es una copia documental para revisión, no una revalidación automática del canon.
- Progresión: `css/progresion-libro.css` y `foroactivo/JS_CARGADOR_PROGRESION.js` están versionados; **no se encontró aún el HTML original** de `#aep-progress-book`. No se instaló un libro ficticio ni se inventó tabla de experiencia. `data/reglamentos/progresion/estado.json` guarda únicamente reglas mencionadas anteriormente como *pendientes de cotejo*.
