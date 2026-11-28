# Aeternalis · Medallero v1.0.0
El Medallero se presenta como un Salón de las Distinciones conectado al cargador maestro. Sus **90 títulos, requisitos, premios y observaciones** provienen de Medallero.xlsx; los ocho grupos son exclusivamente de navegación.

## Instalación en Foroactivo
Reemplaza el contenido del post con:
```html
<!-- Aeternalis · Medallero v1.0.0. Mantener cargador maestro, no pegar estilos. -->
<div class="hidethisprofile"></div>
<div id="ae-medallero-app" aria-label="Salón de las Distinciones"><p>Abriendo el Medallero de Aeternalis…</p></div>
```
El maestro de Aeternalis ya carga automáticamente `css/medallero.css` y `js/medallero/visor.js` si existe `#ae-medallero-app`. No dupliques el cargador ni insertes CSS en el post.

## Directorios
- `data/medallero.json`: catálogo editable; no inventar reglas.
- `css/medallero.css`: estilos encapsulados y diseño responsive.
- `js/medallero/visor.js`: capítulos, buscador, fichas y paginación.
- `assets/medallero/iconos/medalla-NNN.webp`: ilustraciones asociadas en el Excel; 69 iconos con relación verificable.
- `medallero-preview.html`: vista previa independiente.

**Importante:** los 21 logros sin ilustración principal identificada se muestran con un símbolo provisional. No se atribuyen automáticamente recompensas ni estados de consecución a usuarios. La ausencia o fallo de un archivo de imagen muestra un emblema provisional, sin afectar la navegación.

Origen gráfico: imágenes conservadas en el paquete [medallero_prototipo_aeternalis.zip] generado a partir del Excel; subir iconos a `assets/medallero/iconos/` para mostrarlos desde GitHub Pages.
