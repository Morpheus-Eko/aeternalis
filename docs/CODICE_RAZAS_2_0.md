# Códice de Razas · Aeternalis 2.0

Las ocho razas abren una **ventana modal dentro del índice**, sin navegar a la publicación histórica. El foro conserva su índice original AE RAZAS v1.2; se añade un cargador que intercepta los botones.

## Archivos

- `data/razas/manifest.json`: orden, rótulos, colores, iconos, retratos y portadas.
- `data/razas/fichas/*.md`: ocho fichas de texto editables. Las siete originales conservan el contenido facilitado por el equipo; Yūgen contiene la propuesta de rework (marcada como tal).
- `js/razas/visor.js`: visor modal, navegación, índice y lectura de Markdown.
- `css/razas-modal.css`: apariencia aislada, diseño adaptativo y accesibilidad.
- `foroactivo/JS_CARGADOR_RAZAS.js`: único código que debe estar en el panel JS de Foroactivo.
- `razas-preview.html`: vista de prueba independiente del foro.

## Instalación en Foroactivo

1. Mantener la publicación original del directorio que contiene `id="ae-races-codex"` y las ocho tarjetas `ae-race-card--*`; **no** borrar ni cambiar sus enlaces a la ficha antigua (sirven como respaldo).
2. En el panel de administración, sección Módulos → Gestión de los códigos JavaScript, **desactivar el cargador de razas v1.2** (el que solo leía CSS desde `/hNUM-css-razas`) para evitar duplicaciones.
3. Crear o sustituir el JS del directorio con el contenido íntegro de `foroactivo/JS_CARGADOR_RAZAS.js`. Puede ejecutarse en todas las páginas porque comprueba `#ae-races-codex` antes de cargar.
4. No pegar CSS nuevo en h4 ni h5, ni modificar el CSS general del foro. Los estilos del modal viven en GitHub.
5. Probar el índice: clic en cada tarjeta, cierre por ×, Esc o fuera; navegación anterior/siguiente; teclas izquierda/derecha; índice superior; diseño móvil.

## Enlaces

- Prueba: https://morpheus-eko.github.io/aeternalis/razas-preview.html
- Manifiesto: https://morpheus-eko.github.io/aeternalis/data/razas/manifest.json

## Edición del lore

Para editar una raza, cambiar únicamente su archivo `data/razas/fichas/ID.md`. Un encabezado `#` abre una sección del índice, `##` una subsección y una línea que comienza por `>` muestra una nota destacada. Cada párrafo se separa con una línea vacía. No hace falta tocar el JS.

**Precisión editorial:** La actualización Yūgen procede del documento «Propuesta_Rework_Yugen_Aeternalis.docx», cuyo estado era *propuesta para revisión*. Los nombres de Iwagiri, Hanamori y Shiranui, los ritos y la Magia Kuro se publican en esa condición, no como canon ratificado. La ficha original de Yūgen no se borra de Foroactivo.

**Imágenes:** las ocho portadas usan los WebP optimizados existentes en `assets/razas/imagenes/`. Los retratos transparentes conservan por el momento sus URL de Imgur originales; no existe una copia individual equivalente entre los ocho WebP de la biblioteca. Ante fallo de esos retratos, la lectura sigue funcionando.

**Despliegue:** Los cambios a GitHub Pages se reflejan cuando termine su publicación. Si el índice usa una versión previa en caché, actualizar `VERSION` en el cargador.