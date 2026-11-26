# Códice de Razas · Aeternalis 2.0

Las ocho razas abren una **ventana modal dentro del índice**, sin navegar a la publicación histórica. El foro conserva su índice original AE RAZAS v1.2; se añade un cargador que intercepta los botones.

## Archivos

- `data/razas/manifest.json`: orden, rótulos, colores, iconos, retratos y portadas.
- `data/razas/fichas/*.md`: ocho fichas de texto editables. Las siete originales conservan el contenido facilitado por el equipo; Yūgen contiene la versión de las Tres Costas y Kuro ya integrada en la Cuarta Era.
- `js/razas/visor.js`: visor modal, navegación, índice y lectura de Markdown.
- `css/razas-modal.css`: contiene tanto la CSS original del índice AE RAZAS v1.2 como los estilos aislados del nuevo visor, con diseño adaptativo y accesibilidad.
- `foroactivo/JS_CARGADOR_RAZAS.js`: único código que debe estar en el panel JS de Foroactivo.
- `razas-preview.html`: vista de prueba independiente del foro.

## Instalación en Foroactivo

1. Mantener la publicación original del directorio que contiene `id="ae-races-codex"` y las ocho tarjetas `ae-race-card--*`; **no** borrar ni cambiar sus enlaces a la ficha antigua (sirven como respaldo).
2. En el panel de administración, sección Módulos → Gestión de los códigos JavaScript, **desactivar el cargador de razas v1.2** (el que solo leía CSS desde `/hNUM-css-razas`) para evitar duplicaciones.
3. Crear o sustituir el JS del directorio con el código de `foroactivo/JS_UNA_LINEA_INSTALACION.js`, que únicamente carga el archivo `foroactivo/JS_CARGADOR_RAZAS.js` desde GitHub Pages. Puede ejecutarse en todas las páginas porque el cargador comprueba `#ae-races-codex` antes de activar el visor.
4. No pegar CSS nuevo en h4 ni h5, ni modificar el CSS general del foro. Los estilos del modal viven en GitHub.
5. Probar el índice: clic en cada tarjeta, cierre por ×, Esc o fuera; navegación anterior/siguiente; teclas izquierda/derecha; índice superior; diseño móvil.

## Enlaces

- Prueba: https://morpheus-eko.github.io/aeternalis/razas-preview.html
- Manifiesto: https://morpheus-eko.github.io/aeternalis/data/razas/manifest.json

## Edición del lore

Para editar una raza, cambiar únicamente su archivo `data/razas/fichas/ID.md`. Un encabezado `#` abre una sección del índice, `##` una subsección y una línea que comienza por `>` muestra una nota destacada. Cada párrafo se separa con una línea vacía. No hace falta tocar el JS.

**Precisión editorial:** La actualización Yūgen nació como propuesta en «Propuesta_Rework_Yugen_Aeternalis.docx», pero los tres clanes, la patria insular y la bendición Kuro se han integrado expresamente en `data/cronologia/cuarta-era/codex-adaptado-yugen.md`. Los costes numéricos de Kuro, algunas festividades y los detalles cartográficos siguen abiertos a revisión. La ficha antigua de Yūgen no se borra de Foroactivo.

**Imágenes:** las ocho portadas usan los WebP optimizados existentes en `assets/razas/imagenes/`. Los retratos transparentes conservan por el momento sus URL de Imgur originales; no existe una copia individual equivalente entre los ocho WebP de la biblioteca. Ante fallo de esos retratos, la lectura sigue funcionando.

**Despliegue:** Los cambios a GitHub Pages se reflejan cuando termine su publicación. Si el índice usa una versión previa en caché, actualizar `VERSION` en el cargador.

## GitHub Pages

El repositorio incluye `.nojekyll` para publicar directamente los archivos `.md` como texto; sin esta opción Jekyll podría convertir las fichas a HTML y romper la lectura mediante `fetch`.

## Rework ornamental 2.1 (26 de noviembre de 2026)

**Alcance:** se conservan las ocho fichas Markdown, sus retratos, fondos, enlaces antiguos y el comportamiento del visor. Se añade un único bloque CSS aislado al final de `css/razas-modal.css`, identificado por `AETERNALIS_ORNAMENTOS_RAZAS_V2_1`.

- **Índice:** encuadernación de bronce, cantoneras, imagen de códice abierto, divisor en filigrana, tarjetas reforzadas y motivo decorativo individual en sus cartelas.
- **Visor:** cuatro cantoneras, estampas de cada pueblo en la portada, papel de lectura con textura oscura y ornamentos discretos en títulos, notas e índice.
- **Motivos:** el CSS asigna ocho recursos WebP de `assets/codex/` a las tarjetas; el motor coloca solo el atributo `data-ae-race` en el modal para seleccionar el adorno correspondiente. **No son blasones oficiales** y podrán sustituirse en cuanto se apruebe iconografía canónica.
- **Compatibilidad:** no se reemplazan las imágenes hero de `assets/razas/imagenes/`, la fotografía de personajes ni la implementación modal; accesibilidad y puntos de corte anteriores continúan.

**Actualización en Foroactivo:** el instalador `foroactivo/JS_UNA_LINEA_INSTALACION.js` pasa a `?v=2.1.0`, y el cargador descarga `css/razas-modal.css?v=2.1.0` y `js/razas/visor.js?v=2.1.0`. Si en Foroactivo sigue pegada una línea anterior, sustituirla (o actualizar el parámetro de versión) para evitar el caché. No es preciso añadir CSS al tema general del foro ni a h4/h5.

**Previsualización:** https://morpheus-eko.github.io/aeternalis/razas-preview.html
